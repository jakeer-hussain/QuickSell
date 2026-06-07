# QuickSell - QuickSell Marketplace Application

QuickSell is a modern, premium reseller marketplace web application. The application enables users to list items for sale, filter and search for products, ask and answer queries on product pages, and manage their listings under a unified dashboard.

---

## 🚀 Features Built

### 1. User Authentication & Profile
- **JWT-based Authentication**: Secure user registration and login functionality.
- **Unified Profiles**: Users can act as both buyers and sellers seamlessly within the same session.
- **Owner Dashboard**: "My Active Listings" section to manage items, mark products as `Available` or `Sold`, and delete active listings.

### 2. Listings & Marketplace Explore
- **Server-Side Pagination**: Clean layout limiting search results to **6 listings per page**, fetched dynamically from the database.
- **URL-Based State Retention**: Pagination states (`/?page=X`) are bound to URL search parameters. If a user clicks into a product detail page and returns, their pagination page is perfectly preserved.
- **Advanced Server-Side Search & Filtering**:
  - **Debounced Text Search** to prevent spamming backend requests.
  - **Category filtering** (Electronics, Furniture, Books, etc.).
  - **Availability status filtering** (`All`, `Available`, `Sold`).
  - **Price range slider** matching server parameters.

### 3. Product Listing Creation
- **Cloudinary Integration**: Supports direct client-side image uploading to Cloudinary, automatically linking the image URL to the listing.
- **Input Validation**: Frontend checks to ensure category, price, and media attachments meet requirements.

### 4. Interactive Q&A (Inquiries)
- **Public Discussion Threads**: Buyers can post questions on the product details page.
- **Real-Time Notification Dashboard**: Sellers are notified of new queries in their dashboard and can post replies immediately.

---

## 🛠️ Tech Stack Used

### Frontend
- **Framework**: React (Vite template)
- **Routing**: React Router (v7) for standard URL-based navigation and back/forward browser support.
- **Styling**: Vanilla Tailwind CSS + Custom Claymorphic utility tokens defined in `index.css`.
- **Icons**: Lucide React.
- **API Client**: Axios with request interceptors for automated JWT authorization.

### Backend
- **Runtime**: Node.js & Express
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (jsonwebtoken) & bcryptjs for password hashing.
- **Process Manager**: Nodemon for local hot reloading.

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js installed (v18+ recommended)
- MongoDB Atlas account or local MongoDB instance

---

### Step 1: Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root of the `backend/` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?appName=Cluster0
   JWT_SECRET=supersecretkey
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

### Step 2: Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Verify the API connection base URL in `src/services/api.js`:
   ```javascript
   const api = axios.create({
     baseURL: "http://127.0.0.1:5000/api",
   });
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open the app in your browser at the URL shown in the console (e.g. `http://localhost:5174/` or `http://localhost:5173/`).

---

## 💡 Assumptions Made

1. **Local Session Token Storage**: JWT authentication tokens are saved in browser `localStorage`.

2. **Default Listing Status**: Newly created listings are default-initialized with the status `ACTIVE`.

3. **Filtering Conventions**: Categorization and status keys strictly match MongoDB enum schemas (`["ACTIVE", "SOLD"]`).

4. **Keyword Search Implementation**: Search functionality is implemented by performing keyword matching on listing titles and descriptions.

5. **Predefined Categories**: Users must select a category from a predefined list of categories when creating a listing; custom categories are not supported.

6. **Public Inquiry System**: Inquiries and their corresponding answers are publicly visible to all users and are not restricted to the listing owner and the inquirer.

7. **Authenticated Marketplace Actions**: Creating listings, posting inquiries, answering inquiries, updating listings, and marking listings as sold require an authenticated user session.

8. **Listing Ownership Restrictions**: Only the creator of a listing is permitted to edit the listing details or update its status.

