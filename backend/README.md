# PaySwift Backend

Node.js + Express + PostgreSQL backend for PaySwift.

## Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Database Setup**:
    - Ensure you have PostgreSQL running.
    - You can use Docker:
      ```bash
      docker-compose up -d
      ```
    - Or use a local Postgres instance and update `.env`.

3.  **Run Server**:
    ```bash
    npm run dev
    ```

## API Endpoints

### Auth
- `POST /api/auth/signup`: `{ name, email, password }`
- `POST /api/auth/login`: `{ email, password }`
- `POST /api/auth/kyc`: `{ kycId }` (Requires Token)

### Wallet
- `GET /api/wallet`: Get balance (Requires Token)
- `POST /api/wallet/add-money`: `{ amount }` (Requires Token)
- `POST /api/wallet/transfer`: `{ amount, recipientEmail }` (Requires Token)
- `POST /api/wallet/pay-bill`: `{ amount, serviceType }` (Requires Token)

### Transactions
- `GET /api/transactions`: Get history (Requires Token)
