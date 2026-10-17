# School Database Design

## 1. Explanation of Tables & Relationships
* **`students`**: Stores core information about students (e.g., student_id, name, email).
* **`courses`**: Stores information about available academic courses (e.g., course_id, course_name, code).
* **`enrolments`**: Serves as the junction/linking table connecting `students` and `courses`. It holds foreign keys (`student_id`, `course_id`) and the student's `grade`.

### Relationships
* **`students` to `enrolments`**: One-to-Many (One student can have multiple enrolments).
* **`courses` to `enrolments`**: One-to-Many (One course can have multiple enrolments).
* **`students` to `courses`**: Many-to-Many. A junction table (`enrolments`) is required because a single student can enroll in multiple courses, and a single course can contain multiple students. A standard relational database cannot directly map a Many-to-Many relationship between two tables without an intermediate table.

---

## 2. Rule to Prevent Enrolling in the Same Course Twice
Enrolling twice in the same course is prevented by establishing a **Composite Primary Key** on `(student_id, course_id)` inside the `enrolments` table. Because primary key combinations must be unique across rows, attempting to insert a second row with identical `student_id` and `course_id` values will trigger a `UNIQUE constraint failed` error in SQLite.

---

## 3. Database Indexing
* **Index Created:** `CREATE INDEX idx_enrolments_student_id ON enrolments(student_id);`
* **Reasoning:** In relational databases, foreign keys do not create index structures automatically in SQLite. Since queries frequently perform `JOIN` operations on `student_id` to search or fetch courses for a specific student, adding an index significantly speeds up lookup performance and avoids full-table scans.

---

## 4. SQL vs NoSQL Decision
For a school management system, **SQL (Relational Database)** is the optimal choice. School operations require strict data integrity (ACID compliance), strict schema validation, and complex multi-table querying (such as aggregating grades, finding unenrolled students, or filtering course lists via JOINs). Relational foreign keys prevent orphan records (e.g., enrolling a non-existent student), ensuring data remains consistent across the entire institution.
