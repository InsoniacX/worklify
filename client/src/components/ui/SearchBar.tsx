import React, { useState } from "react";
import { MdClose, MdSearch } from "react-icons/md";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (value: string) => void;
}

const SearchBar = ({ placeholder = "Search...", onSearch }: SearchBarProps) => {
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onSearch(e.target.value);
  };

  const handleClear = () => {
    setValue("");
    onSearch("");
  };

  return (
    <div className="relative flex items-center">
      <MdSearch size={14} className="absolute left-3 text-neutral-600" />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="bg-[#0a0a09] border border-[#1e1e1c] rounded-lg px-8 py-1.5 text-[12px] text-neutral-300 placeholder:text-neutral-700 focus:outline-none focus:border-blue-800"
      />
      {value && (
        <button onClick={handleClear} className="absolute right-2.5">
          <MdClose
            size={12}
            className="text-neutral-600 hover:text-neutral-300"
          />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
