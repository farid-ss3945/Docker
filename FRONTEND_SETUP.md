# Invoice Manager Frontend

A React + Vite + Axios frontend application for managing customers and invoices.

## Features

- **Login System**: Authentication with token-based authorization
- **Customer Management**: View list of customers
- **Invoice Management**: View list of invoices with status tracking
- **Responsive Design**: Clean UI with responsive layout
- **API Integration**: Axios-based HTTP client with interceptors

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Customers.jsx       # Customers list component
│   │   ├── Customers.css
│   │   ├── Invoices.jsx        # Invoices list component
│   │   ├── Invoices.css
│   │   ├── Login.jsx           # Login component
│   │   └── Login.css
│   ├── services/
│   │   ├── api.js              # Axios instance with interceptors
│   │   ├── customerService.js  # Customer API calls
│   │   ├── invoiceService.js   # Invoice API calls
│   │   └── userService.js      # User/Authentication API calls
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
└── README.md
```

## Installation

```bash
cd frontend
npm install
```

## Development

Start the dev server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

## Building for Production

```bash
npm run build
```

## Environment Configuration

Update the API base URL in `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

Change the port if your backend runs on a different port.

## Usage

1. **Login**: Enter your email and password on the login page
2. **View Customers**: Click "Customers" tab to see all customers
3. **View Invoices**: Click "Invoices" tab to see all invoices
4. **Refresh Data**: Use the "Refresh" button to reload data
5. **Logout**: Click the "Logout" button to exit

## API Services

### userService
- `login(data)` - User login
- `register(data)` - User registration
- `getProfile()` - Get user profile
- `updateProfile(data)` - Update user profile
- `changePassword(data)` - Change password

### customerService
- `getAll()` - Get all customers
- `getById(id)` - Get customer by ID
- `create(data)` - Create new customer
- `update(id, data)` - Update customer
- `delete(id)` - Delete customer
- `getStats()` - Get customer statistics

### invoiceService
- `getAll()` - Get all invoices
- `getById(id)` - Get invoice by ID
- `create(data)` - Create new invoice
- `update(id, data)` - Update invoice
- `delete(id)` - Delete invoice
- `getStats()` - Get invoice statistics

## Features Implemented

✅ React + Vite setup
✅ Axios HTTP client with interceptors
✅ Authentication with token storage
✅ Login/Logout functionality
✅ Customers list view
✅ Invoices list view with status display
✅ Error handling and loading states
✅ Responsive design
✅ Component-based architecture
✅ Service layer for API calls

## Tech Stack

- **React** 18.x
- **Vite** 5.x
- **Axios** - HTTP client
- **JavaScript (JSX)** - Language
- **CSS3** - Styling

## Notes

- The JWT token is stored in `localStorage`
- Automatic logout occurs if token is invalid (401 response)
- All API errors are displayed to the user
- The frontend expects the backend API to run on `http://localhost:5000/api`
