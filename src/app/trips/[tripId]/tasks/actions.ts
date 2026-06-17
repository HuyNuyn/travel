"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TaskStatus } from "@/lib/types";

export type TaskFormState = { error?: string } | null;

export async function createTask(
  _prevState: TaskFormState,
  formData: FormData
): Promise<TaskFormState> {
  const tripId = String(formData.get("tripId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const assignedTo = String(formData.get("assigned_to") ?? "") || null;
  const dueDate = String(formData.get("due_date") ?? "") || null;

  if (!title) {
    return { error: "Vui lòng nhập tên công việc." };
  }

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  const { error } = await supabase.from("tasks").insert({
    trip_id: tripId,
    title,
    assigned_to: assignedTo,
    due_date: dueDate,
    created_by: userData.user?.id ?? null,
  });

  if (error) {
    return { error: "Không tạo được công việc." };
  }

  revalidatePath(`/trips/${tripId}/tasks`);
  return null;
}

export async function updateTaskStatus(
  tripId: string,
  taskId: string,
  status: TaskStatus
) {
  const supabase = await createClient();
  await supabase.from("tasks").update({ status }).eq("id", taskId);
  revalidatePath(`/trips/${tripId}/tasks`);
}

export async function deleteTask(tripId: string, taskId: string) {
  const supabase = await createClient();
  await supabase.from("tasks").delete().eq("id", taskId);
  revalidatePath(`/trips/${tripId}/tasks`);
}
