import { Plane, Users, Wallet } from "lucide-react";

export function BoardingPassHero() {
  return (
    <div className="relative mx-auto w-full max-w-sm rotate-1 rounded-2xl bg-card shadow-[0_30px_60px_-15px_rgba(20,33,61,0.25)] sm:rotate-2">
      <div className="rounded-t-2xl bg-ink px-6 py-4 text-white">
        <div className="flex items-center justify-between font-mono text-xs tracking-widest text-white/70">
          <span>VÉ LÊN KẾ HOẠCH</span>
          <span>#WF-0142</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <div className="font-display text-2xl font-bold">HAN</div>
            <div className="text-xs text-white/60">Hà Nội</div>
          </div>
          <Plane size={20} className="text-coral" />
          <div className="text-right">
            <div className="font-display text-2xl font-bold">ĐAD</div>
            <div className="text-xs text-white/60">Đà Nẵng</div>
          </div>
        </div>
      </div>

      <div className="ticket-notch flight-divider" />

      <div className="space-y-4 rounded-b-2xl px-6 py-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Ngày khởi hành</span>
          <span className="font-mono font-medium">24/07 → 28/07</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 text-muted">
            <Users size={14} /> Thành viên
          </span>
          <span className="font-medium">4 người</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 text-muted">
            <Wallet size={14} /> Đã chi tiêu
          </span>
          <span className="font-mono font-medium text-coral">4.250.000đ</span>
        </div>

        <div className="rounded-lg bg-teal-soft px-3 py-2 text-xs font-medium text-teal">
          Mỗi người còn lại đóng 312.500đ
        </div>
      </div>
    </div>
  );
}
