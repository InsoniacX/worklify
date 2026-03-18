interface PillProps {
  label: string | number;
  variant: "green" | "amber" | "blue";
}

const Pill = ({ label, variant }: PillProps) => {
  const styles = {
    green: "bg-[#085041] text-[#5DCAA5] border-[#0F6E56]",
    amber: "bg-[#633806] text-[#EF9F27] border-[#854F0B]",
    blue: "bg-[#0c447c] text-[#85b7eb] border-[#185fa5]",
  };
  return (
    <span
      className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${styles[variant]}`}
    >
      {label}
    </span>
  );
};

export default Pill;
