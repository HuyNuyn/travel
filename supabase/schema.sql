-- ============================================================================
-- TRAVEL PLANNER - DATABASE SCHEMA
-- Chạy toàn bộ file này trong Supabase Dashboard > SQL Editor > New query
-- ============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- PROFILES (mở rộng cho mỗi auth.users)
-- ----------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_all_authenticated"
  on public.profiles for select
  to authenticated
  using (true);

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ----------------------------------------------------------------------------
-- TRIPS
-- ----------------------------------------------------------------------------
create table public.trips (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  destination text,
  description text,
  start_date date,
  end_date date,
  cover_color text default '#14213D',
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index trips_created_by_idx on public.trips(created_by);

-- ----------------------------------------------------------------------------
-- TRIP MEMBERS
-- ----------------------------------------------------------------------------
create table public.trip_members (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  invited_email text,
  role text not null default 'member' check (role in ('owner', 'editor', 'member')),
  status text not null default 'active' check (status in ('invited', 'active')),
  created_at timestamptz not null default now(),
  unique (trip_id, user_id)
);

create index trip_members_trip_idx on public.trip_members(trip_id);
create index trip_members_user_idx on public.trip_members(user_id);
create unique index trip_members_pending_invite_idx
  on public.trip_members(trip_id, lower(invited_email))
  where user_id is null;

-- ----------------------------------------------------------------------------
-- TRIP DAYS (khung ngày cho lịch trình)
-- ----------------------------------------------------------------------------
create table public.trip_days (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  day_date date,
  day_index int not null default 0,
  notes text,
  created_at timestamptz not null default now()
);

create index trip_days_trip_idx on public.trip_days(trip_id);

-- ----------------------------------------------------------------------------
-- PLACES (địa điểm đã lưu từ Google Maps cho một chuyến đi)
-- ----------------------------------------------------------------------------
create table public.places (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  google_place_id text,
  name text not null,
  address text,
  lat double precision,
  lng double precision,
  category text,
  photo_url text,
  rating numeric(2,1),
  price_level int,
  notes text,
  added_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index places_trip_idx on public.places(trip_id);

-- ----------------------------------------------------------------------------
-- ITINERARY ITEMS (lịch trình theo từng ngày)
-- ----------------------------------------------------------------------------
create table public.itinerary_items (
  id uuid primary key default gen_random_uuid(),
  trip_day_id uuid not null references public.trip_days(id) on delete cascade,
  place_id uuid references public.places(id) on delete set null,
  custom_title text,
  start_time time,
  end_time time,
  notes text,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

create index itinerary_items_day_idx on public.itinerary_items(trip_day_id);

-- ----------------------------------------------------------------------------
-- EXPENSES + EXPENSE SPLITS (chi tiêu và chia tiền)
-- ----------------------------------------------------------------------------
create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  paid_by uuid references public.profiles(id) on delete set null,
  title text not null,
  amount numeric(14,2) not null,
  currency text not null default 'VND',
  category text,
  expense_date date not null default current_date,
  notes text,
  created_at timestamptz not null default now()
);

create index expenses_trip_idx on public.expenses(trip_id);

create table public.expense_splits (
  id uuid primary key default gen_random_uuid(),
  expense_id uuid not null references public.expenses(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  share_amount numeric(14,2) not null,
  is_settled boolean not null default false,
  unique (expense_id, user_id)
);

create index expense_splits_expense_idx on public.expense_splits(expense_id);

-- ----------------------------------------------------------------------------
-- TASKS (phân công nhiệm vụ)
-- ----------------------------------------------------------------------------
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  title text not null,
  description text,
  assigned_to uuid references public.profiles(id) on delete set null,
  due_date date,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'done')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index tasks_trip_idx on public.tasks(trip_id);
create index tasks_assigned_idx on public.tasks(assigned_to);

-- ============================================================================
-- HELPER FUNCTIONS (security definer => được phép đọc trip_members an toàn
-- mà không gây đệ quy RLS)
-- ============================================================================
create or replace function public.is_trip_member(p_trip_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.trip_members
    where trip_id = p_trip_id and user_id = auth.uid() and status = 'active'
  );
$$;

create or replace function public.is_trip_owner(p_trip_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.trip_members
    where trip_id = p_trip_id and user_id = auth.uid() and role = 'owner' and status = 'active'
  );
$$;

create or replace function public.get_user_id_by_email(p_email text)
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select id from auth.users where lower(email) = lower(p_email) limit 1;
$$;

grant execute on function public.is_trip_member(uuid) to authenticated;
grant execute on function public.is_trip_owner(uuid) to authenticated;
grant execute on function public.get_user_id_by_email(text) to authenticated;

-- ============================================================================
-- TRIGGERS: tự tạo profile khi đăng ký + tự thêm owner khi tạo trip
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );

  -- Nếu trước đó đã được mời vào trip nào bằng email này, tự động kích hoạt
  update public.trip_members
  set user_id = new.id, status = 'active', invited_email = null
  where invited_email is not null
    and lower(invited_email) = lower(new.email)
    and user_id is null;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.handle_new_trip()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.trip_members (trip_id, user_id, role, status)
  values (new.id, new.created_by, 'owner', 'active');
  return new;
end;
$$;

create trigger on_trip_created
  after insert on public.trips
  for each row execute procedure public.handle_new_trip();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
alter table public.trips enable row level security;
alter table public.trip_members enable row level security;
alter table public.trip_days enable row level security;
alter table public.places enable row level security;
alter table public.itinerary_items enable row level security;
alter table public.expenses enable row level security;
alter table public.expense_splits enable row level security;
alter table public.tasks enable row level security;

-- TRIPS ------------------------------------------------------------------
create policy "trips_select_member" on public.trips for select to authenticated
  using (public.is_trip_member(id));
create policy "trips_insert_self" on public.trips for insert to authenticated
  with check (auth.uid() = created_by);
create policy "trips_update_owner" on public.trips for update to authenticated
  using (public.is_trip_owner(id)) with check (public.is_trip_owner(id));
create policy "trips_delete_owner" on public.trips for delete to authenticated
  using (public.is_trip_owner(id));

-- TRIP MEMBERS -------------------------------------------------------------
create policy "trip_members_select_member" on public.trip_members for select to authenticated
  using (public.is_trip_member(trip_id));
create policy "trip_members_insert_owner" on public.trip_members for insert to authenticated
  with check (public.is_trip_owner(trip_id));
create policy "trip_members_update_owner" on public.trip_members for update to authenticated
  using (public.is_trip_owner(trip_id)) with check (public.is_trip_owner(trip_id));
create policy "trip_members_delete_owner_or_self" on public.trip_members for delete to authenticated
  using (public.is_trip_owner(trip_id) or user_id = auth.uid());

-- TRIP DAYS ------------------------------------------------------------------
create policy "trip_days_select_member" on public.trip_days for select to authenticated
  using (public.is_trip_member(trip_id));
create policy "trip_days_insert_member" on public.trip_days for insert to authenticated
  with check (public.is_trip_member(trip_id));
create policy "trip_days_update_member" on public.trip_days for update to authenticated
  using (public.is_trip_member(trip_id)) with check (public.is_trip_member(trip_id));
create policy "trip_days_delete_member" on public.trip_days for delete to authenticated
  using (public.is_trip_member(trip_id));

-- PLACES ---------------------------------------------------------------------
create policy "places_select_member" on public.places for select to authenticated
  using (public.is_trip_member(trip_id));
create policy "places_insert_member" on public.places for insert to authenticated
  with check (public.is_trip_member(trip_id));
create policy "places_update_member" on public.places for update to authenticated
  using (public.is_trip_member(trip_id)) with check (public.is_trip_member(trip_id));
create policy "places_delete_member" on public.places for delete to authenticated
  using (public.is_trip_member(trip_id));

-- ITINERARY ITEMS --------------------------------------------------------------
create policy "itinerary_select_member" on public.itinerary_items for select to authenticated
  using (exists (
    select 1 from public.trip_days d
    where d.id = itinerary_items.trip_day_id and public.is_trip_member(d.trip_id)
  ));
create policy "itinerary_insert_member" on public.itinerary_items for insert to authenticated
  with check (exists (
    select 1 from public.trip_days d
    where d.id = itinerary_items.trip_day_id and public.is_trip_member(d.trip_id)
  ));
create policy "itinerary_update_member" on public.itinerary_items for update to authenticated
  using (exists (
    select 1 from public.trip_days d
    where d.id = itinerary_items.trip_day_id and public.is_trip_member(d.trip_id)
  ));
create policy "itinerary_delete_member" on public.itinerary_items for delete to authenticated
  using (exists (
    select 1 from public.trip_days d
    where d.id = itinerary_items.trip_day_id and public.is_trip_member(d.trip_id)
  ));

-- EXPENSES ---------------------------------------------------------------------
create policy "expenses_select_member" on public.expenses for select to authenticated
  using (public.is_trip_member(trip_id));
create policy "expenses_insert_member" on public.expenses for insert to authenticated
  with check (public.is_trip_member(trip_id));
create policy "expenses_update_payer_or_owner" on public.expenses for update to authenticated
  using (paid_by = auth.uid() or public.is_trip_owner(trip_id));
create policy "expenses_delete_payer_or_owner" on public.expenses for delete to authenticated
  using (paid_by = auth.uid() or public.is_trip_owner(trip_id));

-- EXPENSE SPLITS -----------------------------------------------------------------
create policy "splits_select_member" on public.expense_splits for select to authenticated
  using (exists (
    select 1 from public.expenses e
    where e.id = expense_splits.expense_id and public.is_trip_member(e.trip_id)
  ));
create policy "splits_insert_member" on public.expense_splits for insert to authenticated
  with check (exists (
    select 1 from public.expenses e
    where e.id = expense_splits.expense_id and public.is_trip_member(e.trip_id)
  ));
create policy "splits_update_member" on public.expense_splits for update to authenticated
  using (exists (
    select 1 from public.expenses e
    where e.id = expense_splits.expense_id and public.is_trip_member(e.trip_id)
  ));
create policy "splits_delete_member" on public.expense_splits for delete to authenticated
  using (exists (
    select 1 from public.expenses e
    where e.id = expense_splits.expense_id and public.is_trip_member(e.trip_id)
  ));

-- TASKS ----------------------------------------------------------------------------
create policy "tasks_select_member" on public.tasks for select to authenticated
  using (public.is_trip_member(trip_id));
create policy "tasks_insert_member" on public.tasks for insert to authenticated
  with check (public.is_trip_member(trip_id));
create policy "tasks_update_member" on public.tasks for update to authenticated
  using (public.is_trip_member(trip_id)) with check (public.is_trip_member(trip_id));
create policy "tasks_delete_creator_or_owner" on public.tasks for delete to authenticated
  using (created_by = auth.uid() or public.is_trip_owner(trip_id));
