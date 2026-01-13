"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Label } from "~/components/ui/label";
import { useRegister } from "~/apis/useFetchAuth";
import {
  RegisterUserDtoSchema,
  type RegisterUserDto,
} from "~/shared/dtos/req/auth.dto";
import { handleResponse } from "~/utils/toast";
import { ButtonMain } from "~/components/ui/button";
import { DatePicker } from "~/components/ui/date-picker";
import { InputMain } from "~/components/ui/input";

export function RegisterAccountForm({
  setOpenForm,
}: {
  setOpenForm: (open: boolean) => void;
}) {
  const apiRegister = useRegister();

  const {
    reset,
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterUserDto>({
    resolver: zodResolver(RegisterUserDtoSchema) as any,
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
      day_of_birth: new Date(),
    },
  });

  //
  const onSubmit = async (data: RegisterUserDto) => {
    const res = await apiRegister.mutateAsync(data);
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
        <InputMain
          id="name"
          isMaxLength
          sizeInput="lg"
          name="name"
          label="Tên"
          errors={errors}
          control={control}
          register={register}
          maxCountLength={16}
          placeholder="Nhập tên của bạn"
        />

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

        <div>
          <DatePicker
            sizeInput="lg"
            id="day_of_birth"
            name="day_of_birth"
            label="Ngày sinh"
            placeholder="08 tháng 01, 2000"
            errors={errors}
            control={control}
            register={register}
            setValue={setValue}
          />

          <div className="mt-3">
            <Label>Ngày sinh</Label>
            <p className="text-sm text-muted-foreground">
              Điều này sẽ không được hiển thị công khai. Xác nhận tuổi của bạn,
              ngay cả khi tài khoản này dành cho doanh nghiệp, thú cưng hoặc thứ
              gì khác.
            </p>
          </div>
        </div>

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

        <InputMain
          id="confirm_password"
          name="confirm_password"
          sizeInput="lg"
          label="Xác nhận mật khẩu"
          errors={errors}
          type="password"
          control={control}
          register={register}
          placeholder="Xác nhận mật khẩu của bạn"
        />

        <ButtonMain size="lg" className="w-full">
          Tiếp theo
        </ButtonMain>
      </div>
    </form>
  );
}
