"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { provincesByRegion } from "@/data/provinces";

export default function LocationSelect() {
  const [region, setRegion] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const savedLocation = localStorage.getItem("location");

    if (savedLocation) {
      window.location.replace("/mango-preference");
      return;
    }

    setChecking(false);
  }, []);

  if (checking) return null;

  const handleConfirm = async () => {
    if (!location) return;

    try {
      const res = await fetch("/api/location", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          location,
        }),
      });

      if (!res.ok) {
        throw new Error("ส่งข้อมูลไม่สำเร็จวะน้อง");
      }

      localStorage.setItem("location", location);
      window.location.href = "/mango-preference";
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูลวะน้อง");
    }
  };

  return (
    <div
      className="
    min-h-screen flex items-center justify-center p-4
    bg-gradient-to-br
    from-[#2f3e1f]
    via-[#3f4f2a]
    to-[#556b2f]
  "
    >
      <Card
        className="
    w-full max-w-4xl
    rounded-2xl
    shadow-2xl
    bg-white/90
    backdrop-blur
  "
      >
        <CardContent className="p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-emerald-900">
            เลือกจังหวัดของคุณ
          </h1>

          <div className="flex flex-wrap gap-4 justify-center mb-8">
            {Object.keys(provincesByRegion).map((r) => (
              <Button
                key={r}
                variant={region === r ? "default" : "outline"}
                onClick={() => {
                  setRegion(r);
                  setLocation(null);
                }}
                className={`
              text-lg px-6 py-3
              ${
                region === r
                  ? "bg-emerald-700 text-white hover:bg-emerald-800"
                  : "border-emerald-600 text-emerald-800 hover:bg-emerald-50"
              }
            `}
              >
                {r}
              </Button>
            ))}
          </div>

          {region && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {provincesByRegion[region].map((p) => (
                <button
                  key={p}
                  onClick={() => setLocation(p)}
                  className={
                    "rounded-xl border p-3 text-center font-medium transition-all " +
                    (location === p
                      ? "bg-emerald-700 text-white scale-105 shadow-lg border-emerald-700"
                      : "bg-white text-emerald-900 border-emerald-200 hover:shadow-md hover:bg-emerald-50")
                  }
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          <Button
            onClick={handleConfirm}
            disabled={!location}
            size="lg"
            className="
          w-full mt-10 rounded-xl text-lg
          bg-emerald-700 hover:bg-emerald-800
          disabled:bg-emerald-300
        "
          >
            {location ? `ยืนยันจังหวัด` : "กรุณาเลือกจังหวัด"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
