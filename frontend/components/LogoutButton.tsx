"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("logout failed");
      }

      // ถ้ามี localStorage / state อื่น ๆ
      localStorage.clear();

      // เด้งไปหน้า login
      router.push("/");
    } catch (err) {
      console.error(err);
      alert("ออกจากระบบไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="
    flex items-center gap-1.5
    rounded-lg px-3 py-1.5
    text-xs font-medium
    bg-red-500 text-white
    hover:bg-red-600
    disabled:opacity-50 disabled:cursor-not-allowed
    transition
  "
    >
      <LogOut size={18} />
      {loading ? "กำลังออก..." : "ออกจากระบบ"}
    </button>
  );
}
