"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

type PasswordInputProps = {
  name: string;
  placeholder: string;
};

export default function PasswordInput({ name, placeholder }: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        name={name}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#1F3A2E] bg-[#050807] px-4 py-3 pr-12 outline-none transition placeholder:text-[#547064] focus:border-[#39FF88]"
      />

      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7F9B8B] hover:text-[#39FF88]"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}