import { createClient } from "@/lib/supabase/server";
import { TaskForm } from "./TaskForm";
import { TaskRow } from "./TaskRow";
import type { Task } from "@/lib/types";

export default async function TasksPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const supabase = await createClient();

  const [{ data: tasks }, { data: members }] = await Promise.all([
    supabase
      .from("tasks")
      .select(
        "*, assignee:profiles!tasks_assigned_to_fkey(id, full_name, avatar_url, created_at)"
      )
      .eq("trip_id", tripId)
      .order("created_at", { ascending: false }),
    supabase
      .from("trip_members")
      .select("user_id, profiles(full_name)")
      .eq("trip_id", tripId)
      .eq("status", "active"),
  ]);

  const memberOptions = (members ?? [])
    .filter((m) => m.user_id)
    .map((m) => ({
      id: m.user_id as string,
      name:
        (m.profiles as unknown as { full_name: string | null } | null)
          ?.full_name ??
        "Thành viên",
    }));

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="font-display text-lg font-bold text-ink">
          Công việc cần làm
        </h2>
        <p className="mt-1 text-sm text-muted">
          Phân công ai làm gì trước chuyến đi — đặt vé, xin nghỉ, chuẩn bị đồ.
        </p>
      </div>

      <TaskForm tripId={tripId} members={memberOptions} />

      {tasks && tasks.length > 0 ? (
        <div className="divide-y divide-border rounded-2xl border border-border bg-card">
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task as unknown as Task} tripId={tripId} />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-border py-10 text-center text-sm text-muted">
          Chưa có công việc nào. Thêm công việc đầu tiên ở trên.
        </p>
      )}
    </div>
  );
}
