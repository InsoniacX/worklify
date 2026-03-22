import React from "react";

type FieldType = "text" | "email" | "password" | "textarea" | "number";

interface Field {
  type: FieldType;
  name: string;
  label: string;
  placeholder?: string;
}

interface FormsProps {
  title: string;
  fields: Field[];
  buttonLabel: string;
  loading: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  defaultValue?: Record<string, string>;
}

const Forms = ({
  title,
  fields,
  buttonLabel,
  loading,
  onSubmit,
  defaultValue,
}: FormsProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-[#0f0f0d] border border-[#1e1e1c] rounded-xl p-6 w-full max-w-md"
    >
      {/* Title */}
      <p className="text-[15px] font-medium text-neutral-100 mb-6">{title}</p>

      {/* Fields */}
      <div className="flex flex-col gap-4">
        {fields.map((field) => (
          <div key={field.name} className="flex flex-col gap-1.5">
            <label
              className="text-[11px] font-medium tracking-widest uppercase text-neutral-600"
              htmlFor={field.name}
            >
              {field.label}
            </label>
            {field.type === "textarea" ? (
              <textarea
                id={field.name}
                name={field.name}
                placeholder={field.placeholder}
                defaultValue={defaultValue?.[field.name] ?? ""}
                rows={3}
                className="bg-[#0a0a09] border border-[#1e1e1c] rounded-lg px-3 py-2 text-[13px] text-neutral-300 placeholder:text-neutral-700 focus:outline-none focus:border-blue-800 transition-colors resize-none"
              />
            ) : (
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                placeholder={field.placeholder}
                defaultValue={defaultValue?.[field.name] ?? ""}
                className="bg-[#0a0a09] border border-[#1e1e1c] rounded-lg px-3 py-2 text-[13px] text-neutral-300 placeholder:text-neutral-700 focus:outline-none focus:border-blue-800 transition-colors"
              />
            )}
          </div>
        ))}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full py-2 rounded-lg bg-blue-950 border border-blue-800 text-blue-400 text-[13px] font-medium hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Loading..." : buttonLabel}
      </button>
    </form>
  );
};

export default Forms;
