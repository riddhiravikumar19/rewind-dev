"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#7F9B8B] transition hover:bg-[#FF4D4D]/10 hover:text-[#FF4D4D]"
    >
      <LogOut size={18} />
      Logout
    </button>
  );
}