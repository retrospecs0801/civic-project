1. Main Files to Change

 `/src/api/issues.ts`
This is the main file you need to modify. Replace all localStorage calls with fetch requests:

```javascript
// Current: localStorage.getItem()
// Replace with: fetch('/api/issues')

static async getAll(): Promise<Issue[]> {
  const response = await fetch('/api/issues');
  return response.json();
}
```

2. `/src/auth/authService.ts`

```javascript
// Current: hardcoded admin credentials
// Replace with: real login api call

static async login(email: string, password: string) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  return response.json();
}
```

3. Api Endpoints You Need to Create

4. Issues endpoints:
- `GET /api/issues` - get all issues
- `POST /api/issues` - create new issue
- `PUT /api/issues/:id` - update issue
- `DELETE /api/issues/:id` - delete issue
- `PATCH /api/issues/:id/status` - update status only

5. Auth endpoints:
- `POST /api/auth/login` - user login
- `POST /api/auth/logout` - user logout
- `GET /api/auth/me` - get current user

6. Issues table:
```sql
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
```
7. Users table:
```sql
CREATE TABLE users (
  id VARCHAR PRIMARY KEY,
  email VARCHAR UNIQUE,
  password_hash VARCHAR,
  role ENUM('user', 'admin'),
  created_at TIMESTAMP
);
```

8. Photo Upload

The frontend sends photos as base64 strings
1. Convert base64 to image file
2. Save to your file storage
3. Return the image url
4. Store the url in database

9. Environment Variables
add to env :-
VITE_API_BASE_URL=https://backendurl.com

