"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounce } from "~/hooks/useDebounce";
import { useAddParticipants } from "~/apis/useFetchConversations";
import { useGetFollowedById } from "~/apis/useFetchUser";
import { cn } from "~/lib/utils";
import {
  ParticipantsDtoSchema,
  type AddParticipantsBodyDto,
} from "~/shared/dtos/req/conversation.dto";
import type { IConversation } from "~/shared/interfaces/schemas/conversation.interface";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { useUserStore } from "~/store/useUserStore";
import { ButtonMain } from "~/components/ui/button";
import { Divider } from "~/components/ui/divider";
import { SearchMain } from "~/components/ui/search";
import {
  UserFollower,
  UserFollowerSkeleton,
  UserSelected,
} from "./CreateConversationForm";
import { handleResponse, toastSimpleVerify } from "~/utils/toast";

export function AddParticipantsForm({
  setOpenForm,
  conversation,
}: {
  conversation: IConversation;
  setOpenForm: (open: boolean) => void;
}) {
  const { participants } = conversation;
  const [userSelected, setUserSelected] = useState<IUser[]>([]);
  const { user } = useUserStore();

  // Search
  const [searchVal, setSearchVal] = useState("");
  const debouncedSearchVal = useDebounce(searchVal, 500);

  //
  const [page, setPage] = useState(1);
  const total_page_ref = useRef(0);
  const [followers, setFollowers] = useState<IUser[]>([]);

  //
  const apiAddParticipants = useAddParticipants();

  const { data, isLoading } = useGetFollowedById(user!._id!, {
    page: page.toString(),
    q: debouncedSearchVal,
    limit: "15",
  });

  // Mỗi lần fetch API xong thì merge vào state (loại bỏ duplicate)
  useEffect(() => {
    //
    const participant_ids = (participants as unknown as IUser[]).map(
      (user) => user._id
    );

    const items =
      data?.metadata?.items.filter(
        (user) => !participant_ids.includes(user._id)
      ) || [];
    const total_page = data?.metadata?.total_page;
    total_page_ref.current = total_page || 0;

    if (page === 1 && debouncedSearchVal) {
      setFollowers(items);
    } else {
      setFollowers((prev) => {
        const existIds = new Set(prev.map((c) => c._id.toString()));
        const newItems = items.filter(
          (item) => !existIds.has(item._id.toString())
        );
        return [...prev, ...newItems];
      });
    }
  }, [data, debouncedSearchVal, page, participants]);

  //
  useEffect(() => {
    return () => {
      setPage(1);
      setFollowers([]);
    };
  }, []);

  //
  function onSeeMore() {
    setPage((prev) => prev + 1);
  }

  //
  const {
    reset,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<AddParticipantsBodyDto>({
    resolver: zodResolver(ParticipantsDtoSchema),
    defaultValues: {
      participants: [],
    },
  });

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

      setValue(
        "participants",
        res.map((user) => user._id)
      );
      return res;
    });
  }

  //
  const onSubmit = async (data: AddParticipantsBodyDto) => {
    if (user && !user?.verify) {
      toastSimpleVerify();
      return;
    }

    const res = await apiAddParticipants.mutateAsync({
      payload: data,
      conv_id: conversation._id,
    });
    handleResponse(res, successForm);
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
      <div className="mt-4 space-y-6 min-w-[460px]">
        <div className="flex flex-col items-center justify-center">
          <Divider className="w-80" text="Những người dùng đang theo dõi bạn" />
          <p className="text-xs text-red-400">
            {errors && errors?.participants
              ? errors.participants?.message
              : null}
          </p>
        </div>

        <div className="grid grid-cols-12">
          <div className="col-span-7 border-r pr-4">
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
                          : ""
                      )}
                      onClick={onSeeMore}
                    >
                      Xem thêm
                    </p>
                  </div>
                )
              )}

              {!followers?.length && (
                <div className="h-full flex items-center justify-center">
                  <p className="text-sm text-gray-400">
                    Chưa có người dùng theo dõi bạn.
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="mt-10 col-span-5 px-2 space-y-2 h-96 max-h-96 overflow-auto">
            {userSelected?.map((user) => (
              <UserSelected
                user={user}
                key={user._id}
                onCancel={() => handleToggleUserFollower(user)}
              />
            ))}
            {!userSelected.length && (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-gray-400">Bạn chưa chọn.</p>
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
          <ButtonMain size="lg" className="w-1/2">
            Tiếp theo
          </ButtonMain>
        </div>
      </div>
    </form>
  );
}
