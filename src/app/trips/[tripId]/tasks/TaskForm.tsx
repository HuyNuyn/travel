"use client";

import { useActionState } from "react";
import { Plus } from "lucide-react";
import { createTask, type TaskFormState } from "./actions";

export function TaskForm({
  tripId,
  members,
}: {
  tripId: string;
  members: { id: string; name: string }[];
}) {
  const [state, formAction, pending] = useActionState<
    TaskFormState,
    FormData
  >(createTask, null);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-end"
    >
      <input type="hidden" name="tripId" value={tripId} />

      <div className="flex-1">
        <label htmlFor="title" className="text-xs font-medium text-muted">
          Công việc
        </label>
        <input
          id="title"
          name="title"
          required
          placeholder="Đặt vé máy bay"
          className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-ink"
        />
      </div>

      <div className="sm:w-44">
        <label htmlFor="assigned_to" className="text-xs font-medium text-muted">
          Giao cho
        </label>
        <select
          id="assigned_to"
          name="assigned_to"
          defaultValue=""
          className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-ink"
        >
          <option value="">Chưa giao</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      <div className="sm:w-40">
        <label htmlFor="due_date" className="text-xs font-medium text-muted">
          Hạn
        </label>
        <input
          id="due_date"
          name="due_date"
          type="date"
          className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-ink"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="flex items-center justify-center gap-1.5 rounded-lg bg-coral px-4 py-2 text-sm font-medium text-white transition hover:bg-coral/90 disabled:opacity-60"
      >
        <Plus size={15} />
        Thêm
      </button>

      {state?.error && (
        <p className="text-sm text-coral sm:basis-full">{state.error}</p>
      )}
    </form>
  );
}
