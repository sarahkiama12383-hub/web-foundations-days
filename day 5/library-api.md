# Library REST API Design

This document outlines the REST API design for managing a library's `books` resource.

---

## Endpoints

### 1. List All Books
* **Method:** `GET`
* **Path:** `/books`
* **Description:** Retrieves a list of all books available in the library catalog.
* **Success Status Code:** `200 OK`

---

### 2. Get One Book
* **Method:** `GET`
* **Path:** `/books/:id`
* **Description:** Retrieves detailed information for a specific book by its unique ID.
* **Success Status Code:** `200 OK`

---

### 3. Create a Book
* **Method:** `POST`
* **Path:** `/books`
* **Description:** Adds a new book to the library catalog.
* **Request Body Example:**
  ```json
  {
    "title": "To Kill a Mockingbird",
    "author": "Harper Lee",
    "isbn": "9780061120084",
    "publishedYear": 1960
  }
