import { UserPlus } from "lucide-react";
import { useState } from "react";
import { DialogMain } from "~/components/ui/dialog";
import { WrapIcon } from "~/components/wrap-icon";
import { CreateConversationForm } from "~/forms/create-conversation-form";

export function CreateConversation({
  initialUserIds,
}: {
  initialUserIds: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <WrapIcon onClick={() => setIsOpen(true)} className="p-1.5">
        <UserPlus size={20} />
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
