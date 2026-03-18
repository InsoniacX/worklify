interface StatCardProps {
  label: string;
  value: string;
  delta: string;
  deltaUp: boolean;
}

const StatCard = ({ label, value, delta, deltaUp }: StatCardProps) => (
  <div className="bg-[#0f0f0d] border border-neutral-900 rounded-xl p-4">
    <p className="text-[11px] font-medium tracking-widest uppercase text-neutral-700 mb-1.5">
      {label}
    </p>
    <p className="text-2xl font-medium text-neutral-100 font-mono">{value}</p>
    <p
      className={`text-[11px] mt-1 ${
        deltaUp ? "text-emerald-500" : "text-red-400"
      }`}
    >
      {deltaUp ? "↑" : "↓"} {delta}
    </p>
  </div>
);

export default StatCard;
