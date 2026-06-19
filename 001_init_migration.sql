-- 1. Create custom user profiles table extending Supabase Auth
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    whatsapp_number TEXT NOT NULL,
    instagram_handle TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS) for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Create Events Table
CREATE TABLE public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    reg_link TEXT NOT NULL,
    date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    venue TEXT NOT NULL,
    ticket_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up RLS for events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Events are viewable by everyone." ON public.events FOR SELECT USING (true);
-- Only admins can create/update/delete events (requires application-level logic to enforce admin role)

-- 3. Create Event Interests Table (RSVPs)
CREATE TABLE public.event_interests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, event_id) -- Prevents a user from marking interested twice on the same event
);

-- Set up RLS for event interests
ALTER TABLE public.event_interests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own interests." ON public.event_interests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own interests." ON public.event_interests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own interests." ON public.event_interests FOR DELETE USING (auth.uid() = user_id);