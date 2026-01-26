import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import { EmojiIcon } from "./icons/emoji";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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
          <EmojiIcon />
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
