"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUserLogin } from "~/apis/user-auth.api";
import {
  LoginUserDtoSchema,
  type LoginUserDto,
} from "~/shared/dtos/req/user-auth.dto";
import { handleResponse } from "~/utils/toast.util";
import { AuthGoogle } from "~/components/auth-google";
import { Divider } from "~/components/ui/divider";
import { ButtonMain } from "~/components/ui/button";
import { InputMain } from "~/components/ui/input";
import { AvatarMain } from "~/components/ui/avatar";
import { Logo } from "~/components/logo";
import { useGetGuestUsers } from "~/apis/user.api";
import { UserStatusBadge, UserTypeBadge } from "~/pages/profile/profile-page";
import { cn } from "~/utils/cn.util";
import { EUserStatus, EUserType } from "~/shared/enums/status.enum";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

export function LoginAccountForm({
  setOpenForm,
  onClickRegister,
  onClickForgotPass,
}: {
  setOpenForm: (open: boolean) => void;
  onClickForgotPass: () => void;
  onClickRegister: () => void;
}) {
  //
  const apiLogin = useUserLogin();
  const { data, isLoading } = useGetGuestUsers();
  const guests = data?.metadata || [];

  //
  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUserDto>({
    resolver: zodResolver(LoginUserDtoSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  //
  const onSubmit = async (data: LoginUserDto) => {
    const res = await apiLogin.mutateAsync(data);
    handleResponse(res, successForm);
  };

  //
  function successForm() {
    setOpenForm(false);
    reset();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center justify-center"
    >
      <div className="mt-4 space-y-6 w-full md:min-w-[460px]">
        {/* Guest Login */}
        <div className="flex justify-center">
          <Divider className="w-80" text="Tài khoản khách" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 justify-center cursor-pointer">
          {isLoading &&
            Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-2xl flex items-center justify-center h-16 animate-pulse"
              >
                <Logo size={40} className="text-gray-400 " />
              </div>
            ))}

          {guests.length > 0 &&
            guests.map((item) => {
              const status = item.status?.status;
              return (
                <div
                  key={item.email}
                  onClick={() =>
                    onSubmit({
                      email: item.email,
                      password: import.meta.env.VITE_GUEST_USER_PASSWORD,
                    })
                  }
                  className="bg-gray-50 hover:bg-sky-50 rounded-xl flex items-center justify-center h-16"
                >
                  <Tooltip>
                    <TooltipTrigger>
                      <button onClick={(e) => e.preventDefault()}>
                        <div className="flex gap-x-3 items-center relative">
                          {item.avatar ? (
                            <AvatarMain
                              alt={item.email}
                              src={item.avatar.url}
                              className="w-16 h-16"
                            />
                          ) : (
                            <div className="bg-gray-300 w-full h-full flex items-center justify-center">
                              <Logo size={40} className="text-gray-400 " />
                            </div>
                          )}
                          <span
                            className={cn(
                              "absolute top-0 right-0 hidden",
                              status !== EUserStatus.Active && "block",
                            )}
                          >
                            <UserStatusBadge status={status} />
                          </span>
                          <span
                            className={cn(
                              "absolute top-0 right-0 hidden",
                              item.type !== EUserType.Normal && "block",
                            )}
                          >
                            <UserTypeBadge type={item.type} />
                          </span>
                        </div>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{item.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              );
            })}
        </div>

        {/* Third-Party Login */}
        <div className="flex justify-center">
          <Divider className="w-80" text="Bên thứ ba" />
        </div>
        <AuthGoogle />

        {/* Local Login */}
        <div className="flex justify-center">
          <Divider className="w-80" />
        </div>
        <InputMain
          id="email"
          name="email"
          sizeInput="lg"
          label="Email"
          errors={errors}
          control={control}
          register={register}
          placeholder="example@gmail.com"
        />

        <InputMain
          id="password"
          name="password"
          sizeInput="lg"
          label="Mật khẩu"
          errors={errors}
          type="password"
          control={control}
          register={register}
          placeholder="Nhập mật khẩu của bạn"
        />

        <ButtonMain type="submit" size="lg" className="w-full">
          Tiếp theo
        </ButtonMain>
        <ButtonMain
          size="lg"
          className="w-full"
          variant="outline"
          onClick={() => onClickForgotPass()}
        >
          Quên mật khẩu ?
        </ButtonMain>
        <div className="text-center">
          <p>
            Không có tài khoản ?
            <span
              className="cursor-pointer text-[#1D9BF0]"
              onClick={() => onClickRegister()}
            >
              {" "}
              Đăng ký
            </span>
          </p>
        </div>
      </div>
    </form>
  );
}
