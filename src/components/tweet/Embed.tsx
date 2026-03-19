import { Check, CodeXml, X } from "lucide-react";
import { DialogMain } from "../ui/dialog";
import { useState } from "react";
import ReactCodeMirror, { EditorView } from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { WrapIcon } from "../WrapIcon";

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
        textDesc="Nhập mã nhúng (embed code) từ YouTube, để hiển thị nội dung đa phương tiện trực tiếp trong bài viết của bạn."
      >
        <ReactCodeMirror
          theme="dark"
          value={value}
          minHeight="80px"
          maxHeight="400px"
          onChange={(value) => onChange(value)}
          extensions={[
            html(),
            EditorView.lineWrapping, // 🔥 QUAN TRỌNG
          ]}
        />
        <div className="flex justify-end gap-x-2 mt-2 -mb-6 ">
          <WrapIcon
            onClick={() => {
              onChange("");
              setIsOpen(!isOpen);
            }}
          >
            {" "}
            <X color="red" />
          </WrapIcon>
          <WrapIcon onClick={() => setIsOpen(false)}>
            <Check color="#00BCFF" />
          </WrapIcon>
        </div>
      </DialogMain>
    </>
  );
}
