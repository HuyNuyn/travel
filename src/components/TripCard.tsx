import Link from "next/link";
import { CalendarRange, MapPin, Users2 } from "lucide-react";
import { formatDateRange, daysUntil } from "@/lib/utils";
import type { Trip } from "@/lib/types";

export function TripCard({
  trip,
  memberCount,
}: {
  trip: Trip;
  memberCount: number;
}) {
  const countdown = daysUntil(trip.start_date);

  return (
    <Link
      href={`/trips/${trip.id}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div
        className="h-2"
        style={{ background: trip.cover_color ?? "#14213D" }}
      />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-bold text-ink">
            {trip.name}
          </h3>
          {countdown !== null && countdown >= 0 && (
            <span className="shrink-0 rounded-full bg-gold-soft px-2.5 py-1 font-mono text-xs font-medium text-gold">
              còn {countdown}d
            </span>
          )}
        </div>

        {trip.destination && (
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted">
            <MapPin size={13} />
            {trip.destination}
          </p>
        )}

        <div className="mt-4 flex items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <CalendarRange size={13} />
            {formatDateRange(trip.start_date, trip.end_date)}
          </span>
          <span className="flex items-center gap-1.5">
            <Users2 size={13} />
            {memberCount} người
          </span>
        </div>
      </div>
    </Link>
  );
}
