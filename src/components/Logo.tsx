import { MapPinned } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-display font-bold text-lg text-ink ${className}`}
    >
      <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-white">
        <MapPinned size={15} strokeWidth={2.25} />
      </span>
      Wayfare
    </span>
  );
}
