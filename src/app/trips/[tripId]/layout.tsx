import { notFound } from "next/navigation";
import { MapPin, CalendarRange } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/AppHeader";
import { TripTabs } from "@/components/TripTabs";
import { formatDateRange } from "@/lib/utils";

export default async function TripLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const supabase = await createClient();

  const { data: trip } = await supabase
    .from("trips")
    .select("*")
    .eq("id", tripId)
    .single();

  if (!trip) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col">
      <AppHeader />

      <div
        className="px-6 py-6 text-white"
        style={{ background: trip.cover_color ?? "#14213D" }}
      >
        <div className="mx-auto max-w-6xl">
          <h1 className="font-display text-2xl font-bold">{trip.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-white/75">
            {trip.destination && (
              <span className="flex items-center gap-1.5">
                <MapPin size={14} />
                {trip.destination}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <CalendarRange size={14} />
              {formatDateRange(trip.start_date, trip.end_date)}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-6">
        <TripTabs tripId={tripId} />
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        {children}
      </main>
    </div>
  );
}
