"use client";

import { useActionState } from "react";
import { UserPlus } from "lucide-react";
import { inviteMember, type MemberFormState } from "./actions";

export function InviteForm({ tripId }: { tripId: string }) {
  const [state, formAction, pending] = useActionState<
    MemberFormState,
    FormData
  >(inviteMember, null);

  return (
    <form action={formAction} className="flex flex-col gap-2 sm:flex-row">
      <input type="hidden" name="tripId" value={tripId} />
      <input
        type="email"
        name="email"
        required
        placeholder="email-cua-ban@vidu.com"
        className="flex-1 rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm outline-none focus:border-ink"
      />
      <button
        type="submit"
        disabled={pending}
        className="flex items-center justify-center gap-1.5 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white transition hover:bg-ink-soft disabled:opacity-60"
      >
        <UserPlus size={15} />
        {pending ? "Đang mời..." : "Mời"}
      </button>
      {state?.error && (
        <p className="text-sm text-coral sm:basis-full">{state.error}</p>
      )}
      {state?.success && (
        <p className="text-sm text-teal sm:basis-full">{state.success}</p>
      )}
    </form>
  );
}
