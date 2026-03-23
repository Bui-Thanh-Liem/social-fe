import { Check, CodeXml, X } from "lucide-react";
import { DialogMain } from "../ui/dialog";
import { useState } from "react";
import { WrapIcon } from "../WrapIcon";
import { Input } from "../ui/input";

export function Embed({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <CodeXml
        color="#1d9bf0"
        size={20}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      />

      <DialogMain
        isLogo={false}
        open={isOpen}
        onOpenChange={setIsOpen}
        textDesc="Nhập liên kết từ YouTube/Tiktok/Twitter"
      >
        <Input
          value={value}
          placeholder="https://youtu.be/gkFam1iYWf8?si=HxsXnilz08xbuTXz"
          className="my-1"
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="flex justify-end gap-x-2 mt-2 -mb-6">
          <WrapIcon
            onClick={() => {
              onChange("");
              setIsOpen(!isOpen);
            }}
          >
            <X color="red" size={20} />
          </WrapIcon>
          <WrapIcon onClick={() => setIsOpen(false)}>
            <Check color="#00BCFF" size={20} />
          </WrapIcon>
        </div>
      </DialogMain>
    </>
  );
}
