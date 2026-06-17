import type { LucideIcon } from "lucide-react";

export function ComingSoonSection({
  icon: Icon,
  title,
  body,
  bullets,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  bullets: string[];
}) {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-border bg-card px-8 py-12 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-coral-soft text-coral">
        <Icon size={20} />
      </div>
      <h2 className="mt-4 font-display text-xl font-bold text-ink">
        {title}
      </h2>
      <p className="mt-2 text-sm text-muted">{body}</p>
      <ul className="mx-auto mt-5 max-w-xs space-y-1.5 text-left text-sm text-ink/70">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-coral" />
            {b}
          </li>
        ))}
      </ul>
      <p className="mt-6 inline-block rounded-full bg-gold-soft px-3 py-1 text-xs font-medium text-gold">
        Đang xây dựng — giai đoạn tiếp theo
      </p>
    </div>
  );
}
