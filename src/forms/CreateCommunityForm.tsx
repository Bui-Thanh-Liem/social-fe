"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  useCreateCommunity,
  useGetAllCategories,
} from "~/apis/useFetchCommunity";
import { useUploadMedia } from "~/apis/useFetchUpload";
import { useGetFollowedById } from "~/apis/useFetchUser";
import { useDebounce } from "~/hooks/useDebounce";
import { cn } from "~/lib/utils";
import {
  CreateCommunityDtoSchema,
  type CreateCommunityDto,
} from "~/shared/dtos/req/community.dto";
import { EMembershipType, EVisibilityType } from "~/shared/enums/type.enum";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { useUserStore } from "~/store/useUserStore";
import { handleResponse } from "~/utils/toast";
import { toastSimple } from "~/utils/toast";
import { ButtonMain } from "~/components/ui/button";
import { CircularProgress } from "~/components/ui/circular-progress";
import { Divider } from "~/components/ui/divider";
import { Input, InputMain } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { SearchMain } from "~/components/ui/search";
import { SelectMain } from "~/components/ui/select";
import { TextareaMain } from "~/components/ui/textarea";
import { WrapIcon } from "~/components/WrapIcon";
import {
  UserFollower,
  UserFollowerSkeleton,
  UserSelected,
} from "./CreateConversationForm";

export function CreateCommunityForm({
  setOpenForm,
}: {
  setOpenForm: (open: boolean) => void;
}) {
  const [categoryText, setCategoryText] = useState("");
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [userSelected, setUserSelected] = useState<IUser[]>([]);
  const [userInvited, setUserInvited] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  //
  const { user } = useUserStore();

  //
  const apiCreateCommunity = useCreateCommunity();
  const apiUploadMedia = useUploadMedia();

  // Search
  const [searchVal, setSearchVal] = useState("");
  const debouncedSearchVal = useDebounce(searchVal, 500);

  //
  const [page, setPage] = useState(1);
  const total_page_ref = useRef(0);
  const [followers, setFollowers] = useState<IUser[]>([]);

  //
  const { data: cates } = useGetAllCategories();
  const { data, isLoading } = useGetFollowedById(user!._id!, {
    page: page.toString(),
    q: debouncedSearchVal,
    limit: "15",
  });

  // Mỗi lần fetch API xong thì merge vào state (loại bỏ duplicate)
  useEffect(() => {
    const items = data?.metadata?.items || [];
    const total_page = data?.metadata?.total_page;
    total_page_ref.current = total_page || 0;

    if (page === 1 && debouncedSearchVal) {
      setFollowers(items);
    } else {
      setFollowers((prev) => {
        const existIds = new Set(prev.map((c) => c._id.toString()));
        const newItems = items.filter(
          (item) => !existIds.has(item._id.toString()),
        );
        return [...prev, ...newItems];
      });
    }
  }, [data, debouncedSearchVal, page]);

  //
  function onSeeMore() {
    setPage((prev) => prev + 1);
  }

  //
  useEffect(() => {
    return () => {
      setPage(1);
      setFollowers([]);
    };
  }, []);

  //
  const {
    watch,
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCommunityDto>({
    resolver: zodResolver(CreateCommunityDtoSchema),
    defaultValues: {
      name: "",
      bio: "",
      category: "",
      cover: undefined,
      membership_type: EMembershipType.Open,
      visibility_type: EVisibilityType.Public,
    },
  });
  const categories = cates?.metadata || [];
  const valBio = watch("bio");

  //
  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const coverUrl = URL.createObjectURL(file);
      setCoverPreview(coverUrl);
    }
  };

  //
  function handleToggleUserFollower(val: IUser) {
    setUserSelected((prev) => {
      const exists = prev.some((u) => u._id === val._id);
      let res = [...prev];

      if (exists) {
        // Nếu đã có thì filter bỏ đi
        res = prev.filter((u) => u._id !== val._id);
      } else {
        // Nếu chưa có thì thêm vào
        res = [...prev, val];
      }

      setUserInvited(res.map((user) => user._id));
      return res;
    });
  }

  //
  const onSubmit = async (data: CreateCommunityDto) => {
    startTransition(async () => {
      if (!data.category && !categoryText) {
        toastSimple(
          "Danh mục / dịch vụ không được để trống, bạn có thể tạo mới hoặc chọn mục đã có sẵn.",
          "error",
        );
        return;
      }

      if (categoryText.length > 10) {
        toastSimple("Danh mục / dịch vụ tối đa 16 kí tự.", "error");
        return;
      }

      if (coverFile) {
        const resUploadCover = await apiUploadMedia.mutateAsync([coverFile]);
        if (resUploadCover.statusCode !== 200 || !resUploadCover.metadata) {
          handleResponse(resUploadCover);
          return;
        }
        data.cover = {
          s3_key: resUploadCover?.metadata[0].s3_key,
          url: resUploadCover?.metadata[0].url || "",
        };
      }

      const res = await apiCreateCommunity.mutateAsync({
        ...data,
        category: categoryText || data.category,
        ...(userInvited.length > 0 ? { member_ids: userInvited } : {}),
      });

      handleResponse(res, successForm);
    });
  };

  //
  function successForm() {
    setOpenForm(false);
    reset();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center justify-center"
    >
      <div className="mt-4 space-y-6 w-full md:min-w-[460px]">
        <div className="relative mb-4">
          <div
            className="relative h-44 w-full bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200 transition-colors"
            style={{
              backgroundImage: coverPreview ? `url(${coverPreview})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              className="hidden"
              id="cover-photo-upload"
            />

            {/* Icon upload */}
            <div className="absolute inset-0 flex items-center justify-center">
              <WrapIcon
                onClick={() =>
                  document.getElementById("cover-photo-upload")?.click()
                }
              >
                <Upload className="w-5 h-5" />
              </WrapIcon>
            </div>
          </div>
        </div>

        <InputMain
          id="name"
          name="name"
          sizeInput="lg"
          label="Tên cộng đồng"
          errors={errors}
          control={control}
          register={register}
          placeholder="Cộng động Developer"
          required
          isMaxLength
          maxCountLength={32}
        />

        <div className="relative">
          <TextareaMain
            id="bio"
            name="bio"
            label="Tiểu sử"
            errors={errors}
            control={control}
            register={register}
            className="min-h-[100px] resize-none"
            placeholder="Viết một vài dòng về cộng động của bạn"
            maxCountLength={200}
          />
          <div className="absolute right-1 bottom-1">
            <CircularProgress
              value={!valBio?.length ? 0 : valBio?.length}
              max={200}
              size={20}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium line-clamp-1">
              Lĩnh vực / Danh mục (ưu tiên)
            </Label>
            <Input
              className="mt-2 h-12 py-6 text-lg px-3"
              id="category"
              value={categoryText}
              placeholder="Tạo mới"
              onChange={(e) => setCategoryText(e.target.value)}
            />
          </div>
          <SelectMain
            control={control}
            options={categories?.map((item) => ({
              label: item,
              value: item,
            }))}
            id="suggest"
            errors={errors}
            name="category"
            size="lg"
            placeholder="Lĩnh vực / Danh mục"
            label="Cộng đồng khác đã dùng"
            classname={cn(
              "mt-1",
              categories?.length > 0 ? "" : "pointer-events-none",
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <SelectMain
            control={control}
            options={Object.values(EVisibilityType).map((val) => ({
              label: val,
              value: val,
            }))}
            placeholder="Chế độ xem"
            errors={errors}
            id="visibility_type"
            name="visibility_type"
            size="lg"
            label="Cài đặt hiển thị"
          />
          <SelectMain
            control={control}
            options={Object.values(EMembershipType).map((val) => ({
              label: val,
              value: val,
            }))}
            size="lg"
            placeholder="Cài đặt tham gia"
            errors={errors}
            id="membership_type"
            name="membership_type"
            label="Cài đặt tham gia"
          />
        </div>

        <div className="flex flex-col items-center justify-center">
          <Divider
            className="w-80"
            text="Mời những người dùng đang theo dõi bạn"
          />
        </div>

        <div className="grid grid-cols-12">
          <div className="col-span-7 border-r pr-4 ">
            <SearchMain
              size="sm"
              value={searchVal}
              onChange={setSearchVal}
              onClear={() => setSearchVal("")}
            />
            <div className="space-y-2 h-96 max-h-96 overflow-auto mt-2">
              {followers?.map((user) => (
                <UserFollower
                  isCheck={userSelected.some((_) => _._id === user._id)}
                  user={user}
                  key={user._id}
                  onCheck={() => handleToggleUserFollower(user)}
                />
              ))}

              {isLoading &&
                Array.from({ length: 4 }, (_, i) => (
                  <UserFollowerSkeleton key={i} />
                ))}

              {/* Loading khi load thêm */}
              {isLoading ? (
                <div>
                  {Array.from({ length: 2 }).map((_, i) => (
                    <UserFollowerSkeleton key={`more-${i}`} />
                  ))}
                </div>
              ) : (
                !!followers.length && (
                  <div className="px-4 py-3">
                    <p
                      className={cn(
                        "inline-block text-sm leading-snug font-semibold text-[#1d9bf0] cursor-pointer",
                        total_page_ref.current <= page
                          ? "text-gray-300 pointer-events-none cursor-default"
                          : "",
                      )}
                      onClick={onSeeMore}
                    >
                      Xem thêm
                    </p>
                  </div>
                )
              )}

              {!followers.length && (
                <div className="h-full flex items-center justify-center">
                  <p className="text-sm text-gray-400">
                    Chưa có người dùng theo dõi bạn.
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="mt-10 col-span-5 px-2 space-y-2 max-h-96 overflow-auto">
            {userSelected?.map((user) => (
              <UserSelected
                user={user}
                key={user._id}
                onCancel={() => handleToggleUserFollower(user)}
              />
            ))}
            {!userSelected.length && (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-gray-400">Bạn chưa mời.</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <ButtonMain
            size="lg"
            type="button"
            className="flex-1"
            variant="outline"
            onClick={() => setOpenForm(false)}
          >
            Hủy
          </ButtonMain>
          <ButtonMain
            size="lg"
            className="w-1/2"
            loading={isPending}
            disabled={isPending}
          >
            Tạo
          </ButtonMain>
        </div>
      </div>
    </form>
  );
}
