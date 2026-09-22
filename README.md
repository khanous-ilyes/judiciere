# ⚖️ Judicière - Multi-Tenant SaaS for Legal Professionals

![License](https://img.shields.io/badge/license-Proprietary-blue.svg)
![.NET Version](https://img.shields.io/badge/.NET-9.0-purple)
![React Version](https://img.shields.io/badge/React-18-blue)

**Judicière** is a comprehensive, multi-tenant Software as a Service (SaaS) platform tailored specifically for the legal sector in Algeria. It provides unified yet strictly isolated workspaces for Lawyers (Avocats), Notaries (Notaires), Bailiffs (Huissiers de Justice), and Public Writers (Écrivains Publics).

The platform strictly adheres to Algerian legal requirements, including immutable audit trails, unbreakable sequential numbering for notarial acts (Répertoire numérique inviolable), and standardized fee schedules (Barèmes légaux).

---

## 🌟 Key Features

*   🏢 **True Multi-Tenancy**: Data isolation per cabinet/office using Global Query Filters in EF Core.
*   🧩 **Modular Architecture**: Feature flags allow enabling specific modules (`Avocat`, `Notaire`, `Huissier`, `EcrivainPublic`) per tenant, allowing multi-disciplinary offices to combine functionalities.
*   🔐 **Role-Based Access Control (RBAC)**: Fine-grained permissions using JWT Claims for SuperAdmins, Cabinet Admins, and Collaborators.
*   📅 **Judicial Agenda**: Advanced tracking of hearings (Audiences), deadlines, and client meetings.
*   📂 **Electronic Document Management (GED)**: Secure storage and organization of conclusions, minutes, and legal acts.
*   🛡️ **Immutable Audit Trails**: A secure logging system tracking every significant action, compliant with strict legal standards.
*   🌍 **Multilingual & RTL Support**: Full support for Arabic (Right-to-Left), French, and English interfaces.

## 🏗️ System Architecture

The solution follows a clean, decoupled architecture separated into 5 distinct projects:

```text
Judicière.sln
│
├── 1. BaseLibrary       (Class Library) - Domain Models, DTOs, Enums, and Interfaces.
├── 2. ServerLibrary     (Class Library) - Business Logic, EF Core DbContext, Repositories, Seeders.
├── 3. Server            (ASP.NET Core Web API) - Controllers, Middlewares, Dependency Injection, JWT Auth.
├── 4. ClientLibrary     (Class Library / Frontend Contracts) - Shared models and API client helpers.
└── 5. Client            (Vite + React + TS) - The frontend application (UI/UX).
```

### Tech Stack
*   **Backend**: C#, .NET 9, ASP.NET Core Web API
*   **Database**: SQLite (Development) / Entity Framework Core
*   **Frontend**: React 18, TypeScript, Vite, Zustand (State Management)
*   **Styling**: Custom CSS Design System (Glassmorphism, Dark/Light modes)

## 🚀 Getting Started

### Prerequisites
*   [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
*   [Node.js](https://nodejs.org/) (v18 or higher)
*   [Git](https://git-scm.com/)

### 1. Setup the Backend
Navigate to the root directory and run the .NET server. The database will automatically be created and seeded with a SuperAdmin account and demo data.

```bash
cd src/Server
dotnet run
```
*The API will be available at `http://localhost:5053`*

### 2. Setup the Frontend
Open a new terminal window, navigate to the client application, install dependencies, and start the development server.

```bash
cd src/client
npm install
npm run dev
```
*The frontend will be available at `http://localhost:5173`*

### 3. Demo Accounts
You can log in using the following seeded accounts (ensure the backend is running):
*   **Super Admin**: `superadmin@judiciere.dz` / `SuperAdmin123!`

## 🔒 Security & Compliance
*   **Data Isolation**: Every database query implicitly filters by the authenticated user's `TenantId` via EF Core Global Query Filters.
*   **SHA-256 Hashing**: Notarial acts and Bailiff PVs are digitally hashed upon validation to ensure data integrity and non-repudiation.
*   **Passwords**: Encrypted using BCrypt.

## 📝 License
This project is proprietary software. All rights reserved.
