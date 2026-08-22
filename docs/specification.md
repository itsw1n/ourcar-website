# Wing's Buy n Sell — Product Specification

## 1. Product Summary

Wing's Buy n Sell is a Davao City business focused on Japanese surplus mini vans.

The website is a digital showroom and trust-building site. It does **not** process transactions. Buyers browse vehicles and then contact the business through Messenger or phone.

Primary goals:

1. Show available and sold vehicles in one browse experience.
2. Make individual vehicles easy to inspect.
3. Build trust through the owner's work history, sold units, and testimonials.
4. Generate inquiries through Messenger and phone.
5. Let an authenticated admin maintain the inventory without editing code.

## 2. Business Story

Approved factual story direction:

- At age 20, the owner started as a helper working on Japanese surplus mini vans.
- He learned conversion and body work from the ground up.
- Surplus vehicles arrive requiring conversion work; the business experience includes steering conversion, body work, repair, fabrication, and tack welding.
- At age 28, he became an independent contractor.
- He continues contractor work today.
- He is currently 44 years old.
- He has more than 3 years of experience in Japanese surplus vehicle buy and sell.
- Business is based in Davao City.

Keep this section text-led. Do not require a portrait.

Do not make unsupported claims such as "serving all of Mindanao" unless the owner later confirms them.

## 3. Public Information Architecture

### `/` Home

Purpose: brand, trust, featured inventory, conversion to contact.

Recommended sections:

1. Header
2. Cinematic hero
3. Featured / available vehicles preview
4. Founder story / timeline
5. Sold units preview
6. Testimonials
7. Contact CTA
8. Footer

Hero direction:

- mostly white
- large vehicle image
- strong black typography
- restrained red accent
- headline: `Built right. Driven far.`
- supporting line about Japanese surplus mini vans and hands-on experience
- Messenger CTA
- Call/Text CTA

### `/cars`

Purpose: primary browse page.

Must contain:

- page heading
- search
- status filter: All / Available / Sold
- dynamic category filter
- responsive car card grid
- clear result count
- clear empty state
- URL-persisted/shareable state

No separate Sold page.

Example URLs:

- `/cars`
- `/cars?status=available`
- `/cars?status=sold`
- `/cars?category=mini-van`
- `/cars?search=suzuki`

Filters for v1:

- search
- status
- category

Do not add price/year/transmission filters until requested.

### `/cars/[slug]`

Purpose: inspect one vehicle.

Required content:

- back to Browse Cars
- brand + model
- status
- image gallery
- year
- transmission
- mileage
- category
- optional description/notes
- Messenger CTA
- phone CTA
- related/other vehicles section

Image experience:

- photos move horizontally
- interaction should feel more premium than a basic scrollbar
- concept: rotating/card-like horizontal transitions
- must remain accessible and usable with keyboard/touch
- reduced motion should fall back to a simpler horizontal gallery

### `/about`

Purpose: explain the business background.

Content:

- brand story
- owner timeline
- Japanese surplus conversion experience
- Davao City base
- craftsmanship/trust positioning

### `/contact`

Purpose: make contacting simple.

Content:

- Messenger CTA
- phone number
- tap-to-call behavior
- Davao City
- optional car-yard/business photo later

No map/showroom directions for now.

## 4. Vehicle Data

Initial fields:

- id
- slug
- brand
- model
- year
- transmission
- mileage_km
- category_id
- status: AVAILABLE | SOLD
- description/notes
- featured
- created_at
- updated_at

No public price required.

No fuel field in v1.

Images are separate and ordered.

## 5. Categories

Categories are dynamic.

Admin can:

- create category
- rename category
- archive category
- bind one category to a vehicle

Example mock categories:

- Mini Van
- Multi-Cab
- Van
- Truck

Do not hardcode the production category list into the UI.

## 6. Sold Vehicles

Sold is a status on the vehicle.

Rules:

- sold vehicle stays visible
- sold card clearly shows SOLD
- sold vehicle remains searchable
- sold vehicle detail page remains available unless manually archived
- sold vehicles are used as trust/social proof

## 7. Testimonials

Initial development uses mock testimonials.

Admin can later:

- add testimonial
- edit testimonial
- archive testimonial
- choose whether it is featured

Fields:

- display_name
- quote
- rating optional
- featured
- active

Never present mock testimonials as real customer statements in production.

## 8. Contact Behavior

Messenger:

- environment/config value
- may be empty during development
- if empty, UI should disable or hide the action gracefully
- later points to the official Facebook/Messenger destination

Phone:

- environment/config value
- clicking uses `tel:`
- displayed consistently from one config source

## 9. Admin

Protected routes:

- `/admin`
- `/admin/vehicles`
- `/admin/categories`
- `/admin/testimonials`

Dashboard v1:

- total vehicles
- available count
- sold count
- category count

Vehicle management:

- create
- edit
- mark Available
- mark Sold
- archive
- upload multiple images
- reorder images
- select cover image/category

No delete-first workflow. Prefer archive where historical data matters.

## 10. Out of Scope

Do not implement unless later approved:

- checkout
- payment
- reservations
- customer accounts
- financing applications
- trade-ins
- online pricing
- map/showroom visit booking
- live chat system
- mobile app
- Three.js
