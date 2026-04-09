// import { zodResolver } from "@hookform/resolvers/zod";
// import { REGEXP_ONLY_DIGITS } from "input-otp";
// import { ArrowLeft } from "lucide-react";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { Link } from "react-router-dom";
// import { useVerify2Fa } from "~/apis/private/admin-auth.api";
// import { useLogin, useUserLogin } from "~/apis/public/user-auth.api";
// import { Logo } from "~/components/logo";
// import { Button } from "~/components/ui/button";
// import { Field } from "~/components/ui/field";
// import { InputMain } from "~/components/ui/input";
// import {
//   InputOTP,
//   InputOTPGroup,
//   InputOTPSlot,
// } from "~/components/ui/input-otp";
// import { Label } from "~/components/ui/label";
// import { WrapIcon } from "~/components/wrap-icon";
// import {
//   LoginAuthDtoSchema,
//   type LoginAuthDto,
// } from "~/shared/dtos/req/user-auth.dto";
// import { handleResponse } from "~/utils/toast";

// export function LoginPage() {
//   //
//   const [isOpenVerify2Fa, setIsOpenVerify2Fa] = useState(false);
//   const [isOpenAlreadyLogin, setIsOpenAlreadyLogin] = useState(false);
//   const [adminId, setAdminId] = useState("");
//   const apiLogin = useUserLogin();
//   const apiVerifyF2a = useVerify2Fa();

//   //
//   const {
//     control,
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<{
//     email: string;
//     password: string;
//   }>({
//     resolver: zodResolver(LoginAuthDtoSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   //
//   async function onSubmit(data: LoginAuthDto) {
//     const res = await apiLogin.mutateAsync(data);
//     console.log("Login response:", res);

//     if (res.statusCode === 200) {
//       setIsOpenVerify2Fa(true);
//       setAdminId(res.metadata?.admin_id || "");
//       if (res.metadata?.two_factor_session_enabled) setIsOpenAlreadyLogin(true);
//     }

//     handleResponse(res);
//   }

//   //
//   function onSubmitVerifyF2a(value: string) {
//     // Gửi token OTP mà admin nhập vào để xác thực 2FA
//     if (value.length !== 6) {
//       return;
//     }
//     apiVerifyF2a.mutateAsync({ token: value, _id: adminId }).then((res) => {
//       handleResponse(res);
//     });
//   }

//   console.log("isOpenVerify2Fa:", isOpenVerify2Fa);

//   return (
//     <div className="m-auto flex items-center gap-x-48">
//       {isOpenVerify2Fa && (
//         <div className="flex gap-x-3">
//           <div>
//             <WrapIcon onClick={() => setIsOpenVerify2Fa(false)}>
//               <ArrowLeft />
//             </WrapIcon>
//           </div>
//           <Field>
//             <InputOTP
//               maxLength={6}
//               id="2fa"
//               pattern={REGEXP_ONLY_DIGITS}
//               onChange={onSubmitVerifyF2a}
//             >
//               <InputOTPGroup>
//                 <InputOTPSlot index={0} />
//                 <InputOTPSlot index={1} />
//                 <InputOTPSlot index={2} />
//                 <InputOTPSlot index={3} />
//                 <InputOTPSlot index={4} />
//                 <InputOTPSlot index={5} />
//               </InputOTPGroup>
//             </InputOTP>
//             <ul className="mt-3 mb-6 ml-6 list-disc [&>li]:mt-2">
//               <li>
//                 Sử dụng{" "}
//                 <Link to="/use-backup-key" className="underline">
//                   mã dự phòng
//                 </Link>
//                 .
//               </li>
//               <li>
//                 <Link to="/contact-admin" className="underline">
//                   Liên hệ quản trị viên
//                 </Link>{" "}
//                 để cài đặt lại xác thực 2 bước.
//               </li>
//             </ul>
//             {isOpenAlreadyLogin && (
//               <Label className="text-md">
//                 <span className="text-red-500">Cảnh báo:</span> Tài khoản của
//                 bạn đang được sử dụng ở nơi khác
//               </Label>
//             )}
//           </Field>
//         </div>
//       )}

//       {!isOpenVerify2Fa && (
//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           className="flex items-center justify-center"
//         >
//           <div className="mt-4 space-y-6 w-full md:min-w-115">
//             <InputMain
//               id="email"
//               name="email"
//               sizeInput="lg"
//               label="Email"
//               errors={errors}
//               control={control}
//               register={register}
//               placeholder="example@gmail.com"
//             />

//             <InputMain
//               id="password"
//               name="password"
//               sizeInput="lg"
//               label="Mật khẩu"
//               errors={errors}
//               type="password"
//               control={control}
//               register={register}
//               placeholder="nhập mật khẩu của bạn"
//             />

//             <Button type="submit" size="lg" className="w-full">
//               Tiếp theo
//             </Button>
//           </div>
//         </form>
//       )}
//       <Logo size={400} />
//     </div>
//   );
// }
