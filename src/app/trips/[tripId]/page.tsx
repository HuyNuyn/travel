import Link from "next/link";
import { Users2, ListChecks, MapPinned, Wallet, ArrowRight, CalendarRange } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { initials, daysUntil } from "@/lib/utils";

export default async function TripOverviewPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const supabase = await createClient();

  const [{ data: trip }, { data: members }, { data: tasks }] =
    await Promise.all([
      supabase.from("trips").select("start_date").eq("id", tripId).single(),
      supabase
        .from("trip_members")
        .select("id, role, status, invited_email, profiles(full_name)")
        .eq("trip_id", tripId),
      supabase.from("tasks").select("status").eq("trip_id", tripId),
    ]);

  const countdown = daysUntil(trip?.start_date ?? null);
  const doneTasks = tasks?.filter((t) => t.status === "done").length ?? 0;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={<Users2 size={16} />}
          label="Thành viên"
          value={`${members?.length ?? 0} người`}
        />
        <StatCard
          icon={<ListChecks size={16} />}
          label="Công việc hoàn thành"
          value={`${doneTasks}/${tasks?.length ?? 0}`}
        />
        <StatCard
          icon={<CalendarRange size={16} />}
          label="Còn lại"
          value={
            countdown === null
              ? "Chưa đặt ngày"
              : countdown >= 0
              ? `${countdown} ngày`
              : "Đã diễn ra"
          }
        />
      </div>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-ink">
            Thành viên
          </h2>
          <Link
            href={`/trips/${tripId}/members`}
            className="flex items-center gap-1 text-sm font-medium text-coral hover:underline"
          >
            Quản lý <ArrowRight size={14} />
          </Link>
        </div>
        <div className="mt-3 flex flex-wrap gap-3">
          {members?.map((m) => {
            const memberName =
              (m.profiles as unknown as { full_name: string | null } | null)
                ?.full_name ??
              m.invited_email ??
              "Thành viên";
            return (
              <div
                key={m.id}
                className="flex items-center gap-2 rounded-full border border-border bg-card py-1.5 pl-1.5 pr-3.5"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-coral-soft text-xs font-semibold text-coral">
                  {initials(memberName)}
                </span>
                <span className="text-sm font-medium text-ink">
                  {memberName}
                  {m.status === "invited" && (
                    <span className="ml-1.5 text-xs text-gold">
                      (đã mời)
                    </span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="font-display text-lg font-bold text-ink">
          Sắp ra mắt
        </h2>
        <p className="mt-1 text-sm text-muted">
          Hai phần này đang được xây dựng ở giai đoạn tiếp theo của project.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <ComingSoonCard
            icon={<MapPinned size={18} />}
            title="Bản đồ & lịch trình"
            body="Tìm địa điểm trên Google Maps, lưu vào chuyến đi và xếp vào lịch trình theo từng ngày."
          />
          <ComingSoonCard
            icon={<Wallet size={18} />}
            title="Chi tiêu & chia tiền"
            body="Ghi nhận từng khoản chi, chia cho các thành viên và tự động tổng kết ai còn nợ ai."
          />
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-muted">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <p className="mt-2 font-display text-xl font-bold text-ink">{value}</p>
    </div>
  );
}

function ComingSoonCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-5 opacity-80">
      <div className="grid h-9 w-9 place-items-center rounded-full bg-surface text-ink">
        {icon}
      </div>
      <h3 className="mt-3 font-display font-bold text-ink">{title}</h3>
      <p className="mt-1 text-sm text-muted">{body}</p>
    </div>
  );
}
