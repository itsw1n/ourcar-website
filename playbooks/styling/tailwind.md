# Tailwind CSS — AI Playbook

> Goal: keep Tailwind UI consistent, inspectable, reusable, and easy for AI agents to maintain.

---

## Core Mental Model

```text
Component name      → what the UI concept is
data-ui             → what DOM landmark this is
Tailwind classes    → how it looks
cn()                → conditional classes
CVA                 → reusable variants
Design tokens       → shared visual values
```

Prefer semantic components and semantic HTML. Do not use anonymous `<div>` nesting when a clearer structure exists.

---

## Standard Page Layout

Use this as the default page-level pattern:

```tsx
<Section>
  <Container>content</Container>
</Section>
```

### Section

`Section` owns:

- full-width layout
- vertical spacing
- full-width background
- full-width border
- section-level positioning

```tsx
export function Section({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      data-ui="section"
      className={cn('relative w-full py-16', className)}
    >
      {children}
    </section>
  )
}
```

### Container

`Container` owns:

- max content width
- horizontal centering
- page gutters
- consistent horizontal padding

```tsx
export function Container({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      data-ui="container"
      className={cn('mx-auto w-full max-w-6xl px-6 md:px-12', className)}
    >
      {children}
    </div>
  )
}
```

### Example

```tsx
<Section>
  <Container>
    <Hero />
  </Container>
</Section>

<Section className="bg-muted">
  <Container>
    <Features />
  </Container>
</Section>
```

Prefer this over:

```tsx
<div>
  <div>...</div>
</div>
```

Do not create `layout.container`, `layout.section`, `styles.container`, or similar class maps just to shorten JSX.

---

## `data-ui` for Inspection

Use `data-ui` on important DOM landmarks so DevTools remains understandable.

```tsx
<section
  data-ui="billing-summary"
  className="rounded-xl border bg-card p-6"
>
```

Use semantic names:

```text
settings-panel
dashboard-header
user-menu
billing-summary
```

Avoid visual-only names:

```text
gray-box
left-div
rounded-wrapper
flex-row
```

Do not add `data-ui` to every tiny element.

---

## Static, Conditional, and Variant Classes

### Static styling

Use Tailwind directly:

```tsx
<div className="flex items-center justify-between gap-4" />
```

### Conditional styling

Always use `cn()`.

```ts
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

```tsx
<div
  className={cn(
    'rounded-lg border p-4',
    selected && 'border-primary bg-primary/5',
    disabled && 'pointer-events-none opacity-50'
  )}
/>
```

Avoid:

```tsx
<div className={`rounded-lg ${active ? 'bg-primary' : ''}`} />
```

### Reusable variants

Use CVA when a reusable component has structured variants or sizes.

```tsx
const cardVariants = cva('rounded-xl border', {
  variants: {
    variant: {
      default: 'bg-card text-card-foreground',
      muted: 'bg-muted text-muted-foreground',
    },
    spacing: {
      sm: 'p-3',
      md: 'p-5',
      lg: 'p-8',
    },
  },
})
```

Rule:

```text
static       → className
conditional  → cn()
variants     → CVA
```

Do not use CVA for trivial one-off components.

---

## Component Extraction

Extract a component when the **UI concept** repeats.

Good:

```text
Card
Sidebar
DashboardHeader
FilterBar
UserMenu
SettingsPanel
```

Avoid components based only on appearance:

```text
GrayBox
FlexRow
RoundedContainer
PaddedDiv
```

For one-off flex/grid arrangements, keep Tailwind inline:

```tsx
<div className="grid gap-6 md:grid-cols-3">
```

Do not create layout primitives for every CSS concept.

Keep primitives small:

```text
Section
Container
Stack      optional
Cluster    optional
```

---

## File Organization

Use a small, predictable structure. Do not create new folders unless they represent a real responsibility.

```text
src/
├─ app/                  → routes, pages, layouts
├─ components/
│  ├─ ui/                → shadcn primitives
│  ├─ layout/            → Section, Container, layout primitives
│  ├─ shared/            → reusable app-wide components
│  └─ features/          → feature/domain-specific UI
├─ lib/
│  └─ utils.ts           → cn() and generic helpers
├─ styles/
│  └─ globals.css        → theme tokens, base styles, global CSS
└─ ...
```

### Folder responsibilities

```text
components/ui/
→ low-level reusable UI primitives
→ shadcn-generated components
→ no feature-specific business logic

components/layout/
→ Section
→ Container
→ small shared layout primitives only

components/shared/
→ reusable components with app-level meaning
→ used across multiple features/pages

components/features/
→ feature/domain-specific components
→ keep feature-only UI close to its domain

lib/
→ framework-independent helpers and utilities
→ cn() lives here

styles/globals.css
→ CSS variables
→ theme tokens
→ base/reset styles
→ global-only CSS
```

### Page-specific components

If a component is used by only one route/page, keep it close to that route when the framework structure allows it.

Example:

```text
app/
└─ dashboard/
   ├─ page.tsx
   └─ _components/
      ├─ dashboard-header.tsx
      └─ revenue-chart.tsx
```

Do not move a one-page component into `components/shared/` just because it is a component.

Promote it only when reuse becomes real.

### Feature organization

For larger features, grouping by feature is preferred over grouping every file by technical type.

Example:

```text
components/
└─ features/
   └─ billing/
      ├─ billing-summary.tsx
      ├─ payment-method-card.tsx
      └─ invoice-list.tsx
```

Avoid overly deep structures such as:

```text
components/
└─ features/
   └─ billing/
      └─ components/
         └─ cards/
            └─ payment/
               └─ ...
```

Keep paths shallow unless the feature genuinely requires more hierarchy.

### CVA placement

If variants belong to one component, keep the CVA definition in the same file.

```tsx
// button.tsx
const buttonVariants = cva(...)
```

If the variants are intentionally shared by multiple components, extract them to a nearby file.

```text
button.tsx
button-variants.ts
```

Do not create a global `variants/` folder for one-off CVA definitions.

### Naming conventions

Use:

```text
files              → kebab-case
React components   → PascalCase
data-ui values     → kebab-case
utilities          → camelCase
```

Example:

```text
settings-panel.tsx
SettingsPanel
data-ui="settings-panel"
cn()
```

Name files and components after their UI/domain meaning, not appearance.

Prefer:

```text
billing-summary.tsx
user-menu.tsx
dashboard-header.tsx
```

Avoid:

```text
gray-box.tsx
left-wrapper.tsx
big-card.tsx
```

### Import boundaries

Prefer dependency flow like this:

```text
app/pages
  ↓
features
  ↓
shared
  ↓
layout / ui
  ↓
lib
```

Guidelines:

- `ui/` must not import feature components
- `layout/` must not depend on feature logic
- `shared/` should not depend on one specific feature unless it truly belongs there
- feature components may compose `shared`, `layout`, and `ui`
- pages may compose everything needed for the route
- generic helpers in `lib/` should not import UI components

Avoid circular dependencies between component layers.

### Do not create folders preemptively

Do not create:

```text
hooks/
utils/
types/
constants/
variants/
helpers/
```

just because they are common folder names.

Create a folder only when there are enough files with a shared responsibility to justify it.

For a single helper, keep it near the component or feature that owns it.

### AI rule

When deciding where a component belongs:

```text
shadcn/primitive?
→ components/ui

page layout primitive?
→ components/layout

used across unrelated features?
→ components/shared

belongs to one feature/domain?
→ components/features/<feature>

used by one route only?
→ colocate with that route/page
```

Prefer the narrowest correct ownership first. Promote upward only when reuse appears.

---

## shadcn/ui

Use shadcn primitives from:

```text
components/ui/
```

Business-specific wrappers can live in:

```text
components/shared/
components/features/
```

Example:

```tsx
import { Button } from '@/components/ui/button'

export function SubmitButton({ isLoading, children }: SubmitButtonProps) {
  return (
    <Button data-ui="submit-button" type="submit" disabled={isLoading}>
      {isLoading ? <Spinner /> : children}
    </Button>
  )
}
```

Prefer wrappers for business logic instead of pushing feature-specific logic into reusable primitives.

---

## Semantic Design Tokens

Use semantic colors:

```tsx
<div className="bg-background text-foreground" />
<div className="bg-card text-card-foreground" />
<div className="bg-muted text-muted-foreground" />
<button className="bg-primary text-primary-foreground" />
```

Avoid hardcoded brand colors:

```tsx
<div className="bg-blue-600 text-white" />
<div className="bg-[#1a1a2e]" />
```

Use existing project tokens instead.

---

## Dark Mode

Use CSS variable tokens for light and dark themes.

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
  }
}
```

---

## Responsive Design

Use mobile-first Tailwind.

```tsx
<div className="flex flex-col sm:flex-row md:gap-8 lg:max-w-7xl" />
```

Prefer:

```tsx
<div className="flex flex-col md:flex-row" />
```

over desktop-first overrides.

---

## Animation

Prefer Tailwind transition utilities.

```tsx
<button className="transition-colors duration-200 hover:bg-primary/90" />
```

Avoid repeated arbitrary timing values:

```tsx
<div className="duration-[347ms]" />
```

If a custom value repeats, promote it to a project token/config value.

---

## Inline Styles

Tailwind should handle normal static styling.

Use inline styles only for genuinely runtime-computed values.

Acceptable:

```tsx
<div style={{ width: `${progress}%` }} />
```

Avoid:

```tsx
<div
  style={{
    width: '100%',
    borderRadius: '12px',
    padding: '24px',
  }}
/>
```

when Tailwind utilities can express it.

---

## HTML Semantics and Accessibility

Choose the correct HTML element first:

```text
nav
header
main
section
aside
footer
button
form
label
```

Do not replace semantic HTML with generic divs.

Preserve:

- keyboard focus
- visible focus states
- labels
- heading hierarchy
- disabled behavior
- required `aria-*` attributes

Example:

```tsx
<button className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
  Save
</button>
```

---

## Avoid `@apply` by Default

Do not hide normal Tailwind strings behind custom CSS classes.

Avoid:

```css
.dashboard-card {
  @apply rounded-xl border bg-card p-6 shadow-sm;
}
```

Prefer:

```tsx
<Card />
```

or direct Tailwind:

```tsx
<section data-ui="card" className="rounded-xl border bg-card p-6 shadow-sm" />
```

Use `@apply` only when there is a real reason.

---

## Avoid Arbitrary Values by Default

Prefer design-system values:

```tsx
<div className="p-4 rounded-lg" />
```

Avoid:

```tsx
<div className="p-[17px] rounded-[11px]" />
```

unless the one-off value is genuinely required.

Repeated arbitrary values should become tokens.

---

## DevTools Standard

Preferred DOM:

```html
<section
  data-ui="billing-summary"
  class="rounded-xl border bg-card p-6"
></section>
```

Debugging model:

```text
data-ui        → identify the DOM landmark
class          → inspect visual styling
React DevTools → identify the owning component
```

Tailwind utilities should remain visible in `class`.

---

## AI Decision Tree

```text
Page-level section?
→ Section > Container > content

Important inspectable landmark?
→ add data-ui

Static styling?
→ className

Conditional styling?
→ cn()

Reusable variants?
→ CVA

Repeated UI concept?
→ semantic component

One-off flex/grid?
→ direct Tailwind

Repeated design value?
→ token

Existing shadcn primitive?
→ reuse it

Business logic on a primitive?
→ wrapper component

Runtime-computed CSS value?
→ inline style may be appropriate
```

---

## AI Must Avoid

```text
❌ anonymous div soup
❌ layout/style class maps just to shorten JSX
❌ inline styles for static styling
❌ raw brand colors
❌ arbitrary values everywhere
❌ template-string class composition
❌ unnecessary @apply
❌ visual-only component names
❌ unnecessary CVA
❌ Box/Flex/Wrapper abstraction soup
❌ unnecessary DOM wrappers
❌ rebuilding existing shadcn primitives
```

---

## AI Must Prefer

```text
✅ Section > Container > content
✅ semantic React components
✅ semantic HTML
✅ data-ui for meaningful landmarks
✅ direct Tailwind for static styling
✅ cn() for conditions
✅ CVA for reusable variants
✅ semantic design tokens
✅ mobile-first responsive styling
✅ existing shadcn primitives
✅ minimal DOM nesting
✅ accessible states
```

---

## Final Rule

Optimize for:

```text
1. readable source code
2. inspectable DOM
3. consistent design system
```

Use components and `data-ui` for semantic identity.

Use Tailwind utilities for visual implementation.
