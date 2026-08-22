# Wing's Buy n Sell — Design System

## 1. Visual Direction

Approved direction:

- white-first
- editorial
- automotive
- premium but local and approachable
- strong typography
- large vehicle photography
- restrained red accent
- thin borders
- deliberate whitespace
- minimal shadows

Avoid an "AI-generated template" look.

Do not use:

- purple/blue gradients
- random neon glows
- glassmorphism everywhere
- oversized 24px+ rounding on every container
- decorative floating blobs
- every section inside a card
- unnecessary dark sections
- animation on every element

## 2. Brand

Name:

`Wing's Buy n Sell`

Logo direction:

- custom letter `W`
- geometric
- compact
- automotive feel
- works in black/white with a small red detail
- suitable for website, Facebook avatar, sticker, shirt, and signage

The current homepage includes a simple code-based W mark as a placeholder/reference. It is not a final trademark/logo asset.

## 3. Color System

Use semantic CSS variables.

Current starting tokens:

- Background: white
- Foreground: near-black
- Primary: deep automotive red
- Primary foreground: white
- Muted background: very light neutral gray
- Muted foreground: medium gray
- Border: light gray

Red should normally be used for:

- CTA
- tiny labels
- active/filter states
- timeline points
- selected status accents
- small logo detail

Do not fill large areas red unless there is a deliberate reason.

## 4. Typography

Direction:

- bold condensed/editorial feeling for headings
- clean sans-serif body copy
- uppercase can be used for short headings, labels, nav items, and vehicle titles
- avoid excessive letter spacing in paragraph text

Typography hierarchy should feel confident rather than futuristic.

## 5. Layout

- mobile-first
- max content width around 80rem / `max-w-7xl`
- generous desktop whitespace
- vehicle imagery allowed to dominate
- sections separated by spacing and thin borders rather than card backgrounds
- use asymmetry when it improves composition

## 6. Components

Reusable components should follow:

```tsx
data-component="vehicle-card"
className={cn("default utilities", className)}
```

Use semantic names:

- `site-header`
- `brand-logo`
- `hero-section`
- `vehicle-card`
- `status-filter`
- `category-select`
- `vehicle-gallery`
- `testimonial-card`

Avoid generic names like `box-1`.

## 7. Vehicle Cards

Expected content:

- image
- Available/Sold status
- brand + model
- year
- transmission
- mileage
- View Details action

No price.

Cards should not feel like e-commerce checkout cards.

## 8. Motion

Primary libraries:

- GSAP + ScrollTrigger
- Lenis

Motion vocabulary:

- reveal
- parallax
- subtle image scale
- pinned storytelling where justified
- horizontal/gallery movement
- restrained text entrance
- image masking/reveal

Motion should feel mechanical/smooth rather than bouncy.

Avoid:

- springy motion on everything
- aggressive cursor effects
- constant floating
- unnecessary particle systems

## 9. Reduced Motion

Respect `prefers-reduced-motion`.

If reduced motion is enabled:

- disable Lenis smoothing
- avoid scrubbed parallax
- avoid large transforms
- keep content immediately readable
- use simple opacity/none where appropriate

## 10. Responsiveness

Mobile:

- content first
- no interaction should require hover
- gallery supports touch
- header remains usable
- CTAs large enough for touch

Desktop:

- cinematic hero
- larger type
- more whitespace
- stronger horizontal compositions

## 11. Accessibility

- visible focus states
- sufficient text contrast
- status represented by text, not just color
- meaningful alt text
- accessible dialogs/menus/selects through React Aria when applicable
- keyboard-operable galleries and filtering controls
