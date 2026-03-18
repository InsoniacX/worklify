import type { User } from "@/types";

interface Props {
  users: User[];
}

const Avatar = ({ name }: { name: string }) => {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="w-8 h-8 rounded-full bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center text-[11px] font-medium shrink-0">
      {initials}
    </div>
  );
};

const StatusDot = () => (
  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 align-middle" />
);

const UserTable = ({ users }: Props) => {
  return (
    <div className="bg-[#0f0f0d] border border-neutral-800 rounded-2xl p-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <span className="text-[11px] font-medium tracking-widest uppercase text-neutral-600">
          User records
        </span>
        <span className="text-[11px] font-medium px-3 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-500 font-mono">
          {users.length} records
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-fixed">
          <thead>
            <tr className="border-b border-neutral-800">
              {["Name", "Email", "Address"].map((col) => (
                <th
                  key={col}
                  className="text-[11px] font-medium tracking-widest uppercase text-neutral-700 pb-3 text-left px-3 first:pl-0"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-b border-neutral-900 hover:bg-neutral-900 transition-colors duration-150"
              >
                {/* name */}
                <td className="py-3 px-3 first:pl-0">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={user.name} />
                    <span className="text-sm font-medium text-neutral-100">
                      {user.name}
                    </span>
                  </div>
                </td>

                {/* email */}
                <td className="py-3 px-3 text-[13px] text-neutral-500">
                  {user.email}
                </td>

                {/* address */}
                <td className="py-3 px-3 text-[13px] text-neutral-500">
                  <StatusDot />
                  {user.address}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
