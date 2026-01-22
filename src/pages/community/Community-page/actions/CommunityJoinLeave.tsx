import { LogOut } from "lucide-react";
import { useState } from "react";
import { ButtonMain } from "~/components/ui/button";
import { WrapIcon } from "~/components/wrapIcon";
import { useJoinCommunity, useLeaveCommunity } from "~/apis/useFetchCommunity";
import { EMembershipType } from "~/shared/enums/type.enum";
import type { ICommunity } from "~/shared/interfaces/schemas/community.interface";
import { handleResponse } from "~/utils/toast";
import { useUserStore } from "~/store/useUserStore";

export function CommunityJoinLeave({ community }: { community: ICommunity }) {
  const { user } = useUserStore();
  const [is_joined, setIsJoined] = useState(community.is_joined);
  const isInvite = community?.invited?.some(
    (invite) => invite.user_id === user?._id,
  );

  //
  const apiJoinCommunity = useJoinCommunity();
  const apiLeaveCommunity = useLeaveCommunity();

  //
  async function handleJoin() {
    const res = await apiJoinCommunity.mutateAsync({
      community_id: community?._id || "",
    });
    handleResponse(res, () => {
      setIsJoined(true);
    });
  }

  //
  async function handleLeave() {
    const res = await apiLeaveCommunity.mutateAsync({
      community_id: community?._id || "",
    });
    handleResponse(res, () => {
      setIsJoined(false);
    });
  }

  return (
    <>
      {is_joined ? (
        !community.is_admin && (
          <WrapIcon className="border border-red-100" onClick={handleLeave}>
            <LogOut size={18} color="#fb2c36" />
          </WrapIcon>
        )
      ) : community?.membership_type === EMembershipType.Open || isInvite ? (
        <ButtonMain size="sm" onClick={handleJoin}>
          Tham gia
        </ButtonMain>
      ) : null}
    </>
  );
}
