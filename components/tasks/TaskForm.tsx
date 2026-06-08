"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useData } from "@/components/providers/DataProvider";
import type { Category, Task } from "@/lib/types";
import { todayISO } from "@/lib/dateUtils";
import { categoryMap } from "@/lib/utils";

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  initial?: Task;
  defaultDate?: string;
}

export function TaskForm({ open, onClose, initial, defaultDate }: TaskFormProps) {
  const { addTask, updateTask } = useData();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [date, setDate] = useState(initial?.date ?? defaultDate ?? todayISO());
  const [time, setTime] = useState(initial?.time ?? "");
  const [durationMin, setDurationMin] = useState<string>(initial?.durationMin?.toString() ?? "");
  const [category, setCategory] = useState<Category>(initial?.category ?? "personal");
  const [priority, setPriority] = useState<"low" | "medium" | "high">(initial?.priority ?? "medium");

  // Sync state with `initial` prop changes so editing a different task refreshes the form
  useEffect(() => {
    if (!open) return;
    setTitle(initial?.title ?? "");
    setDescription(initial?.description ?? "");
    setDate(initial?.date ?? defaultDate ?? todayISO());
    setTime(initial?.time ?? "");
    setDurationMin(initial?.durationMin?.toString() ?? "");
    setCategory(initial?.category ?? "personal");
    setPriority(initial?.priority ?? "medium");
  }, [initial, defaultDate, open]);

  const reset = () => {
    setTitle(initial?.title ?? "");
    setDescription(initial?.description ?? "");
    setDate(initial?.date ?? defaultDate ?? todayISO());
    setTime(initial?.time ?? "");
    setDurationMin(initial?.durationMin?.toString() ?? "");
    setCategory(initial?.category ?? "personal");
    setPriority(initial?.priority ?? "medium");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      date,
      time: time || undefined,
      durationMin: durationMin ? Number(durationMin) : undefined,
      category,
      priority,
    };
    if (initial) {
      updateTask(initial.id, payload);
    } else {
      addTask(payload);
    }
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit Task" : "New Task"} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="task-title">Title</Label>
          <Input
            id="task-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Morning meditation"
            autoFocus
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="task-desc">Description</Label>
          <Textarea
            id="task-desc"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A few notes…"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="task-date">Date</Label>
            <Input
              id="task-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="task-time">Time</Label>
            <Input
              id="task-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="task-duration">Duration (min)</Label>
            <Input
              id="task-duration"
              type="number"
              min={1}
              max={600}
              value={durationMin}
              onChange={(e) => setDurationMin(e.target.value)}
              placeholder="30"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="task-category">Category</Label>
            <Select
              id="task-category"
              value={category}
              onChange={(v) => setCategory(v as Category)}
              options={Object.entries(categoryMap).map(([k, v]) => ({ value: k, label: v.label }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="task-priority">Priority</Label>
            <Select
              id="task-priority"
              value={priority}
              onChange={(v) => setPriority(v as "low" | "medium" | "high")}
              options={[
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
              ]}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {initial ? "Save Changes" : "Add Task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
