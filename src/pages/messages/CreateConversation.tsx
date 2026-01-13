import { useState } from "react";
import { CreateConversationForm } from "~/forms/CreateConversationForm";
import { CreateGroupIcon } from "~/components/icons/create-group";
import { DialogMain } from "~/components/ui/dialog";
import { WrapIcon } from "~/components/wrapIcon";

export function CreateConversation({
  initialUserIds,
}: {
  initialUserIds: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <WrapIcon onClick={() => setIsOpen(true)} className="p-1.5">
        <CreateGroupIcon />
      </WrapIcon>

      {/*  */}
      <DialogMain
        isLogo={false}
        open={isOpen}
        onOpenChange={setIsOpen}
        textHeader="Tạo nhóm"
        textDesc="Một nhóm yêu cầu 3 thành viên trở lên."
        width="xl"
      >
        <CreateConversationForm
          setOpenForm={setIsOpen}
          initialUserIds={initialUserIds}
        />
      </DialogMain>
    </>
  );
}
