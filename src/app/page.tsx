import Link from "next/link";
import { MapPin, Wallet, Users2, ArrowRight, CalendarRange } from "lucide-react";
import { Logo } from "@/components/Logo";
import { BoardingPassHero } from "@/components/BoardingPassHero";

const pillars = [
  {
    icon: MapPin,
    title: "Bản đồ & địa điểm",
    body: "Tìm và lưu địa điểm trực tiếp từ Google Maps — quán ăn, điểm tham quan, chỗ nghỉ — kèm đánh giá, ảnh và khoảng cách giữa các điểm.",
  },
  {
    icon: CalendarRange,
    title: "Lịch trình theo ngày",
    body: "Kéo địa điểm đã lưu vào từng ngày, sắp giờ, và xem toàn bộ chuyến đi như một hành trình rõ ràng từ ngày đầu đến ngày cuối.",
  },
  {
    icon: Wallet,
    title: "Chi tiêu & chia tiền",
    body: "Ghi lại từng khoản chi, ai trả, chia cho ai. Đến cuối chuyến, Wayfare tự tổng kết ai còn nợ ai bao nhiêu.",
  },
  {
    icon: Users2,
    title: "Cộng tác cả nhóm",
    body: "Mời bạn đồng hành bằng email. Mọi người cùng bổ sung địa điểm, nhận nhiệm vụ và theo dõi ngân sách chung.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-border bg-card/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo />
          <nav className="flex items-center gap-3 text-sm font-medium">
            <Link href="/login" className="text-ink/70 hover:text-ink">
              Đăng nhập
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-ink px-4 py-2 text-white transition hover:bg-ink-soft"
            >
              Bắt đầu miễn phí
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 sm:py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-coral">
              Lập kế hoạch du lịch nhóm
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.1] text-ink sm:text-5xl">
              Một chuyến đi, một nơi duy nhất để lên kế hoạch.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
              Gom hết bản đồ, lịch trình, ngân sách và cả nhóm bạn đồng hành
              vào một chỗ — thay vì rải rác trên chat, ghi chú và file Excel.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3 font-medium text-white transition hover:bg-coral/90"
              >
                Tạo chuyến đi đầu tiên
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/login"
                className="text-sm font-medium text-ink/70 hover:text-ink"
              >
                Tôi đã có tài khoản
              </Link>
            </div>
          </div>

          <BoardingPassHero />
        </section>

        <div className="flight-divider mx-6" />

        <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            Mọi việc cần cho một chuyến đi nhóm
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {pillars.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="grid h-10 w-10 place-items-center rounded-full bg-coral-soft text-coral">
                  <Icon size={18} />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-ink">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="rounded-2xl bg-ink px-8 py-10 text-center text-white sm:px-16">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              Chuyến đi tiếp theo của bạn bắt đầu từ đây
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-white/70">
              Tạo tài khoản miễn phí, mời bạn bè, và bắt đầu lên kế hoạch
              ngay hôm nay.
            </p>
            <Link
              href="/signup"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3 font-medium text-white transition hover:bg-coral/90"
            >
              Bắt đầu miễn phí
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-6 py-8 text-center text-xs text-muted">
        Wayfare — lập kế hoạch du lịch nhóm.
      </footer>
    </div>
  );
}
