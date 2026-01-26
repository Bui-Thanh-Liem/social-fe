import { Link } from "react-router-dom";
import { getFacebookAuthUrl } from "~/utils/getFacebookAuthUrl";
import { FacebookIcon } from "./icons/facebook";

export function AuthFacebook() {
  const facebookOAuthUrl = getFacebookAuthUrl();

  return (
    <Link to={facebookOAuthUrl} className="inline-block w-full">
      <div
        className={`h-12 border border-gray-300 hover:bg-gray-100 rounded-full flex justify-center items-center gap-4`}
      >
        <FacebookIcon /> <span>Đăng kí với Facebook</span>
      </div>
    </Link>
  );
}
