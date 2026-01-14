import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useVerifyEmail } from "~/apis/useFetchUser";
import { toastSimple } from "~/utils/toast";

export function VerifyEmail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token") || "";
  const apiVerifyEmail = useVerifyEmail();

  useEffect(() => {
    if (token) {
      (async () => {
        const res = await apiVerifyEmail.mutateAsync({
          email_verify_token: token,
        });

        if (res.statusCode !== 200) {
          toastSimple(
            "Xác minh email không thành công. Vui lòng thử lại.",
            "error"
          );
          navigate("/home");
        }
      })();
    }
  }, []);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    </div>
  );
}
