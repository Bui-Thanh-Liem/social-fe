import { useState } from "react";
import { CreateCommunityForm } from "~/forms/CreateCommunityForm";
import { CreateGroupIcon } from "~/components/icons/create-group";
import { DialogMain } from "~/components/ui/dialog";
import { WrapIcon } from "~/components/WrapIcon";

export function CreateCommunity() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <WrapIcon onClick={() => setIsOpen(true)} className="p-1 border">
        <CreateGroupIcon size={26} />
      </WrapIcon>

      {/*  */}
      <DialogMain
        isLogo={false}
        open={isOpen}
        onOpenChange={setIsOpen}
        textHeader="Tạo cộng đồng mới"
        textDesc="Cộng đồng là nơi sẽ tách biệt với dòng thời gian của bạn."
        width="xl"
      >
        <CreateCommunityForm setOpenForm={setIsOpen} />
      </DialogMain>
    </>
  );
}
