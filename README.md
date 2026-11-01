# MEMORA 🌿
### Preserving moments, one memory at a time.

MEMORA is a personal memory collection website designed to keep travel experiences, photographs, and favourite music together in one place.

It aims to provide a digital space where users can organise their memories into personal collections and revisit meaningful moments.

## ✨ Features

- User Registration and Login
- Personal User Dashboard
- Create and Manage Travel Collections
- Upload, View and Delete Trip Photos
- Personalised User Accounts
- Music Collection Interface *(under development)*

## 🛠️ Tech Stack

**Frontend**
- HTML
- CSS
- JavaScript

**Backend**
- Java
- Spring Boot
- Spring Data JPA

**Database**
- PostgreSQL

**Tools**
- Git
- GitHub
- Maven
- VS Code

## 📁 Project Structure

```text
MEMORA/
├── frontend/
│   ├── Images/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── backend/
│   └── memora/
│       ├── src/
│       ├── pom.xml
│       └── mvnw
│
└── README.md
```

## 🚀 Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/Parthcoder1805/MEMORA.git
cd MEMORA
```

### 2. Create PostgreSQL database

```sql
CREATE DATABASE memora_db;
```

### 3. Configure database credentials

Set your PostgreSQL password as an environment variable.

PowerShell:

```powershell
$env:DB_PASSWORD="YOUR_POSTGRES_PASSWORD"
```

### 4. Run the backend

```powershell
cd backend/memora
.\mvnw.cmd spring-boot:run
```

Backend runs on port `8081`.

### 5. Run the frontend

Open the `frontend` folder in VS Code and launch `index.html` using Live Server.

## 📌 Development Status

MEMORA is currently under development. New features, UI improvements, and enhancements are being added progressively.

## 👨‍💻 Author

**Parth Awasthi**

GitHub: [Parthcoder1805](https://github.com/Parthcoder1805)

---

*Some moments fade. The beautiful ones stay forever.*
