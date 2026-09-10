# Nabta 🌱

**From the field to your door — fully transparent.**

Nabta connects consumers directly to real farms through a subscription model, while tracking every shipment from harvest to market to eliminate post-harvest loss in Egypt's agricultural supply chain — turning invisible waste into transparent, trackable data, and turning food into a shared experience rather than just a product.

## The Problem

- **30%+** of crops are lost between harvest and market in Egypt due to poor storage, slow transport, and lack of coordination.
- **Zero real transparency** for consumers about where their food comes from or how it was grown.
- Small farmers have **no data** on exactly where loss happens in their supply chain — everything is guesswork.

## The Solution

Nabta is a two-sided platform:

- **For Consumers:** Adopt a share of a crop or animal, follow its journey with photos and updates until it actually reaches your door.
- **For Farmers:** Log every shipment with a QR code, and know exactly where loss happens across the supply chain.

The same tracking data that helps farmers reduce loss is what powers a transparent, trust-building experience for the consumer.

## How It Works

1. **Register Batch** — Farmer logs a crop batch and gets a unique QR code.
2. **Adopt** — Consumer subscribes to a share of that batch and follows its growth.
3. **Track** — Every transport stage (harvest → cold storage → transport → market) is logged against the same QR code, recording quantity delivered safely vs. damaged.
4. **Deliver** — Consumer receives their share and sees the full, transparent journey of their product — including the actual loss percentage at each stage.

## Business Model

| Stream | Description |
|---|---|
| Consumer Subscriptions | Monthly subscription to adopt a share of a crop or animal |
| SaaS Subscription for Farmers | Monthly fee for shipment tracking and analytics tools |
| Direct Sales, No Middleman | Farmers earn more per unit, consumers pay less than market price |

## Hackathon MVP Scope

- [ ] Register one crop batch with a unique QR code
- [ ] Consumer-facing page: adopt a batch + view updates
- [ ] 3 tracking points: harvest → transport → market
- [ ] Simple dashboard showing loss percentage per stage

## Tech Stack

- **Backend:** Django, Django REST Framework, PostgreSQL
- **Frontend:** React
- **Tracking:** QR code generation & scanning

## Data Model (Draft)

- `Batch` — id, crop_type, farm_name, planted_date, expected_harvest_date, qr_code
- `Farm` — name, location, photos
- `ConsumerSubscription` — user, batch, quantity_committed
- `TrackingEvent` — batch_id, stage (harvest / cold_storage / transport / market), quantity_ok, quantity_damaged, timestamp, location

## Team

- **Farha Mohamed Ghallab** — Full-Stack Python Developer
- **Manar Elsayed Mahmoud** — Full-Stack Python Developer

---

*Submitted for SmartX Hackathon 2026 — Industry Track*
