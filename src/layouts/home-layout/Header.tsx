import { BellIcon, MessageCircleMore, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useGetMe, useLogout } from "~/apis/useFetchAuth";
import { Logo } from "~/components/Logo";
import { SearchAdvanced } from "~/components/search-advanced/SearchAdvanced";
import { Tweet } from "~/components/tweet/Tweet";
import { AvatarMain } from "~/components/ui/avatar";
import { ButtonMain } from "~/components/ui/button";
import { DialogMain } from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { WrapIcon } from "~/components/WrapIcon";
import { CONSTANT_DEFAULT_TITLE_DOCUMENT } from "~/shared/constants/default-title-document";
import { ENotificationType, ETweetType } from "~/shared/enums/type.enum";
import { useConversationSocket } from "~/socket/hooks/useConversationSocket";
import { useChatBoxStore } from "~/store/useChatBoxStore";
import { useUnreadNotiStore } from "~/store/useUnreadNotiStore";
import { playNotificationSound } from "~/utils/notificationSound";
import { ConfirmOtpForm } from "~/forms/ConfirmOtpForm";
import { ForgotPasswordForm } from "~/forms/ForgotPasswordForm";
import { LoginAccountForm } from "~/forms/LoginAccountForm";
import { RegisterAccountForm } from "~/forms/RegisterAccountForm";
import { ResetPasswordForm } from "~/forms/ResetPasswordForm";
import { useUserStore } from "~/store/useUserStore";

export function Header() {
  return (
    <>
      <header className="grid-cols-3 grid items-center px-4">
        <div className="col-span-1">
          <WrapIcon>
            <Logo size={40} />
          </WrapIcon>
        </div>

        <div className="col-span-1">
          <div className="w-[420px] rounded-full outline-2 outline-sky-300">
            <SearchAdvanced
              className="w-[420px]"
              placeholder="Tìm kiếm mọi thứ"
            />
          </div>
        </div>

        <AuthHeader />
      </header>
    </>
  );
}

function AuthHeader() {
  //
  useConversationSocket(
    () => {},
    (_unread) => {
      //
      if (unreadCountConversation < _unread) {
        playNotificationSound();
      }

      //
      document.title =
        _unread > 0
          ? `(${_unread}) tin nhắn chưa đọc`
          : CONSTANT_DEFAULT_TITLE_DOCUMENT;

      const oldLinks = document.querySelectorAll(
        'link[rel="icon"], link[rel="shortcut icon"]',
      );
      oldLinks.forEach((link) => link.remove());

      // Tạo favicon mới
      const link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/svg+xml";
      link.href = _unread > 0 ? "/favicon-noti.svg" : "/favicon.svg";
      document.head.appendChild(link);
      setUnreadCountConversation(_unread);
    },
    () => {},
  );

  //
  const navigate = useNavigate();

  //
  const getMe = useGetMe();
  const logout = useLogout();

  //
  const { unread } = useUnreadNotiStore();
  const { open } = useChatBoxStore();
  const { user, setUser } = useUserStore();

  //
  const [isOpenPost, setIsOpenPost] = useState(false);
  const [isOpenLogin, setIsOpenLogin] = useState(false);
  const [unreadCountNoti, setUnreadCountNoti] = useState(0);
  const [isOpenRegister, setIsOpenRegister] = useState(false);
  const [isOpenResetPass, setIsOpenResetPass] = useState(false);
  const [isOpenForgotPass, setIsOpenForgotPass] = useState(false);
  const [isOpenConfirmOtp, setIsOpenConfirmOtp] = useState(false);
  const [unreadCountConversation, setUnreadCountConversation] = useState(0);

  // OAUTH
  const [params] = useSearchParams();
  const status = params.get("s") || "";

  // Handle OAuth login/signup
  useEffect(() => {
    async function onLoginOAuthSuccess() {
      const access_token = params.get("access_token") || "";
      const refresh_token = params.get("refresh_token") || "";

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      // Nếu đăng nhập thành công thì gọi api getMe lưu vào Store global
      const resGetMe = await getMe.mutateAsync();

      //
      if (resGetMe.statusCode === 200 && resGetMe?.metadata) {
        setUser(resGetMe.metadata);
        navigate("/", { replace: true });
      }
    }
    if (["login", "signup"].includes(status)) onLoginOAuthSuccess();
  }, [status]);

  //
  useEffect(() => {
    //
    if (unreadCountNoti < unread) {
      playNotificationSound();
    }

    //
    document.title =
      unread > 0
        ? `(${unread}) thông báo chưa đọc`
        : CONSTANT_DEFAULT_TITLE_DOCUMENT;

    const oldLinks = document.querySelectorAll(
      'link[rel="icon"], link[rel="shortcut icon"]',
    );

    oldLinks.forEach((link) => link.remove());

    // Tạo favicon mới
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/svg+xml";
    link.href = unread > 0 ? "/favicon-noti.svg" : "/favicon.svg";
    document.head.appendChild(link);
    setUnreadCountNoti(unread);
  }, [unread]);

  //
  function onClickForgotPassword() {
    setIsOpenLogin(false);
    setIsOpenForgotPass(true);
  }

  //
  function onClickRegister() {
    setIsOpenLogin(false);
    setIsOpenRegister(true);
  }

  //
  function handleOpenPost() {
    setIsOpenPost(true);
  }

  //
  async function onLogout() {
    await logout.mutateAsync();
  }

  //
  function onSuccessPost() {
    setIsOpenPost(false);
  }

  //
  if (!user)
    return (
      <>
        <div className="ml-auto">
          <ButtonMain size="sm" onClick={() => setIsOpenLogin(true)}>
            Đăng nhập
          </ButtonMain>
        </div>

        {/* Register */}
        <DialogMain
          open={isOpenRegister}
          onOpenChange={setIsOpenRegister}
          textHeader="Tạo tài khoản của bạn"
          textDesc="Vui lòng nhập thông tin để tạo tài khoản mới."
        >
          <RegisterAccountForm setOpenForm={setIsOpenRegister} />
        </DialogMain>

        {/* Login */}
        <DialogMain
          open={isOpenLogin}
          onOpenChange={setIsOpenLogin}
          textHeader="Đăng nhập vào Dev&bug"
          textDesc="Vui lòng nhập thông tin để đăng nhập."
        >
          <LoginAccountForm
            setOpenForm={setIsOpenLogin}
            onClickForgotPass={onClickForgotPassword}
            onClickRegister={onClickRegister}
          />
        </DialogMain>

        {/* Forgot Password */}
        <DialogMain
          open={isOpenForgotPass}
          onOpenChange={setIsOpenForgotPass}
          textHeader="Tìm tài khoản Dev&bug của bạn"
          textDesc="Nhập email liên kết với tài khoản để thay đổi mật khẩu của bạn."
        >
          <ForgotPasswordForm
            setOpenForm={setIsOpenForgotPass}
            // onSuccess={() => setIsOpenConfirmOtp(true)}
            onSuccess={() => {}}
          />
        </DialogMain>

        {/* Confirm Otp */}
        <DialogMain
          open={isOpenConfirmOtp}
          onOpenChange={setIsOpenConfirmOtp}
          textHeader="Chúng tôi đã gửi mã cho bạn"
          textDesc="Kiểm tra email của bạn để lấy mã xác nhận. Nếu bạn cần yêu cầu mã mới, quay lại và chọn lại phương thức xác nhận."
        >
          <ConfirmOtpForm
            setOpenForm={setIsOpenConfirmOtp}
            onBack={() => setIsOpenForgotPass(true)}
            onSuccess={() => setIsOpenResetPass(true)}
          />
        </DialogMain>

        {/* Reset Password */}
        <DialogMain
          open={isOpenResetPass}
          onOpenChange={setIsOpenResetPass}
          textHeader="Chọn mật khẩu mới"
          textDesc="Đảm bảo mật khẩu mới có 8 ký tự trở lên. Thử bao gồm số, chữ cái và dấu câu để tạo mật khẩu mạnh. "
        >
          <ResetPasswordForm setOpenForm={setIsOpenResetPass} />
        </DialogMain>
      </>
    );

  return (
    <div className="col-span-1 flex justify-end">
      <div className="flex gap-x-7 items-center">
        <ButtonMain size="sm" onClick={handleOpenPost} variant={"outline"}>
          <Plus /> Đăng Bài
        </ButtonMain>

        <Link
          to={`/notifications#${ENotificationType.Community}`}
          className="p-1 relative cursor-pointer"
        >
          {unreadCountNoti > 0 && (
            <span className="absolute top-0 left-4 w-4 h-4 rounded-full flex items-center justify-center bg-sky-400 text-[10px] font-bold text-white animate-bounce">
              {unreadCountNoti > 9 ? "9+" : unreadCountNoti}
            </span>
          )}
          <BellIcon />
        </Link>

        <div className="p-1 relative cursor-pointer" onClick={open}>
          {unreadCountConversation > 0 && (
            <span className="absolute top-0 left-4 w-4 h-4 rounded-full flex items-center justify-center bg-sky-400 text-[10px] font-bold text-white animate-bounce">
              {unreadCountConversation > 9 ? "9+" : unreadCountConversation}
            </span>
          )}
          <MessageCircleMore />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="hover:outline-2 hover:cursor-pointer rounded-full">
              <AvatarMain
                alt={user?.name}
                src={user?.avatar?.url}
                className="w-10 h-10"
              />
            </button>
          </DropdownMenuTrigger>

          {/*  */}
          <DropdownMenuContent align="start">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Tài khoản của bạn</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  navigate({
                    pathname: user?.username ? `/${user.username}` : "/profile",
                  });
                }}
              >
                Hồ sơ
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onLogout} variant="destructive">
                Đăng xuất
                <DropdownMenuShortcut>⇧⌘L</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/*  */}
      <DialogMain
        width="2xl"
        isLogo={false}
        open={isOpenPost}
        onOpenChange={setIsOpenPost}
      >
        <Tweet
          contentBtn="Đăng bài"
          onSuccess={onSuccessPost}
          tweetType={ETweetType.Tweet}
          placeholder="Có chuyện gì thế ? @liemdev, #developer"
        />
      </DialogMain>
    </div>
  );
}
