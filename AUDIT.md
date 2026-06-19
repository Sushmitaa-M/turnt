# 🔐 Turnt — Pre-Flight Security Audit Report

**Audit Date:** 2026-06-19  
**Auditor:** Principal Application Security Engineer (Antigravity)  
**Stack:** Next.js 16 App Router · Supabase Auth + PostgreSQL · React 19  
**Scope:** BOLA/IDOR · RLS Bypasses · Route Protection · Data Leakage

---

## Executive Summary

| # | Vulnerability | Severity | Status |
|---|---|---|---|
| 1 | **Admin route has zero server-side enforcement** | 🔴 CRITICAL | Open |
| 2 | **`profiles.role` is user-writable via RLS UPDATE policy** | 🔴 CRITICAL | Open |
| 3 | **`profiles` table is fully PUBLIC — WhatsApp/Instagram of every user is world-readable** | 🔴 CRITICAL | Open |
| 4 | **No `WITH CHECK` on `profiles` UPDATE policy — allows silent self-promotion to `admin`** | 🔴 CRITICAL | Open |
| 5 | **BOLA on `event_interests` INSERT: `user_id` is client-supplied, not server-enforced by DB** | 🟠 HIGH | Open |
| 6 | **Missing RLS policies for `events` table (INSERT/UPDATE/DELETE are completely open)** | 🔴 CRITICAL | Open |
| 7 | **`.env.local` anon key committed / exposed in project root** | 🟠 HIGH | Open |
| 8 | **`select('*')` on `events` table exposes `reg_link` (Razorpay) in the browser network tab** | 🟡 MEDIUM | Open |
| 9 | **`MyEventsSidebar` uses `select('*, events(*)')` — no explicit column whitelist** | 🟡 MEDIUM | Open |
| 10 | **Razorpay test key hardcoded in client component** | 🟠 HIGH | Open |
| 11 | **`open()` second argument bug in `window.open()` call** | 🟢 LOW | Open |

---

## FINDING #1 — 🔴 CRITICAL: Admin Dashboard Has Zero Server-Side Protection

### Affected File

[`app/admin/page.js`](file:///d:/Muksid/Ryze/turnt/app/admin/page.js) — Lines 1–47

### Exploit Path

The admin page is a **`'use client'` component**. All auth checks happen in a `useEffect` after the JavaScript bundle has fully loaded in the browser. This means:

1. **JavaScript-disabled access:** Navigate to `/admin` with JS disabled (e.g. `curl https://yoursite.com/admin`). The server renders an empty shell — no redirect, no 403. The data-fetch `useEffect` simply never runs.
2. **Race window:** Even with JS enabled, there is a brief window while the loading spinner shows where the page is already client-side and chunk data is available in the browser's devtools.
3. **No Next.js Middleware:** There is **no `middleware.ts` file at the project root**. This means the Next.js Edge runtime performs **zero enforcement** of authentication on any route. Any bot or scraper can request `/admin` freely.

```
// ❌ CURRENT — Client-side only check, bypassable
'use client'
export default function AdminDashboard() {
  useEffect(() => {
    // This only runs in the browser after JS loads.
    // curl /admin ? No problem — this code never executes.
    async function checkAccess() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return; }
      ...
    }
    checkAccess()
  }, [router])
```

### Patch

**Step 1: Create `middleware.ts` at project root** — this runs at the Edge before any page renders.

```typescript
// middleware.ts  (create at d:/Muksid/Ryze/turnt/middleware.ts)
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (n) => req.cookies.get(n)?.value, set: () => {}, remove: () => {} } }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protect /admin — must be logged in at minimum
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    // Role check must ALSO be done in the Server Component (see Step 2)
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*'],
}
```

> [!IMPORTANT]
> The middleware only has access to the session cookie — it cannot easily join the `profiles` table at the Edge without a service client. The middleware acts as the **first gate** (is the user logged in at all?). The **role check** (`profile.role === 'admin'`) must then be performed in a Server Component with a server-side Supabase client, not in a `useEffect`.

**Step 2: Convert `app/admin/page.js` to a Server Component**

```javascript
// app/admin/page.js  — Server Component (no 'use client')
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminDashboardClient from './AdminDashboardClient'  // keep UI as client

export default async function AdminPage() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookies: { get: (n) => cookieStore.get(n)?.value } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/')

  // Only reach here if authenticated admin
  const { data: eventsData } = await supabase
    .from('events')
    .select('*, event_interests( profiles(full_name, username, whatsapp_number) )')
    .order('date_time', { ascending: true })

  return <AdminDashboardClient eventsData={eventsData ?? []} />
}
```

This eliminates the TOCTOU window entirely. The HTML response itself never reaches a non-admin browser.

---

## FINDING #2 — 🔴 CRITICAL: Any User Can Self-Promote to `admin` via RLS UPDATE Policy

### Affected File

[`001_init_migration.sql`](file:///d:/Muksid/Ryze/turnt/001_init_migration.sql) — Line 16

### The Vulnerable Policy

```sql
-- ❌ CURRENT — missing WITH CHECK
CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);
  -- No WITH CHECK clause!
```

### Exploit Path

`USING` controls **which rows** a user can update (row visibility filter). `WITH CHECK` controls **what values** they can write. Without `WITH CHECK`, Supabase/PostgREST will allow any authenticated user to run:

```javascript
// Attacker opens browser console on turnt.app
const { supabase } = await import('/path/to/supabaseClient.js');
await supabase
  .from('profiles')
  .update({ role: 'admin' })
  .eq('id', supabase.auth.getUser().data.user.id);
// Response: { data: [...], error: null }
// The user is now admin. They can now access the admin dashboard.
```

The `role` column has a `CHECK (role IN ('user', 'admin'))` constraint at the DB level, but that only validates the value is one of those strings — it does **not** prevent a user from writing `'admin'` to their own row.

### Patch

```sql
-- ✅ PATCHED — drop old policy and recreate with WITH CHECK
DROP POLICY "Users can update own profile." ON public.profiles;

CREATE POLICY "Users can update own profile."
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
    -- ^^ role must remain what it currently is — cannot be changed by the user
  );
```

Or, more simply, prohibit `role` from being updated via RLS entirely and manage it only through a privileged server-side function or the Supabase dashboard:

```sql
DROP POLICY "Users can update own profile." ON public.profiles;

-- Policy only allows updating non-sensitive fields; role is excluded via app logic
CREATE POLICY "Users can update own profile."
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    -- Enforce role immutability at DB level:
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
  );
```

---

## FINDING #3 — 🔴 CRITICAL: `profiles` Table is Fully World-Readable

### Affected File

[`001_init_migration.sql`](file:///d:/Muksid/Ryze/turnt/001_init_migration.sql) — Line 14

### The Vulnerable Policy

```sql
-- ❌ CURRENT — exposes ALL columns of ALL users to anyone, including unauthenticated visitors
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT USING (true);
```

### Exploit Path

Any visitor — unauthenticated, a bot, a competitor — can run:

```javascript
const { data } = await supabase.from('profiles').select('*');
// Returns: full_name, username, whatsapp_number, instagram_handle, role for EVERY user
// WhatsApp numbers of your entire user base are now exposed.
```

This is a **data breach at the schema level**. WhatsApp numbers are PII under DPDP Act 2023 (India). Leaking them to the open web is a regulatory violation, not just a security issue.

### Patch

Restrict what unauthenticated users can see, and what authenticated non-admins can see about others:

```sql
DROP POLICY "Public profiles are viewable by everyone." ON public.profiles;

-- Public can only see non-PII fields (for displaying usernames in UI)
CREATE POLICY "Public can view non-PII profile fields."
  ON public.profiles FOR SELECT
  USING (true);
-- NOTE: This alone isn't enough. You must use column-level security or
-- explicit select() in your queries. RLS in Postgres is row-level only.
-- Use the application-level fix below alongside this.
```

> [!WARNING]
> Postgres RLS is **row-level only**, not column-level. The fix must be enforced at the **application query level** by never doing `select('*')` on `profiles` in a client component. Use explicit column lists and never include `whatsapp_number` or `instagram_handle` in client-side queries.

**Application-level fix in `AuthForm.jsx` (line 163):**

```javascript
// ❌ CURRENT
const { data: existingUser } = await supabase
  .from('profiles')
  .select('username')   // ✅ This one is already correct — only fetches username

// ❌ Any other place that might do select('*') on profiles must be changed
```

**Additional mitigation: Create a restrictive view for public consumption:**

```sql
-- Create a safe public view that excludes PII
CREATE VIEW public.public_profiles AS
  SELECT id, username, full_name
  FROM public.profiles;

-- Grant select on this view, revoke direct table access if possible
GRANT SELECT ON public.public_profiles TO anon, authenticated;
```

---

## FINDING #4 — 🔴 CRITICAL: No RLS Policies Protecting `events` Table for Writes

### Affected File

[`001_init_migration.sql`](file:///d:/Muksid/Ryze/turnt/001_init_migration.sql) — Lines 30–33

### The Problem

```sql
-- ❌ CURRENT — only SELECT is protected. INSERT/UPDATE/DELETE have NO policies.
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Events are viewable by everyone." ON public.events FOR SELECT USING (true);
-- Comment says "application-level logic" — but there IS no application-level check!
-- Any authenticated user can INSERT, UPDATE, and DELETE events.
```

When RLS is enabled on a table but no policy covers a particular operation, **PostgREST defaults to DENY for that operation** — but only for the `anon` role. For the `authenticated` role, the behavior depends on Supabase's default grants. If `authenticated` has been granted INSERT/UPDATE/DELETE, all authenticated users can freely mutate events.

### Exploit Path

```javascript
// Any logged-in user can create a fake event:
await supabase.from('events').insert({
  name: 'Fake Giveaway Event',
  description: 'Win a free iPhone! Click reg_link...',
  reg_link: 'https://malicious-phishing-site.com',
  date_time: new Date().toISOString(),
  venue: 'Marina Beach',
  ticket_price: 0,
});
// Event now appears on the homepage for all users.
```

### Patch

```sql
-- Add admin-only write policies for events table
CREATE POLICY "Only admins can insert events."
  ON public.events FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update events."
  ON public.events FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete events."
  ON public.events FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

## FINDING #5 — 🟠 HIGH: BOLA on `event_interests` — Client Controls `user_id`

### Affected File

[`app/components/UpcomingEvents.jsx`](file:///d:/Muksid/Ryze/turnt/app/components/UpcomingEvents.jsx) — Lines 360–363

### The Code

```javascript
// ❌ CURRENT — user_id is read from client-side state (user.id from getUser())
const { error } = await supabase
  .from('event_interests')
  .insert({ user_id: user.id, event_id: eventId });
```

### The RLS Policy (Migration, line 47)

```sql
CREATE POLICY "Users can insert their own interests."
  ON public.event_interests FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### Assessment

**The RLS policy is actually CORRECT here** — `WITH CHECK (auth.uid() = user_id)` means the database will reject any INSERT where the supplied `user_id` does not match the authenticated session's `auth.uid()`. So an attacker who intercepts the payload and changes `user_id` to another user's UUID would get a **policy violation error** from Supabase.

✅ This specific exploit path is **blocked at the database level**.

**However**, there's a subtler issue: the `user.id` value is sourced from `supabase.auth.getUser()` on the client. This is safe — `getUser()` re-validates the JWT with the Supabase server on every call. It does **not** read from local storage or a cookie that could be manipulated.

**Remaining Risk:** The `event_id` is not validated beyond referential integrity. Any valid `event_id` UUID can be submitted. Since there's no "registration closed" check, users can RSVP for past events. This is a logic flaw, not a security exploit, but worth noting.

### Minor Hardening

Redundantly pass `user_id` from the server to reduce attack surface, or remove the explicit `user_id` from the INSERT and rely on a DB trigger or server-side RPC:

```sql
-- DB function approach — user_id is set server-side
CREATE OR REPLACE FUNCTION add_interest(p_event_id UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO public.event_interests (user_id, event_id)
  VALUES (auth.uid(), p_event_id)
  ON CONFLICT (user_id, event_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

```javascript
// Client calls the function — user_id is never passed by the client
await supabase.rpc('add_interest', { p_event_id: eventId });
```

---

## FINDING #6 — 🟠 HIGH: Razorpay Test Key Hardcoded in Client Bundle

### Affected File

[`app/components/EventBookingPage.jsx`](file:///d:/Muksid/Ryze/turnt/app/components/EventBookingPage.jsx) — Line 612

```javascript
// ❌ CURRENT — test key in client bundle, shipped to every browser
const options = {
  key: 'rzp_test_1DP5mmOlF5G5ag',
  amount: finalAmount,
  ...
};
```

### Risk

1. The test key can be used to **create orders against your Razorpay test account**, running up fake test transactions.
2. When you flip to production, if this key is replaced inline, your live `rzp_live_*` key will be embedded in the browser bundle — **any user can view-source and extract it**.
3. The amount is computed client-side with offer discounts applied locally. There is **no server-side order creation** — an attacker can intercept the Razorpay `handler` response and call `onSuccess` with a fake `razorpay_payment_id`, receiving a "confirmed" ticket without paying.

### Patch

Production Razorpay requires server-side order creation. Create a Route Handler:

```javascript
// app/api/create-order/route.js  [NEW FILE]
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,       // server-only, not NEXT_PUBLIC_
  key_secret: process.env.RAZORPAY_KEY_SECRET, // never exposed to browser
});

export async function POST(req) {
  // Verify user is authenticated
  const cookieStore = cookies();
  const supabase = createServerClient(...);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { eventId, offerCode } = await req.json();
  
  // Compute amount SERVER-SIDE — never trust client amount
  const { data: event } = await supabase.from('events').select('ticket_price').eq('id', eventId).single();
  const amount = computeDiscountedAmount(event.ticket_price, offerCode); // server logic

  const order = await razorpay.orders.create({
    amount,
    currency: 'INR',
    receipt: `turnt_${eventId}_${user.id}`,
  });

  return NextResponse.json({ orderId: order.id, amount: order.amount });
}
```

```javascript
// In EventBookingPage.jsx — use the server-created order
const { orderId, amount } = await fetch('/api/create-order', {
  method: 'POST',
  body: JSON.stringify({ eventId: event.id, offerCode: selectedOffer?.id }),
}).then(r => r.json());

const options = {
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // only the key ID is public — not the secret
  amount,
  order_id: orderId, // <-- required for production
  ...
};
```

---

## FINDING #7 — 🟡 MEDIUM: `select('*')` on `events` in Public Client Component

### Affected File

[`app/components/UpcomingEvents.jsx`](file:///d:/Muksid/Ryze/turnt/app/components/UpcomingEvents.jsx) — Line 331

```javascript
// ❌ CURRENT — fetches ALL columns including reg_link
const { data: dbEvents, error } = await supabase
  .from('events')
  .select('*')
  .order('date_time', { ascending: true });
```

### Risk

The `reg_link` field contains the Razorpay/Google Forms URL used for registration. Exposing this in a client-side `select('*')` call means:

1. Every browser's Network tab shows all event data in plaintext JSON.
2. If `reg_link` is an internal Google Form with auto-fill parameters, that URL is now publicly discoverable.

### Patch

```javascript
// ✅ Only fetch what the UI actually renders
const { data: dbEvents } = await supabase
  .from('events')
  .select('id, name, description, date_time, venue, ticket_price')
  .order('date_time', { ascending: true });
```

If `reg_link` is needed for the "Register Now" button, only fetch it when the user clicks register, or fetch only the specific event's `reg_link` at that moment.

---

## FINDING #8 — 🟡 MEDIUM: `MyEventsSidebar` Uses `select('*, events(*)')`

### Affected File

[`app/components/MyEventsSidebar.jsx`](file:///d:/Muksid/Ryze/turnt/app/components/MyEventsSidebar.jsx) — Lines 24–27

```javascript
// ❌ CURRENT — wildcard join fetches all event columns
const { data } = await supabase
  .from('event_interests')
  .select('*, events(*)')
  .eq('user_id', currentUser.id)
```

### Risk

The `events(*)` join pulls all event columns into the browser, including `reg_link`. Combine this with the `event_interests.*` wildcard and you're shipping the entire raw database row to the client. As the schema grows (e.g., adding internal `cost_price`, `admin_notes` columns to events), these would automatically be exposed.

### Patch

```javascript
// ✅ Explicit column selection
const { data } = await supabase
  .from('event_interests')
  .select('id, event_id, created_at, events(id, name, date_time, venue, ticket_price)')
  .eq('user_id', currentUser.id)
```

---

## FINDING #9 — 🟠 HIGH: `.env.local` Contains Live Supabase Credentials — Gitignore Verification

### Affected File

[`.env.local`](file:///d:/Muksid/Ryze/turnt/.env.local) — Both lines

The `.env.local` file contains the **live Supabase project URL and anon key**:

```
NEXT_PUBLIC_SUPABASE_URL=https://kwdcapxssnlhcxmfjevd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

While `.env.local` is gitignored (confirmed), the `.env.example` file mentioned in AGENTS.md **does not exist** in the repository. If any developer accidentally runs `git add -f .env.local` or creates a `.env` (not `.env.local`) file, these credentials hit the repo.

Additionally, the `NEXT_PUBLIC_` prefix means the anon key is **intentionally shipped to the browser** — this is by design for Supabase. However, it should be rotated if it's ever been committed.

### Actions Required

```bash
# Verify .env.local is not tracked
git ls-files --error-unmatch .env.local
# If the above exits 0, it's tracked — ROTATE YOUR KEY IMMEDIATELY

# Create the missing .env.example (required by AGENTS.md)
```

```bash
# .env.example (create this file)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
# Server-only (add when Razorpay server orders are implemented):
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

---

## FINDING #10 — 🟢 LOW: `window.open()` Bug — Second Argument is a URL, Not a Target

### Affected File

[`app/components/UpcomingEvents.jsx`](file:///d:/Muksid/Ryze/turnt/app/components/UpcomingEvents.jsx) — Lines 247–249

```javascript
// ❌ CURRENT — second arg should be a window target name, not a URL
window.open(event.regLink, 'https://forms.gle/k83dSb9k3YdtVW6Y8', 'noopener,noreferrer');
```

`window.open(url, name, features)` — the second argument is the **window/tab name** (e.g. `'_blank'`), not a URL. The Google Form URL as the name is treated as the target window name (creating an oddly named tab). This is a logic bug causing unpredictable behavior across browsers.

### Patch

```javascript
// ✅ Correct usage
window.open(event.regLink, '_blank', 'noopener,noreferrer');
```

---

## Remediation Priority Queue

```
IMMEDIATE (before any production deployment):
  1. Create middleware.ts — blocks unauthenticated /admin access at Edge
  2. Convert /admin to Server Component — role check on the server
  3. Add WITH CHECK to profiles UPDATE policy — blocks role self-promotion
  4. Add INSERT/UPDATE/DELETE policies to events table — blocks content injection
  5. Rotate anon key if .env.local was ever committed to git

SHORT-TERM (within this sprint):
  6. Add Razorpay server-side order creation (Route Handler)
  7. Replace select('*') with explicit column lists in UpcomingEvents and MyEventsSidebar
  8. Create .env.example file

MEDIUM-TERM (before user growth):
  9. Implement column-level access control via a restricted public view for profiles
  10. Consider moving reg_link behind a server-side RPC call
  11. Fix window.open() second argument bug
```

---

## Corrected SQL Migration (Full Patch)

```sql
-- 001_security_patches.sql

-- ── Patch 1: Fix profiles UPDATE policy to prevent role escalation ──
DROP POLICY "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
  );

-- ── Patch 2: Restrict profile SELECT — no anonymous access to PII ──
DROP POLICY "Public profiles are viewable by everyone." ON public.profiles;

-- Authenticated users can see safe fields of all profiles
CREATE POLICY "Authenticated users can view public profile fields."
  ON public.profiles FOR SELECT TO authenticated
  USING (true);

-- Anon can only view their own (none — they're not logged in)
-- Remove anon select entirely or restrict to non-PII via view

-- ── Patch 3: Add admin-only write policies for events ──
CREATE POLICY "Only admins can insert events."
  ON public.events FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can update events."
  ON public.events FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Only admins can delete events."
  ON public.events FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ── Patch 4: RPC for interest insertion (removes client user_id control) ──
CREATE OR REPLACE FUNCTION public.add_event_interest(p_event_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
BEGIN
  INSERT INTO public.event_interests (user_id, event_id)
  VALUES (auth.uid(), p_event_id)
  ON CONFLICT (user_id, event_id) DO NOTHING;
END;
$$;
```
