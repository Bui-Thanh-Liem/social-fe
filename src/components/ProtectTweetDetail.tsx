import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "~/store/useUserStore";
import { DialogMain } from "./ui/dialog";
import { ButtonMain } from "./ui/button";
import { useBackUrlStore } from "~/store/useBackUrlStore";

export function ProtectTweetDetail({ children }: { children: ReactNode }) {
  //
  const user = useUserStore((state) => state.user);
  const { setBackUrl } = useBackUrlStore();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  //
  useEffect(() => {
    setBackUrl("");

    if (!user) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [user]);

  //
  function onClickLogin() {
    setIsOpen(false);
    setBackUrl(window.location.pathname + window.location.search);
    navigate("/");
  }

  return (
    <>
      {children}

      <DialogMain
        width="sm"
        open={isOpen}
        onOpenChange={setIsOpen}
        textDesc="Bạn cần đăng nhập để thao tác với bài viết này, nhấn đóng nếu bạn chỉ xem."
      >
        <ButtonMain size="lg" className="w-full" onClick={onClickLogin}>
          Đăng nhập
        </ButtonMain>
      </DialogMain>
    </>
  );
}
