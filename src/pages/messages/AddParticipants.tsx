import { useState } from "react";
import { AddParticipantsForm } from "~/forms/AddParticipantsForm";
import { CreateGroupIcon } from "~/components/icons/create-group";
import { DialogMain } from "~/components/ui/dialog";
import { WrapIcon } from "~/components/WrapIcon";
import type { IConversation } from "~/shared/interfaces/schemas/conversation.interface";

export function AddParticipants({
  conversation,
}: {
  conversation: IConversation;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <WrapIcon onClick={() => setIsOpen(true)} className="p-1.5">
        <CreateGroupIcon size={22} />
      </WrapIcon>

      {/*  */}
      <DialogMain
        isLogo={false}
        open={isOpen}
        onOpenChange={setIsOpen}
        textHeader="Thêm thành viên "
        textDesc="Hãy cân nhắc cẩn thận trước khi thêm ai đó vào nhóm."
        width="xl"
      >
        <AddParticipantsForm
          setOpenForm={setIsOpen}
          conversation={conversation}
        />
      </DialogMain>
    </>
  );
}
