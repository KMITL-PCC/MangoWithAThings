"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { User, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Loginpage() {
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const router = useRouter()

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
          "Username หรือ Password ไม่ถูกต้องอะน้องไปขโมยรหัสใครมาป่าว",
        );
      }
      router.push("/location")
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-black">
      <Card className="w-full max-w-md border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-white tracking-tight">
            Login
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  className="pl-10 bg-black/40 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-purple-500"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-300">Password</Label>
              <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  type="password"
                  className="pl-10 bg-black/40 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-purple-500"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 transition-all"
              disabled={loading}
            >
              {loading ? "loading in.." : "login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
