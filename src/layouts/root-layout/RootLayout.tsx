import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <div className="w-screen flex items-center justify-center">
      <div className="w-5/6 max-w-5/6">
        <Outlet />
      </div>
    </div>
  );
}
