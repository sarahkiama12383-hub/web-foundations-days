# TicketHub: Event Ticketing System Design

## 1. Requirements

### Functional Requirements
* **Browse Events:** Users can search and view upcoming concerts and event listings.
* **View Seats:** Users can view real-time seating maps and available seat inventory for an event.
* **Hold Seats:** Users can temporarily lock/hold specific seats while proceeding to checkout.
* **Pay & Checkout:** Users can complete payment processing to officially purchase held tickets.
* **View Tickets:** Users can view their purchased ticket history and QR codes.

### Non-Functional Requirements
* **Correctness & Fairness:** Zero double-bookings allowed; first-come, first-served fairness during flash sales.
* **Speed & Low Latency:** Seat selection and lock requests must process in under 500ms.
* **High Availability & Scalability:** The system must withstand massive traffic spikes when popular concert tickets go on sale.

---

## 2. Traffic Estimates & Calculations

### Given Starting Facts
* **Registered Users:** 2,000,000 (2 Million)[span_9](start_span)[span_9](end_span).
* **Normal Day Traffic:** 50,000 visitors, each viewing 10 pages $\rightarrow$ 500,000 page views/day[span_10](start_span)[span_10](end_span).
* **Normal Day Sales:** 5,000 tickets sold per day[span_11](start_span)[span_11](end_span).
* **Big Sale Peak Traffic:** 200,000 people trying to buy 20,000 seats within the first 10 minutes[span_12](start_span)[span_12](end_span).

### Calculations
* **Normal Traffic Throughput:**
  * Daily visits: 50,000 users[span_13](start_span)[span_13](end_span).
  * Average RPS (Requests Per Second): $\frac{500,000 \text{ views}}{86,400 \text{ seconds}} \approx 5.78 \text{ requests/sec}$.
* **Flash Sale Peak Traffic ("The Big Sale"):**
  * 200,000 active users rushing for 20,000 seats in 10 minutes (600 seconds)[span_14](start_span)[span_14](end_span).
  * Peak Checkout RPS: $\frac{200,000 \text{ users}}{600 \text{ seconds}} \approx 333.33 \text{ requests/sec}$ concentrated solely on checkout and seat reservation endpoints.

---

## 3. API Design (Endpoints)

| Method | Endpoint | Description | Success Status |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/events` | Retrieves list of all concerts/events | `200 OK` |
| `GET` | `/api/v1/events/:id/seats` | Retrieves seat map and status (available/booked) | `200 OK` |
| `POST` | `/api/v1/events/:id/hold` | Temporarily locks selected seats for a user (e.g., 10 mins) | `200 OK` / `201 Created` |
| `POST` | `/api/v1/orders` | Processes payment and finalizes ticket purchase | `201 Created` |
| `GET` | `/api/v1/users/:id/tickets` | Retrieves purchased tickets for a user | `200 OK` |

---

## 4. Data Model (Tables & Relationships)

### Tables
1. **`users`**: Stores user account info (`user_id`, `name`, `email`).
2. **`events`**: Stores concert/event details (`event_id`, `title`, `date`, `venue`).
3. **`seats`**: Stores specific physical seats tied to events (`seat_id`, `event_id`, `seat_number`, `status` [available, held, booked]).
4. **`orders`**: Stores checkout transaction details (`order_id`, `user_id`, `total_amount`, `payment_status`, `created_at`).

### Relationships
* **`users` to `orders`**: One-to-Many (One user can place multiple orders).
* **`events` to `seats`**: One-to-Many (One event contains many seats).
* **`seats` to `orders`**: Managed via an order items relation or direct foreign key on seats to prevent double-booking.

---

## 5. Preventing Double-Booking (Concurrency Control)
To ensure two people can never buy the same seat during a high-demand flash sale, TicketHub uses a **Distributed Redis Lock + Database Transaction with Row-Level Locking** strategy:
1. When a user taps "Hold Seat," the request hits a Redis cache layer. Redis executes an atomic `SETNX` (Set if Not Exists) command for that specific `seat_id` with a 10-minute expiration timeout.
2. If Redis returns success, the seat is temporarily locked exclusively for that user. If another user tries a millisecond later, Redis rejects the lock instantly.
3. Once payment completes in the database transaction, the seat status is permanently updated to `booked` in the relational database, and the Redis lock is cleared.

---

## 6. Architecture Diagram & Component Explanation
# Course Reflection

Reflecting on this software engineering and system design journey, the most difficult concept for me to grasp initially was managing database concurrency and race conditions—specifically understanding how asynchronous API requests and multiple users hitting a server simultaneously can cause data collisions like double-booking. I overcame this challenge by breaking down backend workflows into smaller pieces, studying how atomic operations and Redis locks work, and practicing relational database design step-by-step through our labs.

Based on feedback received during project reviews, I plan to improve my focus on writing cleaner code modularity, anticipating edge cases in API error handling, and detailing system diagrams completely. Moving forward, my next steps in learning are to dive deeper into backend framework development with Node.js and explore cloud deployment workflows to take my mobile-built applications into full production environments. This course has built a strong foundation in thinking like a professional software engineer.
