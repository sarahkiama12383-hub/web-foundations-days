-- Enable Foreign Key constraints in SQLite
PRAGMA foreign_keys = ON;

-- --------------------------------------------------------
-- 1. CREATE TABLES
-- --------------------------------------------------------

-- Table 1: students
CREATE TABLE students (
    student_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

-- Table 2: courses
CREATE TABLE courses (
    course_id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE
);

-- Table 3: enrolments (Junction Table linking students and courses)
-- Prevents duplicate enrolments using a COMPOSITE PRIMARY KEY
CREATE TABLE enrolments (
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade TEXT,
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- 2. INSERT SAMPLE DATA
-- --------------------------------------------------------

-- Insert at least 3 students
INSERT INTO students (name, email) VALUES
('Adiba Sarah', 'adiba@example.com'),
('Brian Omondi', 'brian@example.com'),
('Catherine Mwangi', 'catherine@example.com'),
('David Kazi', 'david@example.com');

-- Insert at least 3 courses
INSERT INTO courses (course_name, code) VALUES
('Web Foundations', 'CS101'),
('Database Systems', 'CS102'),
('Data Analytics', 'DS201');

-- Insert at least 5 enrolments
INSERT INTO enrolments (student_id, course_id, grade) VALUES
(1, 1, 'A'), -- Adiba in Web Foundations
(1, 2, 'B'), -- Adiba in Database Systems
(2, 1, 'B'), -- Brian in Web Foundations
(2, 3, 'A'), -- Brian in Data Analytics
(3, 2, 'A'); -- Catherine in Database Systems
-- Note: David Kazi (student_id 4) has no enrolments.

-- --------------------------------------------------------
-- 3. FIVE REQUIRED QUERIES
-- --------------------------------------------------------

-- Query 1: All courses for one student (by name)
SELECT 
    s.name AS student_name,
    c.course_name,
    c.code,
    e.grade
FROM students s
JOIN enrolments e ON s.student_id = e.student_id
JOIN courses c ON e.course_id = c.course_id
WHERE s.name = 'Adiba Sarah';

-- Query 2: All students on one course (by course code/name)
SELECT 
    c.course_name,
    s.name AS student_name,
    s.email,
    e.grade
FROM courses c
JOIN enrolments e ON c.course_id = e.course_id
JOIN students s ON e.student_id = s.student_id
WHERE c.code = 'CS101';

-- Query 3: Number of students per course (using GROUP BY)
SELECT 
    c.course_name,
    COUNT(e.student_id) AS student_count
FROM courses c
LEFT JOIN enrolments e ON c.course_id = e.course_id
GROUP BY c.course_id, c.course_name;

-- Query 4: Students who have no enrolments (using LEFT JOIN)
SELECT 
    s.student_id,
    s.name,
    s.email
FROM students s
LEFT JOIN enrolments e ON s.student_id = e.student_id
WHERE e.student_id IS NULL;

-- Query 5: Update of one enrolment's grade
UPDATE enrolments
SET grade = 'A+'
WHERE student_id = 1 AND course_id = 2;
