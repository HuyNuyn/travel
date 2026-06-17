import Link from "next/link";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/Logo";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";
import { initials } from "@/lib/utils";

export async function AppHeader() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  let fullName: string | null = null;
  if (data.user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", data.user.id)
      .single();
    fullName = profile?.full_name ?? null;
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link href="/trips">
          <Logo />
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 sm:flex">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-coral-soft text-xs font-semibold text-coral">
              {initials(fullName)}
            </span>
            <span className="text-sm font-medium text-ink">{fullName}</span>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-medium text-ink/70 transition hover:border-ink hover:text-ink"
            >
              <LogOut size={14} />
              Đăng xuất
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
