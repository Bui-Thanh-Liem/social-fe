"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useForgotPassword } from "~/apis/useFetchAuth";
import {
  ForgotPasswordDtoSchema,
  type ForgotPasswordDto,
} from "~/shared/dtos/req/auth.dto";
import { handleResponse } from "~/utils/toast";
import { ButtonMain } from "~/components/ui/button";
import { InputMain } from "~/components/ui/input";

export function ForgotPasswordForm({
  setOpenForm,
  onSuccess,
}: {
  setOpenForm: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordDto>({
    resolver: zodResolver(ForgotPasswordDtoSchema),
    defaultValues: {
      email: "",
    },
  });

  //
  const apiForgotPass = useForgotPassword();

  //
  function onCancel(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setOpenForm(false);
  }

  //
  const onSubmit = async (data: ForgotPasswordDto) => {
    console.log("ForgotPasswordForm - onSubmit - data:::", data);
    const res = await apiForgotPass.mutateAsync(data);
    handleResponse(res, handleSuccess);
  };

  //
  function handleSuccess() {
    setOpenForm(false);
    onSuccess();
    reset();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center justify-center"
    >
      <div className="mt-4 space-y-6 w-full md:min-w-[460px]">
        <div>
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

          <div className="flex gap-4 mt-12">
            <ButtonMain
              size="lg"
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onCancel}
            >
              Hủy
            </ButtonMain>
            <ButtonMain size="lg" className="flex-1">
              Gửi
            </ButtonMain>
          </div>
        </div>
      </div>
    </form>
  );
}
