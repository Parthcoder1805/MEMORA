# MEMORA — A Personal Memory Collection Website

MEMORA is a personal memory collection platform designed to preserve travel experiences, photographs, and favourite music in one place.

The goal is to create a digital space where users can organise their memories into personal collections and revisit meaningful moments.

## Features

- User Registration and Login
- Personal User Dashboard
- Create and Manage Travel Collections
- Upload, View and Delete Trip Photos
- Personalised Memory Collections
- Music Collection Interface

*Some features are currently under development.*

## Tech Stack

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
- Git and GitHub
- VS Code
- Maven

## Project Structure

```text
MEMORA/
├── frontend/
│   ├── Images/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── .gitignore
│
├── backend/
│   └── memora/
│       ├── src/
│       ├── pom.xml
│       ├── mvnw
│       └── mvnw.cmd
│
└── README.md
```

## Running Locally

### 1. Clone the Repository

```bash
git clone https://github.com/Parthcoder1805/MEMORA.git
cd MEMORA
```

### 2. Configure PostgreSQL

Create a PostgreSQL database named:

```sql
CREATE DATABASE memora_db;
```

### 3. Configure Backend

Open:

`backend/memora/src/main/resources/application.properties`

Set your database credentials using environment variables:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/memora_db
spring.datasource.username=postgres
spring.datasource.password=${DB_PASSWORD}
server.port=8081
```

Set the password in PowerShell:

```powershell
$env:DB_PASSWORD="YOUR_POSTGRES_PASSWORD"
```

### 4. Start Spring Boot

```powershell
cd backend/memora
.\mvnw.cmd spring-boot:run
```

### 5. Run Frontend

Open the frontend folder in VS Code and launch `index.html` using Live Server.

## Development Status

MEMORA is an ongoing personal project. New features, UI improvements, and enhancements are being added progressively.

## Author

**Parth Awasthi**

GitHub: [Parthcoder1805](https://github.com/Parthcoder1805)

---

*Preserving moments, one memory at a time.*