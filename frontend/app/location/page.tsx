"use client";

import {
  Card,
  CardContent
} from "@/components/ui/card";
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
      window.location.href = "/mango-preference";
    } else {
      setChecking(false);
    }
  }, []);

  if (checking) return null;

  const handleConfirm = async () => {
    if (!location) return;

    try {
      const res = await fetch("/api/location", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-500 via-lime-400 to-yellow-300 p-4">
      <Card className="w-full max-w-4xl rounded-2xl shadow-2xl">
        <CardContent className="p-8">
          <h1 className="text-3xl font-bold text-center mb-8">
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
                className="text-lg px-6 py-3"
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
                      ? "bg-primary text-primary-foreground scale-105 shadow-lg"
                      : "bg-background hover:shadow-md")
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
            className="w-full mt-10 rounded-xl text-lg"
          >
            {location ? `ยืนยันจังหวัด` : "กรุณาเลือกจังหวัด"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
