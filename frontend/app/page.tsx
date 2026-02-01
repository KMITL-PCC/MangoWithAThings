"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { User, Lock } from "lucide-react";

export default function Loginpage() {
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username,
          pass,
        }),
      });

      if (!res.ok) {
        throw new Error(
          "Username หรือ Password ไม่ถูกต้องอะน้องไปขโมยรหัสใครมาป่าว"
        );
      }

      const data = await res.json();

      // ✅ login แล้ว ได้ location มาด้วย
      if (data?.location) {
        localStorage.setItem("location", data.location);
        window.location.replace("/mango-preference");
      } else {
        window.location.replace("/location");
      }
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาดบางอย่าง");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2f3e1f] via-[#3f4f2a] to-[#556b2f]">
      <Card className="w-full max-w-md border border-black/10 bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold text-center text-emerald-900 tracking-tight">
            Login
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[#5f6f3a] font-medium">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7a8f52]" />
                <Input
                  className="
        pl-10
        bg-white
        border-[#a3b18a]
        text-[#3f4f2a]
        placeholder:text-[#8fa06a]
        focus:ring-[#6b7f45]
        focus:border-[#6b7f45]
      "
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[#5f6f3a] font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7a8f52]" />
                <Input
                  type="password"
                  className="
        pl-10
        bg-white
        border-[#a3b18a]
        text-[#3f4f2a]
        placeholder:text-[#8fa06a]
        focus:ring-[#6b7f45]
        focus:border-[#6b7f45]
      "
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            <Button
              type="submit"
              className="
    w-full
    bg-gradient-to-r
    from-[#5f6f3a]
    to-[#6b7f45]
    hover:from-[#6b7f45]
    hover:to-[#7a8f52]
    text-white
    font-semibold
    shadow-md
  "
              disabled={loading}
            >
              {loading ? "logging in..." : "login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
