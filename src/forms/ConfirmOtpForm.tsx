"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { TypographyP } from "~/components/elements/p";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "~/components/ui/input-otp";
import { ButtonMain } from "~/components/ui/button";

const FormSchema = z.object({
  otp: z.string().length(6, "Otp không hợp lệ"),
});

type FormValues = z.infer<typeof FormSchema>;

export function ConfirmOtpForm({
  setOpenForm,
  onSuccess,
  onBack,
}: {
  setOpenForm: (open: boolean) => void;
  onBack: () => void;
  onSuccess: () => void;
}) {
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      otp: "",
    },
  });

  //
  function onBackSendMail(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setOpenForm(false);
    onBack();
  }

  //
  const onSubmit = (data: FormValues) => {
    console.log("data:::", data);
    setOpenForm(false);
    onSuccess();
    reset();
  };

  return (
    <form
      className="flex items-center justify-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="mt-4 space-y-6 min-w-[460px]">
        <div className="my-6 mb-24 flex flex-col items-center">
          <Controller
            control={control}
            name="otp"
            render={({ field }) => (
              <InputOTP
                maxLength={6}
                value={field.value}
                onChange={(value) => field.onChange(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            )}
          />
          {errors.otp && (
            <TypographyP className="text-red-500 mt-2">
              {errors.otp.message}
            </TypographyP>
          )}
        </div>

        <div className="flex gap-4">
          <ButtonMain
            size="lg"
            type="button"
            className="flex-1"
            variant="outline"
            onClick={onBackSendMail}
          >
            Quay lại
          </ButtonMain>
          <ButtonMain size="lg" className="flex-1" type="submit">
            Tiếp theo
          </ButtonMain>
        </div>
      </div>
    </form>
  );
}
