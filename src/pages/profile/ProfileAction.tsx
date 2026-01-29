import { useEffect, useState } from "react";
import { UpdateMeForm } from "~/forms/UpdateMeForm";
import { MessageIcon } from "~/components/icons/messages";
import { ButtonMain } from "~/components/ui/button";
import { DialogMain } from "~/components/ui/dialog";
import { WrapIcon } from "~/components/WrapIcon";
import { useCreateConversation } from "~/apis/useFetchConversations";
import { useFollowUser } from "~/apis/useFetchFollow";
import { EConversationType } from "~/shared/enums/type.enum";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { useChatBoxStore } from "~/store/useChatBoxStore";
import { useUserStore } from "~/store/useUserStore";
import { toastSimpleVerify } from "~/utils/toast";
import {
  BarChart3,
  Bookmark,
  ChartNoAxesCombined,
  Heart,
  LoaderCircle,
  LogOut,
} from "lucide-react";
import { useLogout } from "~/apis/useFetchAuth";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { useCountViewLinkBookmarkInWeek } from "~/apis/useFetchTweet";
import type { ChartData } from "recharts/types/state/chartDataSlice";
import { useNavigate } from "react-router-dom";

interface IProfileActiveProps {
  isOwnProfile: boolean;
  profile: IUser;
}

// Edit profile
export function ProfileEdit({ currentUser }: { currentUser: IUser }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ButtonMain
        variant="outline"
        className="mt-20"
        onClick={() => setIsOpen(true)}
      >
        Chỉnh sửa hồ sơ
      </ButtonMain>

      {/*  */}
      <DialogMain
        open={isOpen}
        onOpenChange={setIsOpen}
        textHeader="Chỉnh sửa hồ sơ"
        textDesc=""
        isLogo={false}
      >
        <UpdateMeForm setOpenForm={setIsOpen} currentUser={currentUser} />
      </DialogMain>
    </>
  );
}

//
export function ProfileAction({ profile, isOwnProfile }: IProfileActiveProps) {
  const { user } = useUserStore();
  const navigate = useNavigate();

  //
  const logout = useLogout();

  //
  const { open, setConversation } = useChatBoxStore();
  const [isFollow, setIsFollow] = useState(false);

  //
  const { mutate } = useFollowUser();
  const apiCreateConversation = useCreateConversation();

  //
  useEffect(() => {
    setIsFollow(!!profile?.isFollow);
  }, [profile?.isFollow]);

  //
  async function handleOpenCheckBox() {
    if (user && !user?.verify) {
      toastSimpleVerify();
      return;
    }

    const res = await apiCreateConversation.mutateAsync({
      type: EConversationType.Private,
      participants: [profile?._id],
    });
    if (res.statusCode === 200 && res?.metadata) {
      setConversation(res?.metadata);

      // Mobile không mở hộp chat
      if (window.innerWidth < 768) {
        navigate("/messages");
        return;
      }

      // Mở hộp chat
      open();
    }
  }

  //
  function handleFollow() {
    if (user && !user?.verify) {
      toastSimpleVerify();
      return;
    }
    mutate({
      user_id: profile._id,
      username: profile.username || "",
    });
    setIsFollow(!isFollow);
  }

  //
  async function onLogout() {
    await logout.mutateAsync();
  }

  return (
    <>
      {isOwnProfile ? (
        <div className="flex items-center gap-2 ">
          <ChartProfileAction />
          <ProfileEdit currentUser={profile as IUser} />
          <WrapIcon className="mt-20 border lg:hidden" onClick={onLogout}>
            <LogOut size={22} color="red" />
          </WrapIcon>
        </div>
      ) : (
        <div className="flex items-center gap-x-3 mt-20">
          <WrapIcon className="border" onClick={handleOpenCheckBox}>
            <MessageIcon size={18} />
          </WrapIcon>
          {
            <ButtonMain size="sm" onClick={handleFollow}>
              {!isFollow ? "Theo dõi" : "Bỏ theo dõi"}
            </ButtonMain>
          }
        </div>
      )}
    </>
  );
}

//
export function ChartProfileAction() {
  const { data: loe, isLoading } = useCountViewLinkBookmarkInWeek();
  const data_views = loe?.metadata?.tweet_views_count;
  const data_likes = loe?.metadata?.tweet_likes_count;
  const data_bookmarks = loe?.metadata?.tweet_bookmarks_count;

  return (
    <Drawer>
      <DrawerTrigger asChild className="hidden md:block">
        <WrapIcon className="mt-20 border">
          {isLoading ? (
            <LoaderCircle size={22} className="animate-spin" />
          ) : (
            <ChartNoAxesCombined size={22} />
          )}
        </WrapIcon>
      </DrawerTrigger>
      <DrawerContent>
        <div className="flex justify-between pb-4">
          <div className="mx-auto w-full max-w-md">
            <DrawerHeader>
              <DrawerTitle>Lượt thích</DrawerTitle>
              <DrawerDescription>
                Tổng lượt thích bài viết/bình luận của bạn nhận được.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0">
              <div className="flex items-center justify-center space-x-2">
                <Heart />
                <div className="flex-1 text-center">
                  <div className="text-7xl font-bold tracking-tighter">
                    {data_likes?.total_views || 0}
                  </div>
                  <div className="text-muted-foreground text-[0.70rem]">
                    Lượt thích / tuần này
                  </div>
                </div>
                <Heart color="#f6339a" />
              </div>
              <div className="mt-3">
                <BarChart
                  style={{
                    width: "100%",
                    maxWidth: "700px",
                    maxHeight: "70vh",
                    aspectRatio: 1.618,
                  }}
                  responsive
                  data={data_likes?.data as ChartData}
                  margin={{
                    top: 5,
                    right: 0,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis width="auto" />
                  <Tooltip />
                  <Bar
                    dataKey="tt"
                    name="tuần trước"
                    fill="gray"
                    activeBar={{ fill: "gray", stroke: "gray" }}
                    radius={[10, 10, 0, 0]}
                  />
                  <Bar
                    dataKey="tn"
                    name="tuần này"
                    fill="#f6339a"
                    activeBar={{ fill: "#f6339a", stroke: "#f6339a" }}
                    radius={[10, 10, 0, 0]}
                  />
                </BarChart>
              </div>
            </div>
          </div>
          <div className="mx-auto w-full max-w-md">
            <DrawerHeader>
              <DrawerTitle>Lượt Xem</DrawerTitle>
              <DrawerDescription>
                Tổng lượt xem bài viết/bình luận của bạn nhận được.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0">
              <div className="flex items-center justify-center space-x-2">
                <BarChart3 />
                <div className="flex-1 text-center">
                  <div className="text-7xl font-bold tracking-tighter">
                    {data_views?.total_views || 0}
                  </div>
                  <div className="text-muted-foreground text-[0.70rem]">
                    Lượt xem / tuần này
                  </div>
                </div>
                <BarChart3 color="orange" />
              </div>
              <div className="mt-3">
                <BarChart
                  style={{
                    width: "100%",
                    maxWidth: "700px",
                    maxHeight: "70vh",
                    aspectRatio: 1.618,
                  }}
                  responsive
                  data={data_views?.data as ChartData}
                  margin={{
                    top: 5,
                    right: 0,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis width="auto" />
                  <Tooltip />
                  <Bar
                    dataKey="tt"
                    name="tuần trước"
                    fill="gray"
                    activeBar={{ fill: "gray", stroke: "gray" }}
                    radius={[10, 10, 0, 0]}
                  />
                  <Bar
                    dataKey="tn"
                    name="tuần này"
                    fill="orange"
                    activeBar={{ fill: "orange", stroke: "orange" }}
                    radius={[10, 10, 0, 0]}
                  />
                </BarChart>
              </div>
            </div>
          </div>
          <div className="mx-auto w-full max-w-md">
            <DrawerHeader>
              <DrawerTitle>Lượt dấu trang</DrawerTitle>
              <DrawerDescription>
                Tổng lượt dấu trang bài viết/bình luận của bạn nhận được.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0">
              <div className="flex items-center justify-center space-x-2">
                <Bookmark />
                <div className="flex-1 text-center">
                  <div className="text-7xl font-bold tracking-tighter">
                    {data_bookmarks?.total_views || 0}
                  </div>
                  <div className="text-muted-foreground text-[0.70rem]">
                    Dấu trang / tuần này
                  </div>
                </div>
                <Bookmark color="#2a7fff" />
              </div>
              <div className="mt-3">
                <BarChart
                  style={{
                    width: "100%",
                    maxWidth: "700px",
                    maxHeight: "70vh",
                    aspectRatio: 1.618,
                  }}
                  responsive
                  data={data_bookmarks?.data as ChartData}
                  margin={{
                    top: 5,
                    right: 0,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis width="auto" />
                  <Tooltip />
                  <Bar
                    dataKey="tt"
                    name="tuần trước"
                    fill="gray"
                    activeBar={{ fill: "gray", stroke: "gray" }}
                    radius={[10, 10, 0, 0]}
                  />
                  <Bar
                    dataKey="tn"
                    name="tuần này"
                    fill="#2a7fff"
                    activeBar={{ fill: "#2a7fff", stroke: "#2a7fff" }}
                    radius={[10, 10, 0, 0]}
                  />
                </BarChart>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
