<!-- hehe just some help  -->

<!-- follow this and you will get through this maze -->

```
src/
├── api/           # apt layer ( Replace localStorage with HTTP calls)
├── auth/          # Authentication 
├── config/        # App  configuration
├── features/      # feature (if any)
├── utils/         # Utility
├── types/         # TypeScript interfaces
└── components/    # UI components 
```
Little more sorting later

<!-- Replace the api layer --> (`src/api/issues.ts`) 
```typescript
// Current: localStorage
IssuesAPI.getAll() // → GET /api/issues
IssuesAPI.create() // → POST /api/issues
IssuesAPI.update() // → PUT /api/issues/:id
IssuesAPI.delete() // → DELETE /api/issues/:id
```

<!-- Authentication --> (`src/auth/authService.ts`)
```typescript
// Current: localStorage + hardcoded admin
AuthService.login() // → POST /api/auth/login
AuthService.logout() // → POST /api/auth/logout
AuthService.getCurrentUser() // → GET /api/auth/me
```


```sql
-- Issues table
CREATE TABLE issues (
  id VARCHAR PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR NOT NULL,
  status ENUM('submitted', 'in_progress', 'completed'),
  coordinates_lat DECIMAL(10, 8),
  coordinates_lng DECIMAL(11, 8),
  photo_url VARCHAR,
  address VARCHAR,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Users table
CREATE TABLE users (
  id VARCHAR PRIMARY KEY,
  email VARCHAR UNIQUE,
  password_hash VARCHAR,
  role ENUM('user', 'admin'),
  created_at TIMESTAMP
);
```

<!-- backend setup

api end point -->
- `GET /api/issues` - Get all issues
- `POST /api/issues` - Create new issue
- `PUT /api/issues/:id` - Update issue
- `DELETE /api/issues/:id` - Delete issue
- `PATCH /api/issues/:id/status` - Update status only
- `POST /api/auth/login` - User/admin login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

<!-- replace the local storage calls -->
1. Update `src/api/issues.ts` with fetch calls
2. Update `src/auth/authService.ts` with handling
3. Add error handling and loading states

<!-- Environmetal (i have gone mental) variable -->
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_JWT_SECRET=your-secret-key
```

<!-- working features -->
-  User/Admin login system
-  Issue reporting with photos
-  GPS location capture
-  Map with markers
-  Mobile-responsive design
-  Real-time UI updates

<!-- useful steps  -->
1. Set up backend API with above endpoints
2. Replace `IssuesAPI` class methods with HTTP calls
3. Replace `AuthService` with auth
4. Add proper error handling
5. Test all features work with real backend

<!-- cute little flowchart to get an idea where is out life going -->
```
User Action → Service Layer → API Layer → Backend
     ↓              ↓           ↓          ↓
UI Update ← Business Logic ← HTTP Response ← Database
```

Everything is organized and ready for backend integration