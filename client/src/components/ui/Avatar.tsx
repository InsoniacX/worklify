const Avatar = ({ name }: { name: string }) => {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return (
    <div className="w-7 h-7 rounded-full bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center text-[10px] font-medium shrink-0">
      {initials}
    </div>
  );
};

export default Avatar;
