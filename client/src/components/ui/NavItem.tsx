interface NavItemProps {
  label: string;
  active?: boolean;
  icon: React.ReactNode;
  url: string;
}

const NavItem = ({ label, active, icon, url }: NavItemProps) => (
  <a
    href={url}
    className={`flex items-center gap-2.5 px-5 py-2 text-[13px] cursor-pointer transition-all duration-150 border-l-2
      ${
        active
          ? "text-neutral-100 bg-neutral-900 border-blue-500"
          : "text-neutral-500 border-transparent hover:text-neutral-300 hover:bg-neutral-900"
      }`}
  >
    <span className="w-3.5 h-3.5 opacity-70 shrink-0">{icon}</span>
    {label}
  </a>
);

export default NavItem;
