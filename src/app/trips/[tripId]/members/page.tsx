import { X, Crown } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { initials } from "@/lib/utils";
import { InviteForm } from "./InviteForm";
import { removeMember } from "./actions";

export default async function MembersPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  const { data: members } = await supabase
    .from("trip_members")
    .select("id, user_id, role, status, invited_email, profiles(full_name)")
    .eq("trip_id", tripId)
    .order("created_at", { ascending: true });

  const me = members?.find((m) => m.user_id === userData.user?.id);
  const isOwner = me?.role === "owner";

  return (
    <div className="max-w-2xl space-y-8">
      <section>
        <h2 className="font-display text-lg font-bold text-ink">
          Mời thêm thành viên
        </h2>
        <p className="mt-1 text-sm text-muted">
          Nhập email — nếu họ đã có tài khoản Wayfare sẽ được thêm ngay, nếu
          chưa thì lời mời sẽ tự áp dụng khi họ đăng ký.
        </p>
        <div className="mt-4">
          <InviteForm tripId={tripId} />
        </div>
      </section>

      <section>
        <h2 className="font-display text-lg font-bold text-ink">
          {members?.length ?? 0} thành viên
        </h2>
        <div className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
          {members?.map((m) => {
            const name =
              (m.profiles as unknown as { full_name: string | null } | null)
                ?.full_name ??
              m.invited_email ??
              "Thành viên";
            const canRemove =
              isOwner && m.user_id !== userData.user?.id
                ? true
                : m.user_id === userData.user?.id && m.role !== "owner";

            return (
              <div
                key={m.id}
                className="flex items-center justify-between gap-3 px-5 py-3.5"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-coral-soft text-xs font-semibold text-coral">
                    {initials(name)}
                  </span>
                  <div>
                    <p className="flex items-center gap-1.5 text-sm font-medium text-ink">
                      {name}
                      {m.role === "owner" && (
                        <Crown size={13} className="text-gold" />
                      )}
                    </p>
                    {m.status === "invited" && (
                      <p className="text-xs text-gold">Đang chờ chấp nhận</p>
                    )}
                  </div>
                </div>

                {canRemove && (
                  <form action={removeMember.bind(null, tripId, m.id)}>
                    <button
                      type="submit"
                      aria-label="Xóa thành viên"
                      className="grid h-8 w-8 place-items-center rounded-full text-muted transition hover:bg-coral-soft hover:text-coral"
                    >
                      <X size={15} />
                    </button>
                  </form>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
