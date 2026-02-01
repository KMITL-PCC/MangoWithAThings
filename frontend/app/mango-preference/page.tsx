"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { PopupNotification } from "@/components/PopupNotification";
import { LogoutButton } from "@/components/LogoutButton";

/* ================= TYPES ================= */

type Menu = {
  id: number;
  name: string;
  vote_count: number;
};

type Student = {
  student_id: string;
  name: string;
};

type StudentsResponse = {
  students: Student[];
};

/* ================= STATIC TOPPINGS ================= */

const toppings = [
  { id: 1, name: "น้ำปลาหวาน", img: "/น้ำปลาหวาน.jpg" },
  { id: 2, name: "พริกเกลือ", img: "/พริกเกลือ.jpg" },
  { id: 3, name: "พริกเกลือลาว", img: "/พริกเกลือลาว.jpg" },
  { id: 4, name: "กะปิ", img: "/กะปิ.jpg" },
  { id: 5, name: "บ๊วย", img: "/บ๊วย.jpg" },
  { id: 6, name: "มันกุ้ง", img: "/มันกุ้ง.jpg" },
];

/* ================= COMPONENT ================= */

export default function MangoPreference() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const [open, setOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);

  /* ================= FETCH MENUS ================= */

  useEffect(() => {
    const fetchMenus = async () => {
      const res = await fetch("/api/menus", {
        credentials: "include",
      });

      if (!res.ok) return;

      const data = await res.json();
      setMenus(data.menus);
    };

    fetchMenus();
  }, []);

  /* ================= FETCH STUDENTS (POPUP) ================= */

  useEffect(() => {
    const fetchStudents = async () => {
      const res = await fetch("/api/students", {
        credentials: "include",
      });

      if (!res.ok) return;

      const data: StudentsResponse = await res.json();
      setStudents(data.students.slice(0, 3));
      setOpen(true);
    };

    fetchStudents();
  }, []);

  /* ================= VOTE ================= */

  const handleSelect = async (name: string) => {
    if (hasVoted) return; // 🚫 โหวตซ้ำไม่ได้

    const menu = menus.find((m) => m.name === name);
    if (!menu) return;

    setSelectedId(menu.id);
    setHasVoted(true);

    // optimistic update
    setMenus((prev) =>
      prev.map((m) =>
        m.id === menu.id ? { ...m, vote_count: m.vote_count + 1 } : m
      )
    );

    try {
      await fetch(`/api/vote/${menu.id}`, {
        method: "PUT",
        credentials: "include",
      });
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= CALC ================= */

  const totalVotes = menus.reduce((sum, m) => sum + m.vote_count, 0);

  /* ================= UI ================= */

  return (
    <div
      onClick={() => setSelectedId(null)}
      className="
    min-h-screen
    bg-gradient-to-br
    from-[#2f3e1f]
    via-[#3f4f2a]
    to-[#556b2f]
    flex items-center justify-center p-6
  "
    >
      <PopupNotification
        open={open}
        onClose={() => setOpen(false)}
        students={students}
      />

      <Card
        onClick={() => setSelectedId(null)}
        className="
      relative w-full max-w-[2000px]
      p-6 sm:p-8 lg:p-12
      rounded-3xl
      shadow-2xl
      bg-white/90
      backdrop-blur
    "
      >
        {/* ===== LOGOUT BUTTON ===== */}
        <div className="absolute top-6 right-6 z-15">
          <LogoutButton />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* LEFT */}
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

          {/* CENTER */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#3f4f2a]">
              คุณชอบกินมะม่วง
              <br />
              กับอะไรมากที่สุด?
            </h1>
            <p className="mt-4 text-[#5f6f3a]/80">
              เลือกได้ตามใจ อย่าให้มะม่วงรอ
            </p>
          </motion.div>

          {/* RIGHT */}
          <div className="grid grid-cols-2 gap-4">
            {toppings.map((item, index) => {
              const menu = menus.find((m) => m.name === item.name);

              return (
                <motion.button
                  key={item.id}
                  disabled={hasVoted}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(item.name);
                  }}
                  whileHover={!hasVoted ? { scale: 1.1, rotate: 2 } : {}}
                  whileTap={!hasVoted ? { scale: 0.95 } : {}}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.08 }}
                  className={
                    "flex flex-col items-center gap-2 rounded-xl transition-all " +
                    (menu?.id === selectedId
                      ? "scale-110 ring-4 ring-[#6b7f45] bg-[#eef2e3]"
                      : "") +
                    (hasVoted
                      ? " opacity-50 cursor-not-allowed"
                      : " cursor-pointer")
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
                  <span className="text-sm font-medium text-[#3f4f2a]">
                    {item.name}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ================= RESULT BAR ================= */}

        {menus.length > 0 && (
          <div className="mt-10 space-y-4">
            {menus.map((item) => {
              const percent =
                totalVotes === 0 ? 0 : (item.vote_count / totalVotes) * 100;

              return (
                <div key={item.id}>
                  <div className="flex justify-between text-sm mb-1 text-[#3f4f2a]">
                    <span>{item.name}</span>
                    <span>{item.vote_count} คน</span>
                  </div>

                  <div className="w-full h-3 bg-[#a3b18a] rounded-full">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.6 }}
                      className="h-full bg-[#556b2f] rounded-full"
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
