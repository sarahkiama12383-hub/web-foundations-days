# Scaling Plan for "SnapShare"

## 1. Assumptions & Calculations

### Given Facts
* **Registered Users:** 10,000,000 (10 Million)
* **Daily Active Users (DAU):** 10% of registered users = 1,000,000 (1 Million DAU)
* **Photo Uploads per Active User:** 1 photo/day
* **Feed Page Views per Active User:** 50 feed views/day
* **Average Original Photo Size:** 2 MB
* **Average Thumbnail Photo Size:** 50 KB (0.05 MB)

---

### Estimations & Calculations

#### A. Daily Active Users (DAU)
* **Calculation:** $10,000,000 \times 0.10 = 1,000,000$ users/day.

#### B. Uploads Per Second
* **Total Daily Uploads:** $1,000,000 \text{ users} \times 1 \text{ photo/day} = 1,000,000 \text{ uploads/day}$.
* **Average Uploads Per Second:**
  $$\frac{1,000,000 \text{ uploads}}{86,400 \text{ seconds/day}} \approx 11.57 \text{ uploads/second}$$
* **Peak Uploads Per Second ($5\times$ multiplier):**
  $$11.57 \times 5 \approx 57.87 \text{ peak uploads/second}$$

#### C. Feed Views Per Second
* **Total Daily Feed Views:** $1,000,000 \text{ users} \times 50 \text{ views/day} = 50,000,000 \text{ views/day}$.
* **Average Feed Views Per Second:**
  $$\frac{50,000,000 \text{ views}}{86,400 \text{ seconds/day}} \approx 578.70 \text{ views/second}$$
* **Peak Feed Views Per Second ($5\times$ multiplier):**
  $$578.70 \times 5 \approx 2,893.52 \text{ peak views/second}$$

#### D. Photo Storage Per Year
* **Storage Per Photo:** $2 \text{ MB (original)} + 0.05 \text{ MB (thumbnail)} = 2.05 \text{ MB}$.
* **Daily Storage Added:**
  $$1,000,000 \text{ uploads/day} \times 2.05 \text{ MB} = 2,050,000 \text{ MB/day} = 2.05 \text{ TB/day}$$
* **Annual Storage Required:**
  $$2.05 \text{ TB/day} \times 365 \text{ days} = 748.25 \text{ TB/year}$$

---

## 2. Read-Heavy vs. Write-Heavy System

SnapShare is a **read-heavy system**.

* **Comparison:** Average read requests ($578.7 \text{ feed views/sec}$) are roughly **50 times higher** than write requests ($11.57 \text{ uploads/sec}$).
* **Impact on System Design:**
  * The architecture must prioritize aggressive caching (using Redis or Memcached) and a Content Delivery Network (CDN) to serve photos and feed content rapidly without touching the primary database.
  * Database read replicas must be configured to offload query traffic from the main database instance.

---

## 3. Storage Strategy: Why Not Store Photos in the Database?

Photos (binary blob files) should **never** be stored directly inside relational or document databases because:
1. **Database Bloat & Slow Backups:** Large binary files drastically inflate database size, making indexes inefficient, queries slow, and database backups/restores extremely expensive.
2. **High I/O Load:** Databases are optimized for structured tabular metadata queries, not streaming raw media chunks.

### Where Photos Go Instead
Photos belong in **Object Storage** (such as Amazon S3, Google Cloud Storage, or MinIO). The database only stores light text metadata (such as `photo_id`, `user_id`, `s3_url`, `created_at`).

---

## 4. Architecture Diagram

