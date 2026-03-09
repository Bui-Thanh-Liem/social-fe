import { useState } from "react";
import { DialogMain } from "../ui/dialog";
import { SearchAdvanced } from "./SearchAdvanced";
import { Search } from "lucide-react";

export function SearchAdvancedMobile() {
  //
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span className="block lg:hidden">
      <Search onClick={() => setIsOpen(true)} />

      <DialogMain
        width="2xl"
        isLogo={false}
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <div className="pt-1">
          <SearchAdvanced />
        </div>
      </DialogMain>
    </span>
  );
}
