import type { ReactNode } from "react";

export type IconName =
  | "home"
  | "grid"
  | "plus"
  | "megaphone"
  | "user"
  | "users"
  | "truck"
  | "ship"
  | "clearance"
  | "warehouse"
  | "phone"
  | "whatsapp"
  | "pin"
  | "calendar"
  | "box"
  | "scale"
  | "arrow"
  | "chevron"
  | "search"
  | "menu"
  | "close"
  | "edit"
  | "trash"
  | "logout"
  | "login"
  | "check"
  | "dashboard"
  | "image"
  | "link"
  | "tag"
  | "settings"
  | "shield"
  | "list"
  | "container"
  | "logo";

const paths: Record<IconName, ReactNode> = {
  home: <path d="M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5" />,
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  megaphone: <path d="M3 11v2a1 1 0 0 0 1 1h2l9 5V5L6 10H4a1 1 0 0 0-1 1ZM18 9a3 3 0 0 1 0 6" />,
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.5-6 8-6s8 2 8 6" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20c0-3.2 2.7-5 6-5s6 1.8 6 5" />
      <path d="M16 5.2A3 3 0 0 1 18 11M21 20c0-2.6-1.4-4.2-3.5-4.8" />
    </>
  ),
  truck: (
    <>
      <path d="M2 6h11v9H2zM13 9h4l3 3v3h-7z" />
      <circle cx="6.5" cy="17.5" r="1.8" />
      <circle cx="17.5" cy="17.5" r="1.8" />
    </>
  ),
  ship: (
    <>
      <path d="M3 14l9-3 9 3-2.2 6H5.2L3 14Z" />
      <path d="M12 11V5M8 7h8M12 3v2" />
    </>
  ),
  clearance: (
    <>
      <path d="M6 3h9l4 4v14H6z" />
      <path d="M14 3v5h5" />
      <path d="m9 15 2 2 4-4" />
    </>
  ),
  warehouse: (
    <>
      <path d="M3 21V8l9-4 9 4v13" />
      <path d="M7 21v-7h10v7" />
      <path d="M7 17h10" />
    </>
  ),
  container: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="1" />
      <path d="M7 6v12M11 6v12M15 6v12" />
    </>
  ),
  phone: (
    <path d="M4 5c0 9 6 15 15 15l1-3-4-2-1.5 1.5C12 15 9 12 7.5 9.5L9 8 7 4 4 5Z" />
  ),
  whatsapp: (
    <>
      <path d="M4 20l1.4-4A8 8 0 1 1 9 19.5L4 20Z" />
      <path d="M9 9c0 4 2 6 6 6 .8 0 1-1 .5-1.5l-1.5-1-1 1c-1-.5-2-1.5-2.5-2.5l1-1-1-1.5C9.5 7 9 8 9 9Z" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v4M16 3v4" />
    </>
  ),
  box: (
    <>
      <path d="M21 8 12 3 3 8l9 5 9-5Z" />
      <path d="M3 8v8l9 5 9-5V8M12 13v8" />
    </>
  ),
  scale: <path d="M12 3v18M5 7h14M7 7l-3 7h6l-3-7Zm10 0-3 7h6l-3-7ZM6 21h12" />,
  arrow: <path d="M19 12H5m6-7-7 7 7 7" />,
  chevron: <path d="m6 9 6 6 6-6" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  edit: <path d="M4 20h4L19 9l-4-4L4 16v4ZM14 6l4 4" />,
  trash: <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />,
  logout: <path d="M15 4h4v16h-4M11 8l-4 4 4 4M7 12h12" />,
  login: <path d="M9 4H5v16h4M15 8l4 4-4 4M19 12H9" />,
  check: <path d="m4 12 5 5L20 6" />,
  dashboard: (
    <>
      <rect x="3" y="3" width="8" height="10" rx="1.5" />
      <rect x="13" y="3" width="8" height="6" rx="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" />
      <rect x="3" y="17" width="8" height="4" rx="1.5" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m4 19 5-5 4 4 3-3 4 4" />
    </>
  ),
  link: <path d="M9 15 15 9M10 6l1-1a4 4 0 0 1 6 6l-1 1M14 18l-1 1a4 4 0 0 1-6-6l1-1" />,
  tag: (
    <>
      <path d="M3 12V4h8l9 9-7 7-9-9Z" />
      <circle cx="7.5" cy="7.5" r="1.2" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
    </>
  ),
  shield: <path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6l-7-3Z" />,
  list: <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
  logo: (
    <>
      <path d="M3 13h11V6H3zM14 9h4l3 3v4h-7z" />
      <circle cx="7" cy="17.5" r="1.6" />
      <circle cx="17.5" cy="17.5" r="1.6" />
    </>
  ),
};

export function Icon({
  name,
  className = "size-5",
  strokeWidth = 1.8,
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
