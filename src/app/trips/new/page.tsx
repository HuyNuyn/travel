"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createTrip, type CreateTripState } from "./actions";

const COLORS = ["#14213D", "#FF6B4A", "#2A9D8F", "#E9A23B", "#6B7280"];

export default function NewTripPage() {
  const [state, formAction, pending] = useActionState<
    CreateTripState,
    FormData
  >(createTrip, null);
  const [color, setColor] = useState(COLORS[0]);

  return (
    <div className="mx-auto w-full max-w-lg px-6 py-10">
      <Link
        href="/trips"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink"
      >
        <ArrowLeft size={15} />
        Tất cả chuyến đi
      </Link>

      <h1 className="mt-4 font-display text-2xl font-bold text-ink">
        Chuyến đi mới
      </h1>
      <p className="mt-1 text-sm text-muted">
        Bắt đầu với những thông tin cơ bản — bạn có thể bổ sung lịch trình,
        địa điểm sau.
      </p>

      <form action={formAction} className="mt-8 space-y-5">
        <input type="hidden" name="cover_color" value={color} />

        <div>
          <label htmlFor="name" className="text-sm font-medium text-ink">
            Tên chuyến đi
          </label>
          <input
            id="name"
            name="name"
            required
            className="mt-1.5 w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm outline-none focus:border-ink"
            placeholder="Đà Nẵng cùng hội bạn thân"
          />
        </div>

        <div>
          <label
            htmlFor="destination"
            className="text-sm font-medium text-ink"
          >
            Điểm đến
          </label>
          <input
            id="destination"
            name="destination"
            className="mt-1.5 w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm outline-none focus:border-ink"
            placeholder="Đà Nẵng, Việt Nam"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="start_date"
              className="text-sm font-medium text-ink"
            >
              Ngày khởi hành
            </label>
            <input
              id="start_date"
              name="start_date"
              type="date"
              className="mt-1.5 w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm outline-none focus:border-ink"
            />
          </div>
          <div>
            <label htmlFor="end_date" className="text-sm font-medium text-ink">
              Ngày kết thúc
            </label>
            <input
              id="end_date"
              name="end_date"
              type="date"
              className="mt-1.5 w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm outline-none focus:border-ink"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="text-sm font-medium text-ink"
          >
            Mô tả (không bắt buộc)
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="mt-1.5 w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm outline-none focus:border-ink"
            placeholder="Mục tiêu của chuyến đi, lưu ý chung..."
          />
        </div>

        <div>
          <span className="text-sm font-medium text-ink">Màu chủ đề</span>
          <div className="mt-2 flex gap-2.5">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                style={{ background: c }}
                aria-label={`Chọn màu ${c}`}
                className={`h-8 w-8 rounded-full transition ${
                  color === c
                    ? "ring-2 ring-ink ring-offset-2 ring-offset-surface"
                    : ""
                }`}
              />
            ))}
          </div>
        </div>

        {state?.error && (
          <p className="rounded-lg bg-coral-soft px-3 py-2 text-sm text-coral">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-coral py-2.5 text-sm font-medium text-white transition hover:bg-coral/90 disabled:opacity-60"
        >
          {pending ? "Đang tạo..." : "Tạo chuyến đi"}
        </button>
      </form>
    </div>
  );
}
