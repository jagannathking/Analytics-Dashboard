# Lead Generation Analytics Dashboard

A full-stack application designed to provide marketing agencies with real-time insights into their lead generation campaigns across multiple channels. Users can track lead quality, optimize campaign performance, and make data-driven budget allocation decisions.

**Live Demo:** [https://analytics-dashboard-zf6x.vercel.app/login](https://analytics-dashboard-zf6x.vercel.app/login)

## Features

*   **Comprehensive Dashboard:** At-a-glance overview of key metrics like Total Leads, Conversion Rate, Cost Per Lead, and Average Lead Score.
*   **Lead Tracking:** View, filter, and manage individual leads.
*   **Campaign Performance:** Analyze the effectiveness of different marketing campaigns.
*   **Interactive Charts & Tables:** Visualize lead trends over time and compare campaign results.
*   **Dynamic Filters:** Filter data by date range, campaign, lead score, and status.
*   **User Authentication & Roles:** Secure login with role-based access control (e.g., admin, manager).
*   **Responsive UI:** Designed to be usable across different screen sizes.
*   **Dark/Light Theme Toggle:** User preference for UI theme.

## Tech Stack

*   **Frontend:** React (with Vite), React Router, Axios, Recharts (for charts), CSS
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB (with Mongoose)
*   **Authentication:** JWT (JSON Web Tokens)

## Getting Started

### Prerequisites

*   Node.js (v16 or later recommended)
*   npm or yarn or pnpm
*   MongoDB instance (local or cloud-hosted like MongoDB Atlas)

### Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/jagannathking/Analytics-Dashboard.git
    cd Analytics-Dashboard
    ```

2.  **Backend Setup:**
    ```bash
    cd backend
    npm install
    ```
    *   Create a `.env` file in the `backend` directory by copying `.env.example` (if available) or creating it manually.
    *   Populate `.env` with your MongoDB connection string and JWT secret:
        ```env
        PORT=5001
        MONGO_URI=your_mongodb_connection_string
        JWT_SECRET=your_super_secret_jwt_key
        ```
    *   Start the backend server:
        ```bash
        npm run dev
        ```
        The backend will typically run on `http://localhost:5001`.

3.  **Frontend Setup:**
    ```bash
    cd frontend
    npm install
    ```
    *   Create a `.env` file in the `frontend` directory.
    *   Add your backend API URL:
        ```env
        VITE_API_BASE_URL=http://localhost:5001/api
        ```
    *   Start the frontend development server:
        ```bash
        npm run dev
        ```
        The frontend will typically run on `http://localhost:5173` (or another port shown in the terminal).

### Demo Users (for the deployed version or if you seed the database manually)

You can use the following credentials to log into the live demo:

*   **Admin:**
    *   Username: `jagannath`
    *   Password: `123456`
*   **Manager:**
    *   Username: `jagan`
    *   Password: `123456`

*(Note: For local development, you will need to seed your database with users. Refer to the project's documentation or insert users manually via MongoDB shell/Compass using Bcrypt-hashed passwords).*

## Project Structure

The project is organized into two main directories:

*   `frontend/`: Contains all the React client-side code.
*   `backend/`: Contains the Node.js/Express server-side API and database logic.

Refer to the respective README files within these directories for more detailed information (if available).

## How It Works

1.  **User Authentication:** Users log in with their credentials. The backend validates them and issues a JWT.
2.  **API Communication:** The React frontend makes authenticated API calls to the Express backend to fetch and manipulate data.
3.  **Data Management:** The backend interacts with MongoDB to store and retrieve information about users, campaigns, and leads.
4.  **Dashboard Display:** The frontend renders the fetched data into interactive charts, tables, and summary cards, providing actionable insights to the user.

## Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature/your-feature-name`).
6. Open a Pull Request.

Please make sure to update tests as appropriate.

## License

This project is licensed under the [MIT License](LICENSE.md) (Consider adding a LICENSE.md file if you haven't).

---

*This README provides a starting point. Feel free to expand on sections like "Future Enhancements," "Deployment," or add more detailed setup instructions if necessary.*
