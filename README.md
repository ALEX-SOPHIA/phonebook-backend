# Phonebook App (Fullstackopen Part 3)
This project is the backend repository for the Phonebook application from the Full Stack Open course (Part 3). It serves the frontend build and handles the API requests.
## 🚀 Live Demo
**Click here to view the app:** 👉 **[https://phonebook-backend-w9ko.onrender.com](https://phonebook-backend-w9ko.onrender.com)**

## 🛠️ Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Deployment:** Render
* **Frontend:** React (served as static files)

## ⚙️ Local Installation
To run this project locally:

1.  Clone the repository
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
4.  The server runs on `http://localhost:3002`

## 📡 API Endpoints
* `GET /api/persons` - Fetch all people
* `GET /api/persons/:id` - Fetch a single person
* `DELETE /api/persons/:id` - Delete a person
* `POST /api/persons` - Add a new person
* `GET /info` - Server status and stats