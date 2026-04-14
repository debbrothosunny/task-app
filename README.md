# Appify Social Feed — Full Stack Application

A social media feed application built with **Next.js** (frontend) and **Laravel** (backend), supporting posts, comments, replies, likes, and private/public visibility.


## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS |
| Backend | Laravel 12, PHP |
| Database | MySQL |
| Authentication | Laravel Sanctum (Session-based SPA) |
| Image Processing | Intervention Image 3 (WebP conversion) |
| API | RESTful API |

---

## Features Built

### 1. Authentication & Authorization
- User registration with first name, last name, email, and password
- Secure login with Laravel Sanctum session-based SPA authentication
- CSRF protection via `/sanctum/csrf-cookie`
- Protected routes — unauthenticated users are redirected to login
- Previous tokens are deleted on each new login for security

### 2. Feed Page
- Infinite scroll with cursor-based pagination (scalable for millions of posts)
- Posts displayed newest first
- Create posts with text and/or image
- Images automatically converted to WebP format (80% quality, max 1200px width)
- Public posts visible to everyone; private posts visible only to the author
- Private post filter applied at the database query level

### 3. Like / Unlike System
- Toggle like/unlike on posts, comments, and replies
- Optimistic UI updates for instant feedback
- Real-time like count updates from the server
- Modal showing list of users who liked a post, comment, or reply

### 4. Comments & Replies
- Add comments to posts
- Nested replies on comments
- Like/unlike on comments and replies
- Reply count tracking
- Comment count tracked via Laravel model events (no double counting)

### 5. Private & Public Posts
- Public posts are visible to all logged-in users
- Private posts are visible only to the post author
- Visibility filter applied server-side in the feed query

---

## Key Technical Decisions

### Cursor Pagination over Offset Pagination
Standard offset pagination (`LIMIT x OFFSET y`) degrades in performance as data grows. Cursor pagination is used instead, which maintains consistent performance even with millions of rows.

### Denormalized Counters
`likes_count` and `comments_count` are stored directly on the posts table as denormalized counters. This avoids expensive `COUNT()` queries on every feed load. Counters are updated via Laravel model events (`booted()`) to stay consistent.

### Model Events for Counter Management
Comment creation and deletion automatically increment/decrement the post's `comments_count` via the `Comment` model's `booted()` method. This ensures the counter stays accurate without manual management in controllers.

### WebP Image Conversion
All uploaded images are converted to WebP format using Intervention Image 3. This reduces file sizes significantly compared to JPEG/PNG, improving page load performance.

### Optimistic UI Updates
Like and comment actions update the UI immediately before the server responds. If the server request fails, the UI reverts to the previous state. This makes the application feel fast and responsive.

### Laravel Sanctum SPA Authentication
Sanctum SPA session-based authentication is used. The frontend calls `/sanctum/csrf-cookie` first to get a CSRF token, then uses `withCredentials: true` to send session cookies automatically with every request.

### Rate Limiting
API routes are protected with rate limiting via Laravel's `RateLimiter`. Post creation is limited to 10 requests per minute, and other social actions (likes, comments) are limited to 100 requests per minute per user.

### Eager Loading to Prevent N+1 Queries
All relationships (user, likes, comments) are eager loaded using `with()` and `withCount()` to prevent N+1 query problems that would devastate performance at scale.

---

## Database Design

```
users
  - id, first_name, last_name, email, password

posts
  - id, user_id, content, image, visibility (public/private)
  - likes_count, comments_count (denormalized counters)

comments
  - id, post_id, user_id, parent_id (null = top-level, set = reply)
  - content

likes (polymorphic)
  - id, likeable_id, likeable_type (post/comment), user_id

```

---

## Project Structure

```
appify-task-project/
│
├── frontend/                         # Next.js Application
│   ├── app/
│   │   ├── feed/
│   │   │   └── page.tsx              # Feed page (protected route)
│   │   ├── login/
│   │   │   └── page.tsx              # Login page
│   │   ├── register/
│   │   │   └── page.tsx              # Register page
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Root page
│   │   ├── globals.css               # Global styles
│   │   └── favicon.ico
│   │
│   ├── components/
│   │   ├── feed/
│   │   │   ├── CommentItem.tsx       # Comment & reply component
│   │   │   ├── LeftSidebar.tsx       # Left sidebar
│   │   │   ├── MobileBottomNav.tsx   # Mobile navigation
│   │   │   ├── Navbar.tsx            # Top navigation bar
│   │   │   ├── PostCard.tsx          # Individual post component
│   │   │   ├── PostForm.tsx          # Create post form
│   │   │   ├── RightSidebar.tsx      # Right sidebar
│   │   │   └── Stories.tsx           # Stories component
│   │   └── ui/
│   │       └── OptimizedImage.tsx    # Optimized image component
│   │
│   ├── lib/
│   │   └── axios.ts                  # Axios instance with CSRF & auth
│   │
│   ├── .env.local                    # Environment variables
│   ├── next.config.ts                # Next.js configuration
│   ├── tailwind.config.ts            # Tailwind CSS configuration
│   └── tsconfig.json                 # TypeScript configuration
│
└── backend/                          # Laravel Application
    ├── app/
    │   ├── Http/
    │   │   ├── Controllers/
    │   │   │   ├── AuthController.php
    │   │   │   ├── PostController.php
    │   │   │   └── CommentController.php
    │   │   └── Requests/
    │   │       ├── StorePostRequest.php
    │   │       └── CommentStoreRequest.php
    │   ├── Models/
    │   │   ├── Post.php
    │   │   ├── Comment.php
    │   │   ├── Like.php
    │   │   └── User.php
    │   └── Providers/
    │       └── AppServiceProvider.php
    ├── database/
    │   └── migrations/
    ├── routes/
    │   └── api.php
    └── storage/
        └── app/public/posts/         # Uploaded post images
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/register` | User registration |
| POST | `/api/login` | User login |
| GET | `/api/feed` | Get paginated feed |
| POST | `/api/posts` | Create a post |
| POST | `/api/like/{id}/{type}` | Toggle like |
| GET | `/api/likes/{id}/{type}/users` | Get users who liked |
| POST | `/api/posts/{post}/comments` | Add comment or reply |
| GET | `/api/comments/{id}/replies` | Get replies for a comment |

---

## Setup Instructions

### Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
# Configure DB credentials in .env
php artisan migrate
php artisan storage:link
php artisan serve
```

### Frontend (Next.js)

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Set NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:8000
npm run dev
```

Visit `http://localhost:3000`

---

## Security Considerations

- All API routes require Sanctum session authentication
- CSRF protection via Sanctum's cookie mechanism
- Private posts filtered at the database query level
- Image uploads validated for MIME type and size (max 5MB)
- Rate limiting applied to prevent spam and abuse
- CORS configured to allow only the frontend origin