import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-5 overflow-hidden font-sans text-[#e7e9ea]">
      <div className="text-center max-w-[600px]">
        {/* Logo Section */}
        <svg
          className="w-[100px] h-[100px] mx-auto mb-[30px] fill-current"
          viewBox="0 0 24 28"
          aria-hidden="true"
        >
          <g>
            <path d="M3 4h3.8c2.8 0 4.7 1.6 4.7 4v8c0 2.4-1.9 4-4.7 4H3V4Zm2 2v12h1.6c1.7 0 2.8-1 2.8-2.7V8.7c0-1.7-1.1-2.7-2.8-2.7H5Z" />
            <path d="M12 4h7v2h-5v4h4.5v2H14v4h5v2h-7V4Z" />
            <path d="M21 4h2l-3.7 16h-2.4L13 4h2l2.9 12.5L21 4Z" />
          </g>
          <text
            x="12"
            y="26"
            fontSize="5"
            fontWeight="bold"
            textAnchor="middle"
            className="font-mono"
            fill="currentColor"
          >
            &BUG
          </text>
        </svg>

        {/* Error Code */}
        <div
          className="text-[120px] font-black leading-none -tracking-[5px] mb-2.5 
                        bg-gradient-to-b from-white to-[#333] bg-clip-text text-transparent 
                        hover:animate-subtle-glitch cursor-default select-none animate-bounce"
        >
          404
        </div>

        {/* Messages */}
        <h1 className="text-xl font-normal mb-2.5 text-[#71767b]">
          Rất tiếc, trang này không tồn tại!
        </h1>
        <p className="text-[15px] text-[#71767b] leading-5 mb-[30px]">
          Có vẻ như đường dẫn này đã bị "bay màu" hoặc chưa bao giờ xuất hiện
          trên dòng thời gian này.
        </p>

        {/* Button */}
        <Link
          to="/home"
          className="inline-block bg-[#eff3f4] text-[#0f1419] no-underline px-6 py-2.5 
                     rounded-full font-bold text-[15px] transition-colors duration-200 
                     hover:bg-[#d7dbdc]"
        >
          Tìm kiếm thứ khác
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
