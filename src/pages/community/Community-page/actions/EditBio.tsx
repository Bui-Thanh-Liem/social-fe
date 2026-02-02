import { Check, Pencil, X } from "lucide-react";
import { useState } from "react";
import { useChangeInfoCommunity } from "~/apis/useFetchCommunity";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { WrapIcon } from "~/components/WrapIcon";
import { handleResponse } from "~/utils/toast";

export function Bio({
  community,
}: {
  community: { _id: string; bio: string; is_admin: boolean };
}) {
  const [editingBio, setEditingBio] = useState(false);
  const apiChangeInfo = useChangeInfoCommunity();

  //
  function handleClickToggle() {
    setEditingBio(!editingBio);
  }

  //
  async function handleSaveBio() {
    const res = await apiChangeInfo.mutateAsync({
      id: community._id,
      payload: {
        bio: (document.querySelector("textarea") as HTMLTextAreaElement).value,
      },
    });

    handleResponse(res, () => {
      setEditingBio(false);
    });
  }

  return (
    <div className="mb-3 flex items-center gap-x-1">
      {editingBio ? (
        <Textarea
          rows={3}
          autoFocus
          defaultValue={community?.bio}
          className="w-full resize-none text-sm md:text-base"
        />
      ) : (
        <p className="leading-relaxed whitespace-break-spaces">
          {community?.bio}
        </p>
      )}
      {community.is_admin &&
        (editingBio ? (
          <div className="flex gap-2">
            <WrapIcon className="" onClick={handleSaveBio}>
              <Check size={16} color="green" />
            </WrapIcon>
            <WrapIcon onClick={handleClickToggle}>
              <X size={16} color="red" />
            </WrapIcon>
          </div>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" onClick={handleClickToggle}>
                <WrapIcon>
                  <Pencil size={14} />
                </WrapIcon>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Cập nhật thông tin để tối ưu tìm kiếm cộng đồng của bạn</p>
            </TooltipContent>
          </Tooltip>
        ))}
    </div>
  );
}
