interface AvatarProps {
  name: string;
  size?: "sm" | "md";
  picture?: string;
}

const Avatar = ({ name, size = "sm", picture }: AvatarProps) => {
  const initials = name
    ? name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";
  const dim = size === "sm" ? "w-6 h-6 text-[9px]" : "w-7 h-7 text-[10px]";

  if (picture) {
    return (
      <img
        src={picture}
        alt={name}
        className={`${dim} rounded-full object-cover border border-neutral-800`}
      />
    );
  }

  return (
    <div
      className={`${dim} rounded-full bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center font-medium shrink-0`}
    >
      {initials}
    </div>
  );
};

export default Avatar;
