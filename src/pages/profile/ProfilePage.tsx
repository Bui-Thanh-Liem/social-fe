import { Calendar, Globe, MapPin } from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "~/components/icons/arrow-left";
import { CloseIcon } from "~/components/icons/close";
import { VerifyIcon } from "~/components/icons/verify";
import { AvatarMain } from "~/components/ui/avatar";
import { ButtonMain } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { WrapIcon } from "~/components/wrapIcon";
import { useGetOneByUsername, useResendVerifyEmail } from "~/apis/useFetchUser";
import { CONSTANT_DEFAULT_TITLE_DOCUMENT } from "~/shared/constants/default-title-document";
import { ETweetType } from "~/shared/enums/type.enum";
import { useUserStore } from "~/store/useUserStore";
import { ProfileAction } from "./ProfileAction";
import { ProfileLiked } from "./ProfileLiked";
import { ProfileMedia } from "./ProfileMedia";
import { ProfileTweets } from "./ProfileTweets";
import { handleResponse } from "~/utils/toast";
import { formatDateToDateVN } from "~/utils/date-time";
import { ErrorResponse } from "~/components/error";

export function ProfilePage() {
  const navigate = useNavigate();
  const { username } = useParams(); // Đặt tên params ở <App />
  const { user } = useUserStore();
  const { data, refetch, isLoading, error } = useGetOneByUsername(username!);
  const apiResendVerifyEmail = useResendVerifyEmail();

  //
  const [isLoadingSendMail, startTransition] = useTransition();

  // Extract profile data to avoid repetitive data?.metadata calls
  const profile = data?.metadata;

  //
  const [isOpenVerify, setOpenVerify] = useState(false);

  // Check if current user is viewing their own profile
  const isOwnProfile = useMemo(
    () => user?._id === profile?._id,
    [user?._id, profile?._id]
  );

  //
  useEffect(() => {
    document.title = username || CONSTANT_DEFAULT_TITLE_DOCUMENT;
    return () => {
      document.title = CONSTANT_DEFAULT_TITLE_DOCUMENT;
    };
  }, []);

  //
  useEffect(() => {
    setOpenVerify(Boolean(!profile?.verify));
  }, [profile?.verify]);

  //
  useEffect(() => {
    if (username) {
      refetch(); // Gọi lại API khi username thay đổi
    }
  }, [username, refetch]);

  // Error handling
  if (error) {
    return (
      <ErrorResponse
        onRetry={() => {
          refetch();
        }}
      />
    );
  }

  // Loading state
  if (isLoading && !data) {
    return <ProfileSkeleton />;
  }

  // User not found
  if (data?.statusCode === 404) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-xl font-bold text-gray-600 mb-2">
          Không tìm thấy người dùng
        </h2>
        <p className="text-gray-500">{username} không tồn tại hoặc đã bị xóa</p>
      </div>
    );
  }

  //
  async function resendVerifyEmail() {
    startTransition(async () => {
      const res = await apiResendVerifyEmail.mutateAsync();
      handleResponse(res);
    });
  }

  return (
    <div>
      {/* Header */}
      <div className="px-3 flex justify-between items-center border border-gray-100">
        <div className="flex h-12 items-center gap-4">
          <WrapIcon
            onClick={() => navigate(-1)}
            aria-label="Quay lại"
            className="hidden lg:block"
          >
            <ArrowLeftIcon color="#000" />
          </WrapIcon>
          <p className="font-semibold text-[20px]">{profile?.name}</p>
        </div>
      </div>

      <div className="max-h-screen overflow-y-auto scrollbar-hide">
        {/* Photo cover */}
        <div className="relative w-full">
          <div className="w-full h-52">
            <img
              alt="Cover Photo"
              className="w-full h-full object-cover"
              src={profile?.cover_photo?.url || "/favicon.png"}
            />
          </div>
        </div>

        {/* Profile Section */}
        <div className="px-4">
          {/* Avatar and Edit Button */}
          <div className="flex justify-between items-start -mt-16 mb-3">
            <AvatarMain
              src={profile?.avatar?.url}
              alt={profile?.name}
              className="w-32 h-32 border-4 border-white"
            />

            <ProfileAction profile={profile!} isOwnProfile={isOwnProfile} />
          </div>

          {/* <!-- Name and Username --> */}
          <div className="mb-3">
            <h2 className="text-xl font-bold flex items-center gap-1">
              {profile?.name}{" "}
              <VerifyIcon active={!!profile?.verify} size={20} />
            </h2>
            <p className="text-gray-500">{profile?.username}</p>
          </div>

          {/* <!-- Bio --> */}
          <div className="mb-3">
            <p className="leading-relaxed whitespace-break-spaces">
              {profile?.bio}
            </p>
          </div>

          {/* <!-- Location, Website and Join Date --> */}
          <div className="flex items-center space-x-4 text-gray-500 text-sm mb-3">
            {profile?.location && (
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{profile?.location}</span>
              </div>
            )}
            {profile?.website && (
              <a href={profile.website} target="_blank" className="group">
                <div className="flex items-center space-x-1">
                  <Globe className="w-4 h-4" />
                  <span className="group-hover:underline">
                    {profile?.website}
                  </span>
                </div>
              </a>
            )}
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>
                Đã tham gia{" "}
                {formatDateToDateVN(new Date(profile?.created_at || ""))}
              </span>
            </div>
          </div>

          {/* <!-- Following and Followers --> */}
          <div className="flex items-center space-x-4 text-sm mb-4">
            <Link
              to={`/${username}/following`}
              className="hover:underline cursor-pointer"
            >
              <span className="font-semibold">{profile?.following_count}</span>
              <span className="text-gray-500"> đang theo dõi</span>
            </Link>
            <Link
              to={`/${username}/followers`}
              className="hover:underline cursor-pointer"
            >
              <span className="font-semibold">{profile?.follower_count}</span>
              <span className="text-gray-500"> người theo dõi</span>
            </Link>
          </div>

          {/* Verify email */}
          {isOwnProfile && isOpenVerify && (
            <div className="mt-4 mb-4 bg-green-100 border border-green-200 rounded-xl p-4 relative">
              <button
                className="outline-0 absolute top-3 right-3 text-gray-600 hover:text-gray-800 cursor-pointer"
                onClick={() => setOpenVerify(false)}
              >
                <CloseIcon color="#333" size={18} />
              </button>
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-black font-bold text-lg">
                  Bạn chưa được xác minh
                </h3>
                <VerifyIcon color="#000" size={22} />
              </div>
              <p className="text-gray-700 mb-4">
                Hãy xác minh để nhận được phản hồi tốt hơn, phân tích, duyệt web
                không quảng cáo và nhiều hơn nữa. Nâng cấp hồ sơ của bạn ngay.
              </p>
              <ButtonMain
                loading={isLoadingSendMail}
                onClick={resendVerifyEmail}
              >
                Xác minh
              </ButtonMain>
            </div>
          )}
        </div>

        {/* Tweets and media*/}
        <Tabs defaultValue={ETweetType.Tweet.toString()} className="mb-12">
          <div className="bg-white sticky mt-4 top-0 z-50">
            <TabsList className="w-full">
              <TabsTrigger
                className="cursor-pointer"
                value={ETweetType.Tweet.toString()}
              >
                Bài viết
              </TabsTrigger>
              <TabsTrigger
                className="cursor-pointer"
                value={ETweetType.Retweet.toString()}
              >
                Đăng lại
              </TabsTrigger>
              <TabsTrigger
                className="cursor-pointer line-clamp-2"
                value={ETweetType.QuoteTweet.toString()}
              >
                Đăng lại có trích dẫn
              </TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="highlights">
                Nổi bật
              </TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="media">
                Hình ảnh/video
              </TabsTrigger>
              {isOwnProfile && (
                <TabsTrigger className="cursor-pointer" value="likes">
                  Đã thích
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="pt-0">
            <TabsContent
              value={ETweetType.Tweet.toString()}
              className="px-0 py-4"
            >
              <div className="space-y-4">
                <ProfileTweets
                  isOwnProfile={isOwnProfile}
                  tweetType={ETweetType.Tweet}
                  profile_id={profile?._id || ""}
                />
              </div>
            </TabsContent>

            <TabsContent
              value={ETweetType.Retweet.toString()}
              className="px-0 py-4"
            >
              <div className="space-y-4">
                <ProfileTweets
                  isOwnProfile={isOwnProfile}
                  tweetType={ETweetType.Retweet}
                  profile_id={profile?._id || ""}
                />
              </div>
            </TabsContent>

            <TabsContent
              value={ETweetType.QuoteTweet.toString()}
              className="px-0 py-4"
            >
              <div className="space-y-4">
                <ProfileTweets
                  isOwnProfile={isOwnProfile}
                  tweetType={ETweetType.QuoteTweet}
                  profile_id={profile?._id || ""}
                />
              </div>
            </TabsContent>

            <TabsContent value="highlights" className="px-0 py-4">
              <div className="space-y-4">
                <ProfileTweets
                  ishl={"1"}
                  isOwnProfile={isOwnProfile}
                  tweetType={ETweetType.Tweet}
                  profile_id={profile?._id || ""}
                />
              </div>
            </TabsContent>

            <TabsContent value="media" className="px-0 py-4">
              <div className="space-y-4">
                <ProfileMedia
                  profile_id={profile?._id || ""}
                  isOwnProfile={isOwnProfile}
                />
              </div>
            </TabsContent>

            {isOwnProfile && (
              <TabsContent value="likes" className="px-0 py-4">
                <div className="space-y-4">
                  <ProfileLiked profile_id={profile?._id || ""} />
                </div>
              </TabsContent>
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="px-3 flex justify-between items-center border border-gray-100">
        <div className="flex h-12 items-center gap-4">
          <div className="w-8 h-8 bg-gray-200 rounded-full" />
          <div className="h-5 w-32 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="max-h-screen overflow-y-auto">
        {/* Cover Photo Skeleton */}
        <div className="w-full h-52 bg-gray-200" />

        {/* Profile Section */}
        <div className="px-4">
          {/* Avatar and Action Button */}
          <div className="flex justify-between items-start -mt-16 mb-3">
            <div className="w-32 h-32 bg-gray-300 rounded-full border-4 border-white" />
            <div className="mt-3 h-9 w-28 bg-gray-200 rounded-full" />
          </div>

          {/* Name and Username */}
          <div className="mb-3">
            <div className="h-6 w-40 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>

          {/* Bio */}
          <div className="mb-3 space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
          </div>

          {/* Location, Website and Join Date */}
          <div className="flex items-center space-x-4 mb-3">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-4 w-36 bg-gray-200 rounded" />
          </div>

          {/* Following and Followers */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-4 w-36 bg-gray-200 rounded" />
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="bg-white p-2 px-4 sticky top-0">
          <div className="flex space-x-2">
            <div className="h-10 w-24 bg-gray-200 rounded" />
            <div className="h-10 w-32 bg-gray-200 rounded" />
            <div className="h-10 w-20 bg-gray-200 rounded" />
            <div className="h-10 w-28 bg-gray-200 rounded" />
          </div>
        </div>

        {/* Tweet Items Skeleton */}
        <div className="px-4 py-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-b border-gray-100 pb-4">
              <div className="flex space-x-3">
                {/* Avatar */}
                <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0" />

                {/* Content */}
                <div className="flex-1 space-y-2">
                  {/* Name and username */}
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-28 bg-gray-200 rounded" />
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                  </div>

                  {/* Tweet content */}
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-200 rounded" />
                    <div className="h-4 w-5/6 bg-gray-200 rounded" />
                    <div className="h-4 w-4/6 bg-gray-200 rounded" />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-12 mt-3">
                    <div className="h-4 w-12 bg-gray-200 rounded" />
                    <div className="h-4 w-12 bg-gray-200 rounded" />
                    <div className="h-4 w-12 bg-gray-200 rounded" />
                    <div className="h-4 w-12 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
