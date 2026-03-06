import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { SmilePlus } from "lucide-react";

export function EmojiSelector({
  onEmojiClick,
}: {
  onEmojiClick: (emoji: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span onClick={() => setOpen(!open)}>
          <SmilePlus color="#1d9bf0" size={20} />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-0 border-0 z-[2000]">
        <EmojiPicker
          onEmojiClick={(emojiData) => onEmojiClick(emojiData.emoji)}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
