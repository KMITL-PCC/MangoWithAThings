"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/me", {
          credentials: "include", 
        });

        if (!res.ok) {
          window.location.href = "http://localhost:4000/login";
          return;
        }

        window.location.href = "/location";
      } catch (err) {
        window.location.href = "http://localhost:4000/login";
      }
    };

    checkAuth();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      กำลังตรวจสอบสิทธิ์...
    </div>
  );
}
