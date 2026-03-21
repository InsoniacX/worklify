import { Avatar, Pill } from "@/components";
import type { Product, User } from "@/types";

interface UserTableProps {
  users: User[];
  loading: boolean;
  title?: string;
  buttonLabel: string;
  url: string;
  actions: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const UserTable = ({
  users,
  loading,
  title,
  buttonLabel,
  url,
  actions,
  onEdit,
  onDelete,
}: UserTableProps) => {
  return (
    <div className="bg-[#0f0f0d] border border-[#1e1e1c] rounded-[10px] p-4">
      <div className="flex items-center justify-between mb-4">
        {title && (
          <span className="text-[12px] font-medium tracking-[0.08em] uppercase text-[#5f5e5a]">
            {title}
          </span>
        )}
        <a href={url}>
          <span className="text-[14px] text-[#378ADD] cursor-pointer capitalize">
            {buttonLabel}
          </span>
        </a>
      </div>
      <table className="w-full border-collapse table-fixed">
        <thead>
          <tr>
            {["Name", "Email", "Status", ...(actions ? ["Actions"] : [])].map(
              (h) => (
                <th
                  key={h}
                  className="text-[10px] font-medium tracking-widest uppercase text-[#444441] pb-2 text-left px-2 first:pl-0 border-b border-[#1e1e1c]"
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={actions ? 4 : 3}
                className="text-[12px] text-[#444441] py-4 text-center"
              >
                Loading...
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr
                key={user._id}
                className="border-b border-[#151513] last:border-none hover:bg-[#151513] transition-colors"
              >
                <td className="py-2.5 px-2 first:pl-0">
                  <div className="flex items-center gap-2">
                    <Avatar name={user.name} />
                    <span className="text-[12px] text-[#d3d1c7]">
                      {user.name}
                    </span>
                  </div>
                </td>
                <td className="py-2.5 px-2 text-[12px] text-[#888780]">
                  {user.email}
                </td>
                <td className="py-2.5 px-2">
                  <Pill label="active" variant="green" />
                </td>

                {/* Only renders on Users page */}
                {actions && (
                  <td className="py-2.5 px-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit?.(user._id)}
                        className="text-[11px] px-2.5 py-1 rounded-md border border-blue-800 text-blue-400 hover:bg-blue-950 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete?.(user._id)}
                        className="text-[11px] px-2.5 py-1 rounded-md border border-red-900 text-red-400 hover:bg-red-950 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  title?: string;
  buttonLabel?: string;
  url?: string;
  actions?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const ProductTable = ({
  products,
  loading,
  title = "Latest products",
  buttonLabel,
  url,
  actions = false,
  onEdit,
  onDelete,
}: ProductTableProps) => {
  return (
    <div className="bg-[#0f0f0d] border border-[#1e1e1c] rounded-[10px] p-4">
      <div className="flex items-center justify-between mb-4">
        {title && (
          <span className="text-[12px] font-medium tracking-[0.08em] uppercase text-[#5f5e5a]">
            {title}
          </span>
        )}
        {url && buttonLabel && (
          <a href={url}>
            <span className="text-[14px] text-[#378ADD] cursor-pointer capitalize">
              {buttonLabel}
            </span>
          </a>
        )}
      </div>
      <table className="w-full border-collapse table-fixed">
        <thead>
          <tr>
            {[
              "Product",
              "Category",
              "Supplier",
              "Stock",
              ...(actions ? ["Actions"] : []),
            ].map((h) => (
              <th
                key={h}
                className="text-[10px] font-medium tracking-widest uppercase text-[#444441] pb-2 text-left px-2 first:pl-0 border-b border-[#1e1e1c]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={actions ? 5 : 4}
                className="text-[12px] text-[#444441] py-4 text-center"
              >
                Loading...
              </td>
            </tr>
          ) : (
            products.map((p) => (
              <tr
                key={p._id}
                className="border-b border-[#151513] last:border-none hover:bg-[#151513] transition-colors"
              >
                <td className="py-2.5 px-2 first:pl-0 text-[12px] text-[#d3d1c7] font-medium">
                  {p.name}
                </td>
                <td className="py-2.5 px-2">
                  <Pill label={p.category} variant="blue" />
                </td>
                <td className="py-2.5 px-2 text-[12px] text-[#888780]">
                  {p.supplier}
                </td>
                <td className="py-2.5 px-2">
                  <Pill
                    label={String(p.stock)}
                    variant={p.stock > 10 ? "green" : "amber"}
                  />
                </td>

                {actions && (
                  <td className="py-2.5 px-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit?.(p._id)}
                        className="text-[11px] px-2.5 py-1 rounded-md border border-blue-800 text-blue-400 hover:bg-blue-950 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete?.(p._id)}
                        className="text-[11px] px-2.5 py-1 rounded-md border border-red-900 text-red-400 hover:bg-red-950 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
