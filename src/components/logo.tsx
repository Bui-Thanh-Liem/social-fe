import { Link } from "react-router-dom";

type PropLogoType = {
  size?: number;
  className?: string;
};

export function Logo({ size = 100, className = "text-black" }: PropLogoType) {
  return (
    <Link to="/home" style={{ display: "block", width: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 30"
        aria-hidden="true"
        fill="currentColor"
        className={`r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-18jsvk2 r-rxcuwo r-1777fci r-m327ed r-494qqr ${className}`}
      >
        <g>
          {/* D */}
          <path d="M3 4h3.8c2.8 0 4.7 1.6 4.7 4v8c0 2.4-1.9 4-4.7 4H3V4Zm2 2v12h1.6c1.7 0 2.8-1 2.8-2.7V8.7c0-1.7-1.1-2.7-2.8-2.7H5Z" />
          {/* E */}
          <path d="M12 4h7v2h-5v4h4.5v2H14v4h5v2h-7V4Z" />
          {/* V */}
          <path d="M21 4h2l-3.7 16h-2.4L13 4h2l2.9 12.5L21 4Z" />
        </g>
        <text
          x="12"
          y="24"
          fontSize="4"
          textAnchor="middle"
          fill="currentColor"
        >
          &BUG
        </text>
      </svg>
    </Link>
  );
}
