"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { formatDate, initials } from "@/lib/utils";
import { updateTaskStatus, deleteTask } from "./actions";
import type { Task, TaskStatus } from "@/lib/types";

const STATUS_LABEL: Record<TaskStatus, string> = {
  todo: "Cần làm",
  in_progress: "Đang làm",
  done: "Xong",
};

export function TaskRow({ task, tripId }: { task: Task; tripId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-between gap-3 px-5 py-3.5">
      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-sm font-medium ${
            task.status === "done" ? "text-muted line-through" : "text-ink"
          }`}
        >
          {task.title}
        </p>
        <div className="mt-1 flex items-center gap-3 text-xs text-muted">
          {task.assignee && (
            <span className="flex items-center gap-1.5">
              <span className="grid h-4 w-4 place-items-center rounded-full bg-coral-soft text-[10px] font-semibold text-coral">
                {initials(task.assignee.full_name)}
              </span>
              {task.assignee.full_name}
            </span>
          )}
          {task.due_date && <span>Hạn {formatDate(task.due_date)}</span>}
        </div>
      </div>

      <select
        value={task.status}
        disabled={isPending}
        onChange={(e) =>
          startTransition(() =>
            updateTaskStatus(tripId, task.id, e.target.value as TaskStatus)
          )
        }
        className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-ink outline-none focus:border-ink"
      >
        {Object.entries(STATUS_LABEL).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <button
        type="button"
        aria-label="Xóa công việc"
        onClick={() => startTransition(() => deleteTask(tripId, task.id))}
        className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted transition hover:bg-coral-soft hover:text-coral"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
