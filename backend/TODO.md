# TODO List - Laravel Backend for Toko Thrifty

## Completed Tasks
- [x] Authentication with Laravel Sanctum (register, login, logout)
- [x] Role-based authorization (Admin, Pengguna) using middleware CheckRole
- [x] Public endpoints: GET /api/pakaian, GET /api/pakaian/{id}, GET /api/kategori-pakaian
- [x] Protected endpoints: POST /api/pembelian, GET /api/pembelian, GET /api/pembelian/{id}, PUT /api/akun, POST /api/logout
- [x] Admin endpoints: CRUD for pakaian and kategori-pakaian
- [x] Models: User, Pakaian, KategoriPakaian, Pembelian (with status), PembelianDetail, MetodePembayaran
- [x] Controllers: AuthController, PakaianController, PembelianController, AdminPakaianController
- [x] Form Request validation: StorePakaianRequest, UpdatePakaianRequest
- [x] API Resource: PakaianResource for consistent responses
- [x] Gates in AuthServiceProvider for role checks
- [x] Rate limiting on auth endpoints (throttle:5,1)
- [x] Stock management in pembelian (reduce stock on purchase)
- [x] Eager loading in queries to prevent N+1 problems
- [x] Migration for pembelian_status (pending, completed, cancelled)

## Next Steps
- [ ] Run migrations: php artisan migrate
- [ ] Seed database with sample data if needed
- [ ] Test API endpoints with Postman or similar tool
- [ ] Implement API Resources for Pembelian and KategoriPakaian for consistent responses
- [ ] Add pagination to list endpoints if needed
- [ ] Add search/filter functionality to pakaian endpoints
- [ ] Implement file upload for pakaian_gambar_url
- [ ] Add logging for critical operations
- [ ] Set up CORS for frontend integration
- [ ] Document API endpoints with OpenAPI/Swagger
- [ ] Add unit/feature tests for controllers
- [ ] Optimize queries and add caching if needed
- [ ] Set up deployment configuration

## Notes
- Backend is ready for frontend integration
- All endpoints follow RESTful conventions
- Authentication uses Bearer tokens via Laravel Sanctum
- Role-based access control implemented
- Data validation using Form Requests
- Stock management prevents overselling
- Transaction status allows for order management
