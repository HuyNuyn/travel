export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
};

export type Trip = {
  id: string;
  name: string;
  destination: string | null;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  cover_color: string | null;
  created_by: string;
  created_at: string;
};

export type MemberRole = "owner" | "editor" | "member";
export type MemberStatus = "invited" | "active";

export type TripMember = {
  id: string;
  trip_id: string;
  user_id: string | null;
  invited_email: string | null;
  role: MemberRole;
  status: MemberStatus;
  created_at: string;
  profiles: Profile | null;
};

export type TaskStatus = "todo" | "in_progress" | "done";

export type Task = {
  id: string;
  trip_id: string;
  title: string;
  description: string | null;
  assigned_to: string | null;
  due_date: string | null;
  status: TaskStatus;
  created_by: string | null;
  created_at: string;
  assignee: Profile | null;
};

export type Place = {
  id: string;
  trip_id: string;
  google_place_id: string | null;
  name: string;
  address: string | null;
  lat: number | null;
  lng: number | null;
  category: string | null;
  photo_url: string | null;
  rating: number | null;
  price_level: number | null;
  notes: string | null;
  added_by: string | null;
  created_at: string;
};

export type Expense = {
  id: string;
  trip_id: string;
  paid_by: string | null;
  title: string;
  amount: number;
  currency: string;
  category: string | null;
  expense_date: string;
  notes: string | null;
  created_at: string;
};

export type ExpenseSplit = {
  id: string;
  expense_id: string;
  user_id: string;
  share_amount: number;
  is_settled: boolean;
};
