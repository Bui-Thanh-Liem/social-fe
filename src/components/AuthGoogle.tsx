import { getGoogleAuthUrl } from "~/utils/getGoogleAuthUrl";
import { Link } from "react-router-dom";
import { GoogleIcon } from "./icons/google";

export function AuthGoogle() {
  const googleOAuthUrl = getGoogleAuthUrl();
  return (
    <Link to={googleOAuthUrl} className="inline-block w-full">
      <div
        className={`h-12 border border-gray-300 hover:bg-gray-100 rounded-full flex justify-center items-center gap-4`}
      >
        <GoogleIcon /> <span>Đăng kí với Google</span>
      </div>
    </Link>
  );
}
