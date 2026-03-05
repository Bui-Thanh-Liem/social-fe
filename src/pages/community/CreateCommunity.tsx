import { useState } from "react";
import { CreateCommunityForm } from "~/forms/CreateCommunityForm";
import { DialogMain } from "~/components/ui/dialog";
import { Plus } from "lucide-react";

export function CreateCommunity() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/*  */}
      <div
        onClick={() => setIsOpen(true)}
        className="flex gap-x-3 p-2 rounded-full hover:bg-gray-100 cursor-pointer"
      >
        <Plus size={20} /> <span className="text-[16px]">Tạo mới</span>
      </div>
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
