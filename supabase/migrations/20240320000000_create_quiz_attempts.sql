-- Create quiz_attempts table
create table public.quiz_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  score numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.quiz_attempts enable row level security;

-- Create policies
create policy "Users can view their own quiz attempts"
  on public.quiz_attempts for select
  using (auth.uid() = user_id);

create policy "Users can insert their own quiz attempts"
  on public.quiz_attempts for insert
  with check (auth.uid() = user_id);

-- Create index for faster queries
create index quiz_attempts_user_id_idx on public.quiz_attempts(user_id);
create index quiz_attempts_created_at_idx on public.quiz_attempts(created_at desc); 