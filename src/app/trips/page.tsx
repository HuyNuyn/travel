import Link from "next/link";
import { Plus, Plane } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/AppHeader";
import { TripCard } from "@/components/TripCard";
import type { Trip } from "@/lib/types";

export default async function TripsPage() {
  const supabase = await createClient();

  const { data: trips, error } = await supabase
    .from("trips")
    .select("*, trip_members(count)")
    .order("start_date", { ascending: true, nullsFirst: false });

  return (
    <div className="flex flex-1 flex-col">
      <AppHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">
              Chuyến đi của bạn
            </h1>
            <p className="mt-1 text-sm text-muted">
              Các chuyến đi bạn tạo hoặc được mời tham gia.
            </p>
          </div>
          <Link
            href="/trips/new"
            className="flex items-center gap-1.5 rounded-full bg-coral px-4 py-2.5 text-sm font-medium text-white transition hover:bg-coral/90"
          >
            <Plus size={16} />
            Chuyến đi mới
          </Link>
        </div>

        {error && (
          <p className="mt-8 rounded-lg bg-coral-soft px-4 py-3 text-sm text-coral">
            Không tải được danh sách chuyến đi: {error.message}
          </p>
        )}

        {!error && trips && trips.length === 0 && (
          <div className="mt-10 flex flex-col items-center rounded-2xl border border-dashed border-border bg-card py-20 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-coral-soft text-coral">
              <Plane size={20} />
            </div>
            <h2 className="mt-4 font-display text-lg font-bold text-ink">
              Chưa có chuyến đi nào
            </h2>
            <p className="mt-1 max-w-sm text-sm text-muted">
              Tạo chuyến đi đầu tiên để bắt đầu lên lịch trình và mời bạn bè
              tham gia.
            </p>
            <Link
              href="/trips/new"
              className="mt-5 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition hover:bg-ink-soft"
            >
              Tạo chuyến đi
            </Link>
          </div>
        )}

        {trips && trips.length > 0 && (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip as Trip}
                memberCount={
                  (trip.trip_members as { count: number }[])?.[0]?.count ?? 1
                }
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
