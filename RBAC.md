# Role-Based Access Control (RBAC) Specification

SkillSwap implements a lightweight, role-based access control architecture designed for the Code2Career Hackathon. The system separates the platform experience between **Clients** (who discover and book services) and **Creators** (who monetize skills and manage incoming orders), while keeping discovery surfaces shared.

---

## 1. Access Matrix

| Surface / Action | Route | Client | Creator | Access Behavior |
|---|---|---|---|---|
| **Marketplace Catalog** | `/` | ✓ | ✓ | Shared discovery surface. Gigs searchable and filterable. |
| **Gig Detail** | `/gigs/[id]` | ✓ | ✓ | Shared discovery surface. |
| **Book a Gig CTA & Form** | `/gigs/[id]` | ✓ | ✗ | **Client-only**. Creators see informational note: *"CREATOR MODE: Booking services is available in Client Mode."* |
| **My Bookings Workspace** | `/bookings` | ✓ | ✗ | **Client-only**. Direct access by Creator immediately redirects to `/`. No data fetched. |
| **Post a Gig** | `/gigs/new` | ✗ | ✓ | **Creator-only**. Direct access by Client immediately redirects to `/`. |
| **Creator Desk** | `/dashboard` | ✗ | ✓ | **Creator-only**. Direct access by Client immediately redirects to `/`. No data fetched. |

---

## 2. Navigation Matrix

Navigation is strictly role-aware. Neither desktop nor mobile navigation exposes the other role's workspaces or cross-role links.

### Client Mode
- **Primary Desktop Nav**: `Marketplace`, `My Bookings`
- **Mobile Menu**: `Marketplace`, `My Bookings`
- **Footer Links**: `Marketplace`, `My Bookings`
- **Hidden**: `Post a Gig`, `Creator Desk`

### Creator Mode
- **Primary Desktop Nav**: `Marketplace`, `Post a Gig`, `Creator Desk`
- **Mobile Menu**: `Marketplace`, `Post a Gig`, `Creator Desk`
- **Footer Links**: `Marketplace`, `Post a Gig`, `Creator Desk`
- **Hidden**: `My Bookings`

---

## 3. Role-Switching Behavior

The header role switcher (`role-client-btn` and `role-creator-btn`) is the **sole** intentional mechanism for changing roles. Navigation links never silently mutate the user's role.

- **Switching Client → Creator**:
  - If currently on `/` or `/gigs/[id]`: User remains on the current shared page.
  - If currently on `/bookings`: User is automatically redirected to `/` to avoid stranding on an unauthorized route.
- **Switching Creator → Client**:
  - If currently on `/` or `/gigs/[id]`: User remains on the current shared page.
  - If currently on `/dashboard` or `/gigs/new`: User is automatically redirected to `/` to avoid stranding on an unauthorized route.

---

## 4. Route Protection (`RoleGuard`)

Protected pages (`/bookings`, `/dashboard`, `/gigs/new`) are wrapped with `<RoleGuard allowedRole="...">`:
- First authorization check executes before any page-specific data fetching or form initialization.
- Creators visiting `/bookings` never trigger `fetchBookings({ clientName })`.
- Clients visiting `/dashboard` never trigger `fetchBookings({ creatorName })`.
- Unauthorized requests immediately invoke `router.replace("/")`.

---

## 5. Architectural Limitation: Demo RBAC Without Authentication

In accordance with official hackathon specifications:
- **No Login / Signup / Password**: No credentials or authentication providers are used.
- **Client-Side State**: Role preferences persist in `localStorage` via React `UserContext`.
- **Identity Display Name**: Users enter an optional demo display name (stored locally) to test booking creation and creator desk management.
