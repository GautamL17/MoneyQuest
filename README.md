# 💰 Money Quest

Money Quest is a **modern personal finance dashboard** that helps users plan, track, and optimize their budgets, spending, and savings goals. Built with **React, Tailwind CSS, DaisyUI**, and a **custom backend**, it provides a sleek, responsive, and interactive experience for managing finances.

---

## 🚀 Features

- **Budget Management**
  - Create and track multiple budgets (weekly, monthly, yearly)
  - Assign categories to budgets
  - Monitor total income, expenditure, and remaining balance

- **Transaction Tracking**
  - Add, edit, and remove transactions
  - Validate transaction categories against budget categories
  - Real-time updates for budgets and spending

- **Goals & Progress**
  - Set personal savings goals
  - Track goal progress with animated progress bars
  - Visualize percentage completion for each goal

- **Responsive & Modern UI**
  - Fully responsive layout for mobile, tablet, and desktop
  - Dark modern aesthetic with Tailwind CSS and DaisyUI
  - Interactive components with hover effects and transitions

- **Data Persistence**
  - Backend powered by custom API (RESTful endpoints)
  - Supports CRUD operations for budgets, transactions, and goals
  - Toast notifications for success and error messages

---

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS, DaisyUI
- **State Management:** Zustand (custom store for budgets and transactions)
- **Backend:** Node.js / Express (or your choice of API)
- **Notifications:** react-hot-toast
- **Icons:** Heroicons / DaisyUI Icons
- **Version Control:** Git & GitHub

---

## 🔗 API Endpoints

### Backend Base URL
http://localhost:8000/api


### Budgets
| Method | Endpoint                 | Description                         |
|--------|-------------------------|-------------------------------------|
| GET    | `/budgets`              | Fetch all budgets                   |
| GET    | `/budgets/:id`          | Fetch a single budget by ID         |
| POST   | `/budgets`              | Create a new budget                 |
| PATCH  | `/budgets/:id`          | Update an existing budget           |
| DELETE | `/budgets/:id`          | Delete a budget                     |

### Transactions
| Method | Endpoint                     | Description                            |
|--------|------------------------------|----------------------------------------|
| POST   | `/budgets/:id/transactions`  | Add a new transaction to a budget      |
| PATCH  | `/budgets/:id/transactions/:tid` | Update a transaction                 |
| DELETE | `/budgets/:id/transactions/:tid` | Delete a transaction                 |

### Goals
| Method | Endpoint      | Description                  |
|--------|---------------|------------------------------|
| GET    | `/goals`      | Fetch all goals              |
| POST   | `/goals`      | Create a new goal            |
| PATCH  | `/goals/:id`  | Update a goal                |
| DELETE | `/goals/:id`  | Delete a goal                |

---

## 📦 Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/money-quest.git
cd money-quest


Install dependencies

# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install


Start the development servers

# Backend
npm run dev

# Frontend
cd ../frontend
npm run dev


Open your browser and go to http://localhost:5173

🏗️ Project Structure
money-quest/
├─ frontend/
│  ├─ src/
│  │  ├─ components/
│  │  │  ├─ Budget.jsx
│  │  │  ├─ BudgetForm.jsx
│  │  │  ├─ BudgetOverview.jsx
│  │  │  └─ ...
│  │  ├─ store/
│  │  │  └─ useBudgetStore.js
│  │  ├─ pages/
│  │  │  └─ Dashboard.jsx
│  │  └─ App.jsx
│  └─ package.json
├─ backend/
│  ├─ models/
│  ├─ routes/
│  ├─ controllers/
│  └─ server.js
└─ README.md

⚡ Usage

Add a Budget: Fill in budget name, total amount, and categories.

Add Transaction: Choose a budget, select a category, enter amount & description.

Track Goals: Create personal savings goals and monitor progress in real time.

Switch Period: Toggle between weekly, monthly, or yearly budgets.

🎨 UI Screenshots

(Optional: Add screenshots for Dashboard, Budget Form, Goals, etc.)

🤝 Contributing

Fork the project

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some feature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License

This project is licensed under the MIT License.

❤️ Acknowledgements

Tailwind CSS

DaisyUI

React

Zustand

react-hot-toast
