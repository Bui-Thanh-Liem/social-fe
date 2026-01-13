import { ChevronsUp, Crown, LogOut, Users } from "lucide-react";
import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { AvatarMain } from "~/components/ui/avatar";
import { DialogMain } from "~/components/ui/dialog";
import { WrapIcon } from "~/components/wrapIcon";
import {
  usePromoteMentor,
  useRemoveParticipants,
} from "~/apis/useFetchConversations";
import type { IConversation } from "~/shared/interfaces/schemas/conversation.interface";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { useConversationActiveStore } from "~/store/useConversationActiveStore";
import { useUserStore } from "~/store/useUserStore";
import { handleResponse } from "~/utils/toast";

export function ParticipantList({
  conversation,
}: {
  conversation: IConversation;
}) {
  const { user } = useUserStore();
  const { setActiveId } = useConversationActiveStore();
  const { participants, mentors } = conversation;
  const [_participants, setParticipants] = useState<IUser[]>(
    participants as unknown as IUser[]
  );
  const [_mentors, setMentors] = useState<string[]>(
    mentors as unknown as string[]
  );
  const [isOpen, setIsOpen] = useState(false);

  //
  const is_mentor = useCallback(
    (_user: IUser) => _mentors.includes(_user._id),
    [_mentors]
  );

  //
  const apiRemoveParticipants = useRemoveParticipants();
  const apiPromoteMentor = usePromoteMentor();

  //
  async function removeConversation(participantId: string) {
    const res = await apiRemoveParticipants.mutateAsync({
      payload: { participants: [participantId] },
      conv_id: conversation._id,
    });

    // Xoá trước trên client UX tốt
    handleResponse(res, () => {
      setParticipants((prev) => {
        const _prev = [...prev] as unknown as IUser[];
        return _prev.filter((x) => x._id !== participantId);
      });

      // Hàm này thực hiện khi chính bản thân mình rời khỏi nhóm.
      if (user?._id === participantId) setActiveId("");
    });
  }

  //
  async function promoteUserToMentor(participantId: string) {
    const res = await apiPromoteMentor.mutateAsync({
      payload: { participants: [participantId] },
      conv_id: conversation._id,
    });

    // Cập nhật trước trên client UX tốt
    handleResponse(res, () => {
      setMentors((prev) => [...prev, participantId]);
    });
  }

  return (
    <>
      <WrapIcon onClick={() => setIsOpen(true)}>
        <Users size={18} color="#000" />
      </WrapIcon>

      {/*  */}
      <DialogMain
        isLogo={false}
        open={isOpen}
        onOpenChange={setIsOpen}
        textHeader="Danh sách thành viên "
        textDesc="Tất cả thành viên trong nhóm."
        width="md"
      >
        <div className="space-y-2.5">
          {(_participants as unknown as IUser[]).map((u) => (
            <div
              key={u._id}
              className="flex items-center justify-between hover:bg-gray-100 p-2 rounded-sm group"
            >
              <Link
                to={`/${u.username}`}
                className="flex items-center gap-3 cursor-pointer relative"
              >
                <AvatarMain
                  src={u.avatar?.url}
                  alt={u.name}
                  className="w-10 h-10"
                />
                <p className="max-w-40 line-clamp-1 hover:underline">
                  {u.name}
                </p>
                {is_mentor(u) && (
                  <Crown
                    size={18}
                    color="orange"
                    className="absolute top-0 -left-2"
                  />
                )}
              </Link>

              {(is_mentor(user!) || user?._id === u._id) && (
                <div className="items-center gap-x-3 hidden group-hover:flex">
                  {!is_mentor(u!) && is_mentor(user!) && (
                    <WrapIcon onClick={() => promoteUserToMentor(u._id)}>
                      <ChevronsUp size={18} color="#666" />
                    </WrapIcon>
                  )}

                  {(!is_mentor(u!) || u._id === user?._id) && (
                    <WrapIcon
                      className="p-1.5"
                      onClick={() => removeConversation(u._id)}
                    >
                      <LogOut size={18} color="#fb2c36" />
                    </WrapIcon>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogMain>
    </>
  );
}
