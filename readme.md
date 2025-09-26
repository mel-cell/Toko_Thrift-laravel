# Toko Thrifty

Toko Thrifty is a full-stack web application for a thrift store specializing in second-hand clothing (pakaian bekas). It allows users to browse products, filter by categories, sizes, and prices, make purchases, and manage orders. Admins can handle product inventory, user management, and purchases.

The project is structured as a monorepo with a Laravel backend API and a Next.js frontend.

## Tech Stack

### Backend (Laravel 10)
- **Framework**: Laravel 10 with Sanctum for API authentication
- **Database**: MySQL (configurable in `backend/config/database.php`)
- **API Documentation**: Scramble (OpenAPI/Swagger) for auto-generated docs
- **Key Packages**:
  - Guzzle for HTTP requests
  - Laravel Sanctum for auth
  - Eloquent ORM for models (Pakaian, KategoriPakaian, Pembelian, etc.)
- **Models**: Pakaian (Products), KategoriPakaian (Categories), MetodePembayaran (Payment Methods), Pembelian (Purchases), User

### Frontend (Next.js 15)
- **Framework**: Next.js 15 with App Router and Turbopack
- **UI Library**: Radix UI components, Tailwind CSS 4, Lucide React icons
- **State Management**: SWR for data fetching, Axios for API calls
- **Other**: Recharts for charts, Sonner for toasts, Embla Carousel for sliders
- **Sections**: Admin dashboard, User pages, Auth flows

## Features

### User Features
- Browse and search products (by name, description, category)
- Filter products by category, size, price range
- View product details
- Make purchases with payment method selection
- Order history and details
- Authentication (login/register)

### Admin Features
- Dashboard with analytics (e.g., sales charts)
- Manage products (CRUD for Pakaian)
- Manage categories (KategoriPakaian)
- Manage users and roles
- View and update purchases (Pembelian)

### API Endpoints (Backend)
- **Products**: GET `/api/pakaian` (list with filters), GET `/api/pakaian/{id}` (details), POST/PUT/DELETE for admins
- **Categories**: GET `/api/kategori-pakaian`
- **Payments**: GET `/api/metode-pembayaran`
- **Search**: GET `/api/pakaian/search` (advanced filters)
- **Auth**: Standard Laravel Sanctum routes (login, register, logout)
- **Purchases**: CRUD for Pembelian and PembelianDetail
- Full API docs available at `/api/docs` (Scramble) when server is running

## Installation

### Prerequisites
- PHP 8.1+
- Composer
- Node.js 18+
- MySQL (or your preferred DB)
- Git

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Install PHP dependencies:
   ```
   composer install
   ```
3. Install Node dependencies (for Vite assets):
   ```
   npm install
   ```
4. Copy environment file:
   ```
   cp .env.example .env
   ```
5. Generate app key:
   ```
   php artisan key:generate
   ```
6. Configure database in `.env` (DB_HOST, DB_DATABASE, etc.)
7. Run migrations:
   ```
   php artisan migrate
   ```
8. Seed database (includes admin user):
   ```
   php artisan db:seed
   ```
   - Default admin: Check `database/seeders/AdminUserSeeder.php` for credentials (e.g., email: admin@example.com, password: password)

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Update API base URL in `frontend/src/lib/api.js` if needed (defaults to `http://localhost:8000/api`).

### Running the Application
1. Start the backend server:
   ```
   cd backend
   php artisan serve
   ```
   - API runs on `http://localhost:8000`
   - API Docs: `http://localhost:8000/api/docs`

2. Start the frontend dev server:
   ```
   cd frontend
   npm run dev
   ```
   - App runs on `http://localhost:3000`

3. For production build:
   - Backend: `php artisan optimize`
   - Frontend: `npm run build` then `npm start`

## Project Structure
```
toko_thrifty/
├── backend/          # Laravel API
│   ├── app/          # Models, Controllers, Resources
│   ├── database/     # Migrations, Seeders, Factories
│   ├── routes/       # API and Web routes
│   └── ...
├── frontend/         # Next.js App
│   ├── src/          # Components, Pages, Lib
│   ├── public/       # Static assets
│   └── ...
├── readme.md         # This file
└── LICENSE           # MIT License
```

## TODO (Ongoing Improvements)
- Improve API endpoints for better error handling
- Enhance admin pages for full CRUD operations
- Fix middleware issues (e.g., auth guards)
- Add responsive UI tests
- Complete API documentation

## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure code follows Laravel and Next.js best practices. Run `composer lint` (backend) and `npm run lint` (frontend) before submitting.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ for thrift shopping!
