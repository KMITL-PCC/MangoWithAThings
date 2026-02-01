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

interface PopupProps {
  open: boolean;
  onClose: () => void;
  students?: Student[];
}

export function PopupNotification({
  open,
  onClose,
  students,
}: PopupProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 text-white">
        <DialogHeader>
          <DialogTitle>รายชื่อนักศึกษา 🎓</DialogTitle>
        </DialogHeader>

        {students && (
          <ul className="mt-3 space-y-1 text-sm text-zinc-300">
            {students.map((s) => (
              <li key={s.student_id}>
                {s.student_id} – {s.name}
              </li>
            ))}
          </ul>
        )}

        <DialogFooter>
          <Button onClick={onClose}>ปิด</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
