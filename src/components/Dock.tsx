// components/Navbar.tsx
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";

const Dock = () => {
  const { pathname } = useLocation();

  const linkClass = (path: string) =>
    clsx(
      "px-4 py-2 rounded-xl transition-colors",
      pathname === path ? "dock-active" : ""
    );

  return (
    <div className="dock bg-base-200 text-base-content">
      <Link to={"/"} className={linkClass("/")}>
        <svg
          className="size-[1.2em]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g fill="currentColor" strokeLinejoin="miter" strokeLinecap="butt">
            <polyline
              points="1 11 12 2 23 11"
              fill="none"
              stroke="currentColor"
              stroke-miterlimit="10"
              strokeWidth="2"
            ></polyline>
            <path
              d="m5,13v7c0,1.105.895,2,2,2h10c1.105,0,2-.895,2-2v-7"
              fill="none"
              stroke="currentColor"
              strokeLinecap="square"
              stroke-miterlimit="10"
              strokeWidth="2"
            ></path>
            <line
              x1="12"
              y1="22"
              x2="12"
              y2="18"
              fill="none"
              stroke="currentColor"
              strokeLinecap="square"
              stroke-miterlimit="10"
              strokeWidth="2"
            ></line>
          </g>
        </svg>
        <span className="dock-label">خانه</span>
      </Link>

      <Link to="/add" className={linkClass("/add")}>
        <svg
          className="size-[1.2em]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g fill="currentColor" strokeLinejoin="miter" strokeLinecap="butt">
            <polyline
              points="3 14 9 14 9 17 15 17 15 14 21 14"
              fill="none"
              stroke="currentColor"
              stroke-miterlimit="10"
              strokeWidth="2"
            ></polyline>
            <rect
              x="3"
              y="3"
              width="18"
              height="18"
              rx="2"
              ry="2"
              fill="none"
              stroke="currentColor"
              strokeLinecap="square"
              stroke-miterlimit="10"
              strokeWidth="2"
            ></rect>
          </g>
        </svg>
        <span className="dock-label">ثبت مخارج</span>
      </Link>
    </div>
  );
};

export default Dock;
