"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState } from "react";

type VoteStat = {
  name: string;
  vote_count: number;
};

const toppings = [
  { id: 1, name: "น้ำปลาหวาน", img: "/น้ำปลาหวาน.jpg" },
  { id: 2, name: "พริกเกลือ", img: "/พริกเกลือ.jpg" },
  { id: 3, name: "พริกเกลือลาว", img: "/พริกเกลือลาว.jpg" },
  { id: 4, name: "กะปิ", img: "/กะปิ.jpg" },
  { id: 5, name: "บ๊วย", img: "/บ๊วย.jpg" },
  { id: 6, name: "มันกุ้ง", img: "/มันกุ้ง.jpg" },
];

export default function MangoPreference() {
  const [selected, setSelected] = useState<string | null>(null);
  const [stats, setStats] = useState<VoteStat[]>([]);

  const handleSelect = async (name: string) => {
    setSelected(name);

    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vote: name }),
      });

      const data: VoteStat[] = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const totalVotes = stats.reduce(
    (sum, item) => sum + item.vote_count,
    0
  );

  return (
    <div
      onClick={() => setSelected(null)}
      className="min-h-screen bg-gradient-to-br from-yellow-200 via-emerald-100 to-lime-200 flex items-center justify-center p-6"
    >
      <Card
        onClick={() => setSelected(null)}
        className="
          w-full max-w-[2000px]
          p-6 sm:p-8 lg:p-12
          mb-6 sm:mb-10 lg:mb-0
          rounded-3xl shadow-2xl
        "
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* ซ้าย */}
          <motion.div
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <Image
              src="/มะม่วง.jpg"
              alt="มะม่วง"
              width={260}
              height={260}
              className="drop-shadow-xl"
            />
          </motion.div>

          {/* กลาง */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-4xl font-extrabold text-emerald-700">
              คุณชอบกินมะม่วง
              <br />
              กับอะไรมากที่สุด?
            </h1>
            <p className="mt-4 text-muted-foreground">
              เลือกได้ตามใจ อย่าให้มะม่วงรอ
            </p>
          </motion.div>

          {/* ขวา */}
          <div className="grid grid-cols-2 gap-4">
            {toppings.map((item, index) => (
              <motion.button
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(item.name);
                }}
                whileHover={{ scale: 1.1, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.08 }}
                className={
                  "flex flex-col items-center gap-2 rounded-xl transition-all " +
                  (selected === item.name
                    ? "scale-110 ring-4 ring-emerald-400 bg-emerald-50"
                    : "")
                }
              >
                <div className="bg-white rounded-2xl p-3 shadow-lg">
                  <Image
                    src={item.img}
                    alt={item.name}
                    width={180}
                    height={180}
                  />
                </div>
                <span className="text-sm font-medium">{item.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* ผลโหวต */}
        {stats.length > 0 && (
          <div className="mt-10 space-y-4">
            {stats.map((item) => {
              const percent =
                totalVotes === 0
                  ? 0
                  : (item.vote_count / totalVotes) * 100;

              return (
                <div key={item.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{item.name}</span>
                    <span>{item.vote_count} คน</span>
                  </div>

                  <div className="w-full h-3 bg-emerald-100 rounded-full">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.6 }}
                      className="h-full bg-emerald-500 rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
