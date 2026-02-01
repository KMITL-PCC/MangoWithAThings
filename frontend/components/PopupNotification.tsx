"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Student = {
  student_id: string;
  name: string;
};

type PopupNotificationProps = {
  open: boolean;
  onClose: () => void;
  students: Student[];
}


export function PopupNotification({
  open,
  onClose,
  students,
}: PopupNotificationProps) {

  if (!open) return null;

  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 text-center">

        <div className="space-y-4">
          {students.map((s) => (
            <div
              key={s.student_id}
              className="rounded-xl border border-emerald-200 bg-emerald-50 p-4"
            >
              <p className="text-lg font-semibold text-emerald-800">
                {s.name}
              </p>
              <p className="text-sm text-emerald-600">
                รหัสนักศึกษา {s.student_id}
              </p>
            </div>
          ))}
        </div>

        {/* สาขา */}
        <div className="mt-6 text- font-medium text-zinc-600">
          สาขาวิศวกรรมคอมพิวเตอร์
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-emerald-600 py-2 text-white font-semibold hover:bg-emerald-700 transition"
        >
          ปิด
        </button>
      </div>
    </div>
  );
}
