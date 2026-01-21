import { useEffect, useState } from "react";
import { UpdateMeForm } from "~/forms/UpdateMeForm";
import { MessageIcon } from "~/components/icons/messages";
import { ButtonMain } from "~/components/ui/button";
import { DialogMain } from "~/components/ui/dialog";
import { WrapIcon } from "~/components/wrapIcon";
import { useCreateConversation } from "~/apis/useFetchConversations";
import { useFollowUser } from "~/apis/useFetchFollow";
import { EConversationType } from "~/shared/enums/type.enum";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { useChatBoxStore } from "~/store/useChatBoxStore";
import { useUserStore } from "~/store/useUserStore";
import { toastSimpleVerify } from "~/utils/toast";
import { LogOut } from "lucide-react";
import { useLogout } from "~/apis/useFetchAuth";

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
          <ProfileEdit currentUser={profile as IUser} />
          <WrapIcon className="mt-20 border lg:hidden" onClick={onLogout}>
            <LogOut size={20} color="red" />
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
