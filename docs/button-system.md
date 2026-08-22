# Button & CTA System — Wing's Buy n Sell

> Canonical contract for `src/components/ui/button.tsx`. Reusable CTA primitive for the whole site.
> Supersedes the inline button spec. Enforced by `docs/design-system.md` §6 and `playbooks/styling/tailwind.md`.

## Purpose

One Button component renders every CTA (header, hero, cards, contact, mobile drawer, footer). It produces a real `<a>` or `<button>`, supports variants/sizes, and matches the editorial white-first / automotive-red identity.

## DOM contract

- `data-ui="button"` on the root element (this project uses `data-ui`, not `data-component`).
- Root is `group` so child icons can animate on hover.
- Content lives in a `relative z-10` span so it sits above the sweep layer.
- Interactive affordance provided by `focus-visible:ring-2 ring-primary`, `disabled:opacity-50`, `motion-reduce` guards.

## Variants

| Variant   | Background                   | Text                                 | Border                 | Use                                                  |
| --------- | ---------------------------- | ------------------------------------ | ---------------------- | ---------------------------------------------------- |
| `primary` | `bg-primary` (red)           | `text-primary-foreground` (white)    | `border-primary`       | Main CTAs: hero "Message", contact                   |
| `dark`    | `bg-foreground` (near-black) | `text-background` (white)            | `border-foreground`    | Header "Message Us", emphasis actions                |
| `outline` | transparent                  | `text-foreground`                    | `border-foreground/20` | Hero "Call / Text" secondary CTA                     |
| `ghost`   | transparent                  | `text-foreground hover:text-primary` | `border-transparent`   | In-section links ("View details", "Browse all cars") |

Hover behavior:

- `primary`: `hover:bg-primary` stays red; a black `bg-foreground` layer (`scaleX` 0→1 from left, 300ms) sweeps across on `group-hover`. After sweep, text remains white.
- `dark`: `hover:bg-foreground` stays near-black; same black sweep (so it reads as a subtle press, not a color flip).
- `outline` / `ghost`: text shifts to `text-primary` (red) on hover; no sweep.

`prefers-reduced-motion`: sweep is `hidden`, transitions off, hover translate removed.

## Sizes

| Size | Min height | Horizontal padding | Font size | Use                    |
| ---- | ---------- | ------------------ | --------- | ---------------------- |
| `sm` | 36px       | `px-4` (16px)      | `text-xs` | In-card "View details" |
| `md` | 44px       | `px-5` (20px)      | `text-sm` | Header / mobile nav    |
| `lg` | 52px       | `px-7` (28px)      | `text-sm` | Hero / contact CTAs    |

All sizes: `uppercase tracking-wide font-bold`, `rounded-none`, `inline-flex items-center justify-center gap-2`, `touch-friendly` min-height.

## Behavior & accessibility

- `href` present → renders `<a>` (with `target`/`rel` when external); otherwise `<button type=button>`.
- `disabled` (e.g. no `NEXT_PUBLIC_MESSENGER_URL` / `NEXT_PUBLIC_BUSINESS_PHONE`): `disabled` attr, `aria-disabled`, `disabled:pointer-events-none disabled:opacity-50`. Never render a dead `#` link.
- Full keyboard operability; visible focus ring; reduced-motion honored globally in `globals.css` and per-component via `motion-reduce:` utilities.

## Usage

```tsx
import { Button } from '@/components/ui/button'

<Button href="/cars?status=available" variant="ghost" size="sm">Browse all cars</Button>
<Button href={messenger} variant="primary" size="lg" disabled={!messenger}>Message on Messenger</Button>
<Button onClick={fn} variant="dark" size="md">Message Us</Button>
```

## Invariants

- No gradients, glow, or large shadows on buttons.
- No `data-component`; always `data-ui="button"`.
- Never hardcode colors; use tokens (`bg-primary`, `bg-foreground`, `text-background`).
- `cn()` for all conditional classes; CVA for variants/sizes.
