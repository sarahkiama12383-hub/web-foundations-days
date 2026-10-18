# SnapShare: Scaling Plan

## 1. Our Starting Assumptions
To understand how SnapShare will handle heavy growth, we base our design on the core assignment facts:
* There are 10,000,000 registered users in total.
* 10% of those registered users are active every single day (1,000,000 Daily Active Users).
* Each active user uploads 1 photo per day.
* Each active user views 50 feed pages per day.
* An average original photo file size is 2 MB.
* Each photo also generates a 50 KB thumbnail.

---

## 2. Traffic and Storage Calculations

### A. Daily Active Users (DAU)
* $10,000,000 \times 0.10 = 1,000,000$ active users daily.

### B. Uploads Per Second
* **Total Daily Uploads:** $1,000,000$ uploads/day.
* **Average Uploads / Sec:** $\frac{1,000,000}{86,400} \approx 11.57$ uploads/sec.
* **Peak Uploads / Sec ($5\times$ multiplier):** $11.57 \times 5 \approx 58$ uploads/sec.

### C. Feed Views Per Second
* **Total Daily Feed Views:** $1,000,000 \times 50 = 50,000,000$ views/day.
* **Average Views / Sec:** $\frac{50,000,000}{86,400} \approx 578.7$ views/sec.
* **Peak Views / Sec ($5\times$ multiplier):** $578.7 \times 5 \approx 2,894$ views/sec.

### D. Annual Storage Required
* **Size per Post:** $2 \text{ MB (original)} + 0.05 \text{ MB (thumbnail)} = 2.05 \text{ MB}$.
* **Daily Storage:** $1,000,000 \times 2.05 \text{ MB} = 2,050,000 \text{ MB} \approx 2.05 \text{ TB/day}$.
* **Annual Storage:** $2.05 \text{ TB/day} \times 365 \text{ days} \approx 748.25 \text{ TB/year}$.

---

## 3. Read-Heavy vs. Write-Heavy System
SnapShare is a **read-heavy system**. With nearly 579 people reading feeds every second compared to only about 12 people uploading photos every second, users spend most of their time consuming content. This means our design relies heavily on caching and CDNs.

---

## 4. Why Photos Don't Belong in the Database
Storing raw binary image files directly inside a database causes severe performance bottlenecks, database bloat, and slow backups. Instead, photos are stored in dedicated Object Storage (like Amazon S3), while the database only keeps lightweight text metadata.

---

## 5. Architecture Diagram
[ Client App ]
|
v
[ CDN (Cloudflare) ]
|
v
[ Load Balancer ]
|
+-----------------------+
|                       |
v                       v
[ App Servers ] <---> [ Cache (Redis) ]
|         |
|         +------------------------+
v                                  v
[ Primary DB ]                     [ Message Queue ]
|                                  |
v                                  v
[ Read Replicas ]                  [ Worker Servers ]
|
v
[ Object Storage (S3) ]
---

## 6. Component Explanations
* **CDN:** Caches images globally closer to users to reduce latency and server bandwidth[span_8](start_span)[span_8](end_span).
* **Load Balancer:** Distributes incoming traffic evenly across app servers to prevent server overload[span_9](start_span)[span_9](end_span).
* **App Servers:** Processes user requests and core business logic[span_10](start_span)[span_10](end_span).
* **Cache (Redis):** Stores hot data in memory for lightning-fast lookups[span_11](start_span)[span_11](end_span).
* **Primary Database:** Handles database writes and structured metadata[span_12](start_span)[span_12](end_span).
* **Read Replicas:** Database clones that handle read queries to take load off the main database[span_13](start_span)[span_13](end_span).
* **Message Queue:** Holds background tasks asynchronously so the app doesn't freeze[span_14](start_span)[span_14](end_span).
* **Worker Servers:** Processes background jobs like generating thumbnails[span_15](start_span)[span_15](end_span).
* **Object Storage:** Securely holds raw photo files and thumbnails[span_16](start_span)[span_16](end_span).

---

## 7. Step-by-Step Upload Flow
1. The user selects a photo on their mobile app and taps upload[span_17](start_span)[span_17](end_span).
2. The request hits the Load Balancer and is routed to an App Server[span_18](start_span)[span_18](end_span).
3. The App Server requests a secure pre-signed upload URL from Object Storage[span_19](start_span)[span_19](end_span).
4. The client uploads the 2 MB photo directly to Object Storage, bypassing app server memory[span_20](start_span)[span_20](end_span).
5. The client notifies the App Server, which saves the post metadata in the Primary Database and pushes a job to the Message Queue[span_21](start_span)[span_21](end_span).
6. A background Worker Server picks up the job, creates the 50 KB thumbnail, uploads it to Object Storage, and updates the database record[span_22](start_span)[span_22](end_span).

---

## 8. System Trade-Offs
1. **Eventual Consistency:** Using CDNs and read replicas means friends might experience a 1–2 second delay before seeing a newly posted photo, traded for blazing-fast feed loading speeds[span_23](start_span)[span_23](end_span).
2. **Asynchronous Thumbnails:** Generating thumbnails in the background keeps uploads fast, but means thumbnails appear with a brief loading placeholder while workers finish processing[span_24](start_span)[span_24](end_span).