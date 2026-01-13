# CMS Platform API Documentation

Complete API reference with all endpoints, request/response formats, and curl commands for testing.

**Base URL**: `http://localhost:3000`

---

## Table of Contents
1. [Authentication](#authentication)
2. [Users Management](#users-management)
3. [Topics](#topics)
4. [Programs](#programs)
5. [Terms](#terms)
6. [Lessons](#lessons)
7. [Assets](#assets)
8. [Public Catalog API](#public-catalog-api)
9. [Health Check](#health-check)

---

## Authentication

### 1. Login
**Endpoint**: `POST /api/auth/login`
**Access**: Public
**Description**: Login with email and password to get JWT token

**Request Body**:
```json
{
  "email": "admin@cms.com",
  "password": "admin123"
}
```

**Response**:
```json
{
  "user": {
    "id": "d70ad7cc-2419-4d52-b64e-e989a833e278",
    "email": "admin@cms.com",
    "name": "Admin User",
    "role": "admin",
    "is_active": true
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Curl Command**:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@cms.com",
    "password": "admin123"
  }'
```

**Test Users**:
- Admin: `admin@cms.com` / `admin123`
- Editor: `editor@cms.com` / `editor123`
- Viewer: `viewer@cms.com` / `viewer123`

---

### 2. Get Current User
**Endpoint**: `GET /api/auth/me`
**Access**: Authenticated
**Description**: Get currently authenticated user details

**Response**:
```json
{
  "id": "d70ad7cc-2419-4d52-b64e-e989a833e278",
  "email": "admin@cms.com",
  "name": "Admin User",
  "role": "admin",
  "is_active": true,
  "created_at": "2026-01-12T11:40:15.451Z",
  "updated_at": "2026-01-12T11:40:15.451Z"
}
```

**Curl Command**:
```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Users Management

### 1. List All Users
**Endpoint**: `GET /api/users`
**Access**: Admin only
**Description**: Get list of all users

**Response**:
```json
[
  {
    "id": "d70ad7cc-2419-4d52-b64e-e989a833e278",
    "email": "admin@cms.com",
    "name": "Admin User",
    "role": "admin",
    "is_active": true,
    "created_at": "2026-01-12T11:40:15.451Z",
    "updated_at": "2026-01-12T11:40:15.451Z"
  }
]
```

**Curl Command**:
```bash
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 2. Get User by ID
**Endpoint**: `GET /api/users/:id`
**Access**: Admin, Editor
**Description**: Get specific user details

**Curl Command**:
```bash
curl http://localhost:3000/api/users/d70ad7cc-2419-4d52-b64e-e989a833e278 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 3. Create User
**Endpoint**: `POST /api/users`
**Access**: Admin only
**Description**: Create a new user

**Request Body**:
```json
{
  "email": "newuser@cms.com",
  "password": "password123",
  "name": "New User",
  "role": "editor"
}
```

**Valid Roles**: `admin`, `editor`, `viewer`

**Response**:
```json
{
  "id": "new-uuid-here",
  "email": "newuser@cms.com",
  "name": "New User",
  "role": "editor",
  "is_active": true,
  "created_at": "2026-01-12T13:00:00.000Z",
  "updated_at": "2026-01-12T13:00:00.000Z"
}
```

**Curl Command**:
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@cms.com",
    "password": "password123",
    "name": "New User",
    "role": "editor"
  }'
```

---

### 4. Update User
**Endpoint**: `PUT /api/users/:id`
**Access**: Admin, Editor
**Description**: Update user details

**Request Body**:
```json
{
  "name": "Updated Name",
  "role": "viewer",
  "is_active": true
}
```

**Curl Command**:
```bash
curl -X PUT http://localhost:3000/api/users/USER_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "role": "viewer",
    "is_active": true
  }'
```

---

### 5. Deactivate User
**Endpoint**: `DELETE /api/users/:id`
**Access**: Admin only
**Description**: Deactivate a user (sets is_active to false)

**Curl Command**:
```bash
curl -X DELETE http://localhost:3000/api/users/USER_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Topics

### 1. List All Topics
**Endpoint**: `GET /api/topics`
**Access**: Authenticated
**Description**: Get all topics

**Response**:
```json
[
  {
    "id": "d5fec110-81b7-4f83-b03c-6ea22ce52ac0",
    "name": "Language Learning",
    "created_at": "2026-01-12T11:40:15.451Z"
  }
]
```

**Curl Command**:
```bash
curl http://localhost:3000/api/topics \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 2. Get Topic by ID
**Endpoint**: `GET /api/topics/:id`
**Access**: Authenticated
**Description**: Get specific topic

**Curl Command**:
```bash
curl http://localhost:3000/api/topics/TOPIC_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 3. Create Topic
**Endpoint**: `POST /api/topics`
**Access**: Admin, Editor
**Description**: Create a new topic

**Request Body**:
```json
{
  "name": "New Topic Name"
}
```

**Curl Command**:
```bash
curl -X POST http://localhost:3000/api/topics \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Topic Name"
  }'
```

---

### 4. Update Topic
**Endpoint**: `PUT /api/topics/:id`
**Access**: Admin, Editor
**Description**: Update topic name

**Request Body**:
```json
{
  "name": "Updated Topic Name"
}
```

**Curl Command**:
```bash
curl -X PUT http://localhost:3000/api/topics/TOPIC_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Topic Name"
  }'
```

---

### 5. Delete Topic
**Endpoint**: `DELETE /api/topics/:id`
**Access**: Admin only
**Description**: Delete a topic

**Curl Command**:
```bash
curl -X DELETE http://localhost:3000/api/topics/TOPIC_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Programs

### 1. List All Programs
**Endpoint**: `GET /api/programs`
**Access**: Authenticated
**Description**: Get all programs with optional filters

**Query Parameters**:
- `status` (optional): Filter by status (`draft`, `published`, `archived`)
- `language` (optional): Filter by primary language
- `topic_id` (optional): Filter by topic ID

**Response**:
```json
[
  {
    "id": "97e81553-176c-4d57-be55-f8b8964b787e",
    "title": "Introduction to Programming",
    "description": "Learn programming fundamentals",
    "language_primary": "en",
    "languages_available": ["en", "te"],
    "status": "published",
    "published_at": "2026-01-12T11:40:15.451Z",
    "created_at": "2026-01-12T11:40:15.451Z",
    "updated_at": "2026-01-12T11:40:15.451Z"
  }
]
```

**Curl Commands**:
```bash
# Get all programs
curl http://localhost:3000/api/programs \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Filter by status
curl "http://localhost:3000/api/programs?status=published" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Filter by language
curl "http://localhost:3000/api/programs?language=en" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Filter by topic
curl "http://localhost:3000/api/programs?topic_id=TOPIC_ID_HERE" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 2. Get Program by ID
**Endpoint**: `GET /api/programs/:id`
**Access**: Authenticated
**Description**: Get program with nested topics, terms, and assets

**Response**:
```json
{
  "id": "97e81553-176c-4d57-be55-f8b8964b787e",
  "title": "Introduction to Programming",
  "description": "Learn programming fundamentals",
  "language_primary": "en",
  "languages_available": ["en", "te"],
  "status": "published",
  "published_at": "2026-01-12T11:40:15.451Z",
  "created_at": "2026-01-12T11:40:15.451Z",
  "updated_at": "2026-01-12T11:40:15.451Z",
  "topics": [
    {
      "id": "52fc49f3-d577-496e-8622-aadb52d7b2e3",
      "name": "Programming"
    }
  ],
  "terms": [
    {
      "id": "term-uuid",
      "term_number": 1,
      "title": "Fundamentals",
      "created_at": "2026-01-12T11:40:15.451Z",
      "lesson_count": "5",
      "published_lesson_count": "3"
    }
  ],
  "assets": [
    {
      "id": "asset-uuid",
      "language": "en",
      "variant": "portrait",
      "asset_type": "poster",
      "url": "https://example.com/poster.jpg",
      "created_at": "2026-01-12T11:40:15.451Z"
    }
  ]
}
```

**Curl Command**:
```bash
curl http://localhost:3000/api/programs/PROGRAM_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 3. Create Program
**Endpoint**: `POST /api/programs`
**Access**: Admin, Editor
**Description**: Create a new program

**Request Body**:
```json
{
  "title": "New Program",
  "description": "Program description",
  "language_primary": "en",
  "languages_available": ["en", "hi"],
  "topics": ["TOPIC_ID_1", "TOPIC_ID_2"]
}
```

**Response**:
```json
{
  "id": "new-program-uuid",
  "title": "New Program",
  "description": "Program description",
  "language_primary": "en",
  "languages_available": ["en", "hi"],
  "status": "draft",
  "published_at": null,
  "created_at": "2026-01-12T13:00:00.000Z",
  "updated_at": "2026-01-12T13:00:00.000Z",
  "topics": [
    {"id": "TOPIC_ID_1", "name": "Topic 1"},
    {"id": "TOPIC_ID_2", "name": "Topic 2"}
  ]
}
```

**Curl Command**:
```bash
curl -X POST http://localhost:3000/api/programs \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Program",
    "description": "Program description",
    "language_primary": "en",
    "languages_available": ["en", "hi"],
    "topics": []
  }'
```

---

### 4. Update Program
**Endpoint**: `PUT /api/programs/:id`
**Access**: Admin, Editor
**Description**: Update program details

**Request Body**:
```json
{
  "title": "Updated Program Title",
  "description": "Updated description",
  "language_primary": "en",
  "languages_available": ["en", "hi", "te"],
  "topics": ["TOPIC_ID_1"],
  "status": "published"
}
```

**Curl Command**:
```bash
curl -X PUT http://localhost:3000/api/programs/PROGRAM_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Program Title",
    "description": "Updated description",
    "status": "published"
  }'
```

---

### 5. Delete Program
**Endpoint**: `DELETE /api/programs/:id`
**Access**: Admin only
**Description**: Delete a program (cascades to terms, lessons, assets)

**Curl Command**:
```bash
curl -X DELETE http://localhost:3000/api/programs/PROGRAM_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Terms

### 1. List All Terms
**Endpoint**: `GET /api/terms`
**Access**: Authenticated
**Description**: Get all terms with optional program filter

**Query Parameters**:
- `program_id` (optional): Filter by program ID

**Response**:
```json
[
  {
    "id": "ff541dcf-2905-4fff-ac89-a12f5873570a",
    "program_id": "24807c33-125b-4e38-abef-aac042c91960",
    "term_number": 1,
    "title": "बुनियादी संचालन",
    "created_at": "2026-01-12T11:40:15.451Z",
    "lesson_count": "2",
    "published_lesson_count": "1"
  }
]
```

**Curl Commands**:
```bash
# Get all terms
curl http://localhost:3000/api/terms \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Filter by program
curl "http://localhost:3000/api/terms?program_id=PROGRAM_ID_HERE" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 2. Get Term by ID
**Endpoint**: `GET /api/terms/:id`
**Access**: Authenticated
**Description**: Get term with lessons

**Response**:
```json
{
  "id": "ff541dcf-2905-4fff-ac89-a12f5873570a",
  "program_id": "24807c33-125b-4e38-abef-aac042c91960",
  "term_number": 1,
  "title": "बुनियादी संचालन",
  "created_at": "2026-01-12T11:40:15.451Z",
  "lessons": [
    {
      "id": "lesson-uuid",
      "lesson_number": 1,
      "title": "Lesson Title",
      "content_type": "video",
      "status": "published"
    }
  ]
}
```

**Curl Command**:
```bash
curl http://localhost:3000/api/terms/TERM_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 3. Create Term
**Endpoint**: `POST /api/terms`
**Access**: Admin, Editor
**Description**: Create a new term

**Request Body**:
```json
{
  "program_id": "PROGRAM_ID_HERE",
  "term_number": 2,
  "title": "Advanced Concepts"
}
```

**Curl Command**:
```bash
curl -X POST http://localhost:3000/api/terms \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "program_id": "PROGRAM_ID_HERE",
    "term_number": 2,
    "title": "Advanced Concepts"
  }'
```

---

### 4. Update Term
**Endpoint**: `PUT /api/terms/:id`
**Access**: Admin, Editor
**Description**: Update term title

**Request Body**:
```json
{
  "title": "Updated Term Title"
}
```

**Curl Command**:
```bash
curl -X PUT http://localhost:3000/api/terms/TERM_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Term Title"
  }'
```

---

### 5. Delete Term
**Endpoint**: `DELETE /api/terms/:id`
**Access**: Admin only
**Description**: Delete a term (cascades to lessons)

**Curl Command**:
```bash
curl -X DELETE http://localhost:3000/api/terms/TERM_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Lessons

### 1. List All Lessons
**Endpoint**: `GET /api/lessons`
**Access**: Authenticated
**Description**: Get all lessons with optional filters

**Query Parameters**:
- `term_id` (optional): Filter by term ID
- `status` (optional): Filter by status (`draft`, `scheduled`, `published`, `archived`)
- `content_type` (optional): Filter by content type (`video`, `article`, `quiz`)

**Response**:
```json
[
  {
    "id": "99cc3bb5-004a-46d1-9848-9b914fa2c375",
    "term_id": "ff541dcf-2905-4fff-ac89-a12f5873570a",
    "lesson_number": 1,
    "title": "संख्याओं के साथ काम करना",
    "content_type": "video",
    "duration_ms": 540000,
    "is_paid": false,
    "content_language_primary": "hi",
    "content_languages_available": ["hi"],
    "status": "published",
    "publish_at": null,
    "published_at": "2026-01-12T11:40:15.451Z",
    "created_at": "2026-01-12T11:40:15.451Z",
    "updated_at": "2026-01-12T11:40:15.451Z",
    "term_title": "बुनियादी संचालन",
    "program_id": "24807c33-125b-4e38-abef-aac042c91960",
    "program_title": "गणित की मूल बातें"
  }
]
```

**Curl Commands**:
```bash
# Get all lessons
curl http://localhost:3000/api/lessons \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Filter by term
curl "http://localhost:3000/api/lessons?term_id=TERM_ID_HERE" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Filter by status
curl "http://localhost:3000/api/lessons?status=published" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Filter by content type
curl "http://localhost:3000/api/lessons?content_type=video" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 2. Get Lesson by ID
**Endpoint**: `GET /api/lessons/:id`
**Access**: Authenticated
**Description**: Get lesson with assets

**Response**:
```json
{
  "id": "99cc3bb5-004a-46d1-9848-9b914fa2c375",
  "term_id": "ff541dcf-2905-4fff-ac89-a12f5873570a",
  "lesson_number": 1,
  "title": "संख्याओं के साथ काम करना",
  "content_type": "video",
  "duration_ms": 540000,
  "is_paid": false,
  "content_language_primary": "hi",
  "content_languages_available": ["hi"],
  "content_urls_by_language": {
    "hi": "https://example.com/videos/lesson5-hi.mp4"
  },
  "subtitle_languages": [],
  "subtitle_urls_by_language": {},
  "status": "published",
  "publish_at": null,
  "published_at": "2026-01-12T11:40:15.451Z",
  "created_at": "2026-01-12T11:40:15.451Z",
  "updated_at": "2026-01-12T11:40:15.451Z",
  "term_title": "बुनियादी संचालन",
  "program_id": "24807c33-125b-4e38-abef-aac042c91960",
  "program_title": "गणित की मूल बातें",
  "assets": [
    {
      "id": "0b7b3698-32d9-4d73-a5d7-080af4944eaa",
      "language": "hi",
      "variant": "portrait",
      "asset_type": "thumbnail",
      "url": "https://picsum.photos/400/600?random=20",
      "created_at": "2026-01-12T11:40:15.451Z"
    }
  ]
}
```

**Curl Command**:
```bash
curl http://localhost:3000/api/lessons/LESSON_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 3. Create Lesson
**Endpoint**: `POST /api/lessons`
**Access**: Admin, Editor
**Description**: Create a new lesson

**Request Body**:
```json
{
  "term_id": "TERM_ID_HERE",
  "lesson_number": 1,
  "title": "Introduction to the Course",
  "content_type": "video",
  "duration_ms": 600000,
  "is_paid": false,
  "content_language_primary": "en",
  "content_languages_available": ["en", "hi"],
  "content_urls_by_language": {
    "en": "https://example.com/video-en.mp4",
    "hi": "https://example.com/video-hi.mp4"
  },
  "subtitle_languages": ["en"],
  "subtitle_urls_by_language": {
    "en": "https://example.com/subtitles-en.vtt"
  },
  "status": "draft"
}
```

**Notes**:
- `duration_ms` is required for video content
- `status` can be: `draft`, `scheduled`, `published`, `archived`
- If status is `scheduled`, must provide `publish_at`

**Curl Command**:
```bash
curl -X POST http://localhost:3000/api/lessons \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "term_id": "TERM_ID_HERE",
    "lesson_number": 1,
    "title": "Introduction to the Course",
    "content_type": "video",
    "duration_ms": 600000,
    "is_paid": false,
    "content_language_primary": "en",
    "content_languages_available": ["en"],
    "content_urls_by_language": {
      "en": "https://example.com/video-en.mp4"
    },
    "subtitle_languages": [],
    "subtitle_urls_by_language": {},
    "status": "draft"
  }'
```

---

### 4. Update Lesson
**Endpoint**: `PUT /api/lessons/:id`
**Access**: Admin, Editor
**Description**: Update lesson details

**Request Body**:
```json
{
  "title": "Updated Lesson Title",
  "duration_ms": 720000,
  "content_urls_by_language": {
    "en": "https://example.com/updated-video.mp4"
  }
}
```

**Curl Command**:
```bash
curl -X PUT http://localhost:3000/api/lessons/LESSON_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Lesson Title",
    "duration_ms": 720000
  }'
```

---

### 5. Publish Lesson Immediately
**Endpoint**: `POST /api/lessons/:id/publish`
**Access**: Admin, Editor
**Description**: Publish lesson immediately (also auto-publishes parent program if draft)

**Response**:
```json
{
  "message": "Lesson published successfully",
  "lesson": {
    "id": "lesson-uuid",
    "status": "published",
    "published_at": "2026-01-12T13:14:09.359Z"
  }
}
```

**Curl Command**:
```bash
curl -X POST http://localhost:3000/api/lessons/LESSON_ID_HERE/publish \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 6. Schedule Lesson
**Endpoint**: `POST /api/lessons/:id/schedule`
**Access**: Admin, Editor
**Description**: Schedule lesson for future publication

**Request Body**:
```json
{
  "publish_at": "2026-02-01T10:00:00Z"
}
```

**Response**:
```json
{
  "message": "Lesson scheduled successfully",
  "lesson": {
    "id": "lesson-uuid",
    "status": "scheduled",
    "publish_at": "2026-02-01T10:00:00.000Z"
  }
}
```

**Curl Command**:
```bash
curl -X POST http://localhost:3000/api/lessons/LESSON_ID_HERE/schedule \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "publish_at": "2026-02-01T10:00:00Z"
  }'
```

---

### 7. Archive Lesson
**Endpoint**: `POST /api/lessons/:id/archive`
**Access**: Admin, Editor
**Description**: Archive a lesson

**Response**:
```json
{
  "message": "Lesson archived successfully",
  "lesson": {
    "id": "lesson-uuid",
    "status": "archived"
  }
}
```

**Curl Command**:
```bash
curl -X POST http://localhost:3000/api/lessons/LESSON_ID_HERE/archive \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 8. Delete Lesson
**Endpoint**: `DELETE /api/lessons/:id`
**Access**: Admin only
**Description**: Delete a lesson (cascades to assets)

**Curl Command**:
```bash
curl -X DELETE http://localhost:3000/api/lessons/LESSON_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Assets

### Program Assets

#### 1. List Program Assets
**Endpoint**: `GET /api/program-assets`
**Access**: Authenticated
**Description**: Get program assets (requires program_id query parameter)

**Query Parameters**:
- `program_id` (required): Program ID

**Response**:
```json
[
  {
    "id": "89bcaa58-4d56-4396-b690-e6a68e56f1db",
    "program_id": "24807c33-125b-4e38-abef-aac042c91960",
    "language": "hi",
    "variant": "portrait",
    "asset_type": "poster",
    "url": "https://picsum.photos/400/600?random=6",
    "created_at": "2026-01-12T11:40:15.451Z"
  }
]
```

**Curl Command**:
```bash
curl "http://localhost:3000/api/program-assets?program_id=PROGRAM_ID_HERE" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

#### 2. Create Program Asset
**Endpoint**: `POST /api/program-assets`
**Access**: Admin, Editor
**Description**: Create a program asset (poster)

**Request Body**:
```json
{
  "program_id": "PROGRAM_ID_HERE",
  "language": "en",
  "variant": "portrait",
  "url": "https://example.com/poster-portrait.jpg"
}
```

**Valid Variants**: `portrait`, `landscape`, `square`, `banner`

**Curl Command**:
```bash
curl -X POST http://localhost:3000/api/program-assets \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "program_id": "PROGRAM_ID_HERE",
    "language": "en",
    "variant": "portrait",
    "url": "https://example.com/poster-portrait.jpg"
  }'
```

---

#### 3. Delete Program Asset
**Endpoint**: `DELETE /api/program-assets/:id`
**Access**: Admin, Editor
**Description**: Delete a program asset

**Curl Command**:
```bash
curl -X DELETE http://localhost:3000/api/program-assets/ASSET_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### Lesson Assets

#### 1. List Lesson Assets
**Endpoint**: `GET /api/lesson-assets`
**Access**: Authenticated
**Description**: Get lesson assets (requires lesson_id query parameter)

**Query Parameters**:
- `lesson_id` (required): Lesson ID

**Response**:
```json
[
  {
    "id": "0b7b3698-32d9-4d73-a5d7-080af4944eaa",
    "lesson_id": "99cc3bb5-004a-46d1-9848-9b914fa2c375",
    "language": "hi",
    "variant": "portrait",
    "asset_type": "thumbnail",
    "url": "https://picsum.photos/400/600?random=20",
    "created_at": "2026-01-12T11:40:15.451Z"
  }
]
```

**Curl Command**:
```bash
curl "http://localhost:3000/api/lesson-assets?lesson_id=LESSON_ID_HERE" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

#### 2. Create Lesson Asset
**Endpoint**: `POST /api/lesson-assets`
**Access**: Admin, Editor
**Description**: Create a lesson asset (thumbnail)

**Request Body**:
```json
{
  "lesson_id": "LESSON_ID_HERE",
  "language": "en",
  "variant": "landscape",
  "url": "https://example.com/thumbnail-landscape.jpg"
}
```

**Valid Variants**: `portrait`, `landscape`, `square`, `banner`

**Curl Command**:
```bash
curl -X POST http://localhost:3000/api/lesson-assets \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "lesson_id": "LESSON_ID_HERE",
    "language": "en",
    "variant": "landscape",
    "url": "https://example.com/thumbnail-landscape.jpg"
  }'
```

---

#### 3. Delete Lesson Asset
**Endpoint**: `DELETE /api/lesson-assets/:id`
**Access**: Admin, Editor
**Description**: Delete a lesson asset

**Curl Command**:
```bash
curl -X DELETE http://localhost:3000/api/lesson-assets/ASSET_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Public Catalog API

The Public Catalog API provides read-only, **unauthenticated** access to published content. This API is designed for consumer-facing applications (mobile apps, public websites) and has important differences from the admin API:

**Key Differences:**
- **No authentication required** - All endpoints are public
- **Published content only** - Only returns programs and lessons with `status='published'`
- **Read-only** - No create/update/delete operations
- **Cache-optimized** - Includes `Cache-Control` headers for efficient caching
- **Cursor-based pagination** - Scalable pagination using timestamps

**Base URL**: `http://localhost:3000/catalog`

---

### 1. List Published Programs
**Endpoint**: `GET /catalog/programs`
**Access**: Public (no authentication)
**Description**: List all published programs with cursor-based pagination

**Query Parameters**:
- `language` (optional): Filter by primary language (e.g., `en`, `hi`, `te`)
- `topic` (optional): Filter by topic ID
- `cursor` (optional): Cursor for pagination (use `next_cursor` from previous response)
- `limit` (optional): Number of results per page (default: 20, max: 100)

**Important**: Only returns programs that:
1. Have `status='published'`
2. Have at least 1 published lesson
3. Are sorted by `published_at` DESC (most recently published first)

**Response**:
```json
{
  "data": [
    {
      "id": "97e81553-176c-4d57-be55-f8b8964b787e",
      "title": "Introduction to Programming",
      "description": "Learn programming fundamentals",
      "language_primary": "en",
      "languages_available": ["en", "te"],
      "status": "published",
      "published_at": "2026-01-12T11:40:15.451Z",
      "created_at": "2026-01-12T11:40:15.451Z",
      "updated_at": "2026-01-12T11:40:15.451Z"
    }
  ],
  "pagination": {
    "next_cursor": "2026-01-10T10:30:00.000Z",
    "has_more": true
  }
}
```

**Cache Headers**: `Cache-Control: public, max-age=300` (5 minutes)

**Curl Commands**:
```bash
# Get first page (default 20 results)
curl http://localhost:3000/catalog/programs

# Get first 10 results
curl "http://localhost:3000/catalog/programs?limit=10"

# Filter by language
curl "http://localhost:3000/catalog/programs?language=en"

# Filter by topic
curl "http://localhost:3000/catalog/programs?topic=TOPIC_ID_HERE"

# Get next page (using cursor from previous response)
curl "http://localhost:3000/catalog/programs?cursor=2026-01-10T10:30:00.000Z&limit=20"

# Combine filters
curl "http://localhost:3000/catalog/programs?language=en&topic=TOPIC_ID_HERE&limit=10"
```

---

### 2. Get Published Program by ID
**Endpoint**: `GET /catalog/programs/:id`
**Access**: Public (no authentication)
**Description**: Get single published program with terms and **published lessons only**

**Important**:
- Returns 404 if program is not published or has no published lessons
- Only includes lessons with `status='published'`
- Includes all program details, topics, terms, and assets in nested format

**Response**:
```json
{
  "id": "97e81553-176c-4d57-be55-f8b8964b787e",
  "title": "Introduction to Programming",
  "description": "Learn programming fundamentals",
  "language_primary": "en",
  "languages_available": ["en", "te"],
  "status": "published",
  "published_at": "2026-01-12T11:40:15.451Z",
  "created_at": "2026-01-12T11:40:15.451Z",
  "updated_at": "2026-01-12T11:40:15.451Z",
  "topics": [
    {
      "id": "52fc49f3-d577-496e-8622-aadb52d7b2e3",
      "name": "Programming"
    }
  ],
  "assets": {
    "posters": {
      "en": {
        "portrait": "https://example.com/poster-en-portrait.jpg",
        "landscape": "https://example.com/poster-en-landscape.jpg"
      },
      "te": {
        "portrait": "https://example.com/poster-te-portrait.jpg",
        "landscape": "https://example.com/poster-te-landscape.jpg"
      }
    }
  },
  "terms": [
    {
      "id": "term-uuid",
      "term_number": 1,
      "title": "Fundamentals",
      "created_at": "2026-01-12T11:40:15.451Z",
      "lessons": [
        {
          "id": "lesson-uuid",
          "lesson_number": 1,
          "title": "Introduction",
          "content_type": "video",
          "duration_ms": 600000,
          "is_paid": false,
          "content_language_primary": "en",
          "content_languages_available": ["en", "te"],
          "content_urls_by_language": {
            "en": "https://example.com/video-en.mp4",
            "te": "https://example.com/video-te.mp4"
          },
          "subtitle_languages": ["en"],
          "subtitle_urls_by_language": {
            "en": "https://example.com/subtitles-en.vtt"
          },
          "status": "published",
          "published_at": "2026-01-12T11:40:15.451Z",
          "created_at": "2026-01-12T11:40:15.451Z",
          "updated_at": "2026-01-12T11:40:15.451Z",
          "assets": {
            "thumbnails": {
              "en": {
                "portrait": "https://example.com/thumb-en-portrait.jpg",
                "landscape": "https://example.com/thumb-en-landscape.jpg"
              }
            }
          }
        }
      ]
    }
  ]
}
```

**Asset Structure**:
- **Program assets**: Nested as `posters` by language and variant
- **Lesson assets**: Nested as `thumbnails` by language and variant
- Each language can have multiple variants: `portrait`, `landscape`, `square`, `banner`

**Cache Headers**: `Cache-Control: public, max-age=600` (10 minutes)

**Curl Command**:
```bash
curl http://localhost:3000/catalog/programs/PROGRAM_ID_HERE
```

**Error Response (404)**:
```json
{
  "code": "NOT_FOUND",
  "message": "Program not found or not published"
}
```

---

### 3. Get Published Lesson by ID
**Endpoint**: `GET /catalog/lessons/:id`
**Access**: Public (no authentication)
**Description**: Get single published lesson with all details

**Important**:
- Returns 404 if lesson `status` is not `'published'`
- Includes lesson details, content URLs, subtitles, and assets
- Includes parent term and program information

**Response**:
```json
{
  "id": "99cc3bb5-004a-46d1-9848-9b914fa2c375",
  "term_id": "ff541dcf-2905-4fff-ac89-a12f5873570a",
  "lesson_number": 1,
  "title": "Introduction to Variables",
  "content_type": "video",
  "duration_ms": 540000,
  "is_paid": false,
  "content_language_primary": "en",
  "content_languages_available": ["en", "hi"],
  "content_urls_by_language": {
    "en": "https://example.com/videos/lesson1-en.mp4",
    "hi": "https://example.com/videos/lesson1-hi.mp4"
  },
  "subtitle_languages": ["en", "hi"],
  "subtitle_urls_by_language": {
    "en": "https://example.com/subtitles/lesson1-en.vtt",
    "hi": "https://example.com/subtitles/lesson1-hi.vtt"
  },
  "status": "published",
  "published_at": "2026-01-12T11:40:15.451Z",
  "created_at": "2026-01-12T11:40:15.451Z",
  "updated_at": "2026-01-12T11:40:15.451Z",
  "term_title": "Fundamentals",
  "program_id": "24807c33-125b-4e38-abef-aac042c91960",
  "program_title": "Introduction to Programming",
  "assets": {
    "thumbnails": {
      "en": {
        "portrait": "https://example.com/thumb-en-portrait.jpg",
        "landscape": "https://example.com/thumb-en-landscape.jpg"
      },
      "hi": {
        "portrait": "https://example.com/thumb-hi-portrait.jpg",
        "landscape": "https://example.com/thumb-hi-landscape.jpg"
      }
    }
  }
}
```

**Cache Headers**: `Cache-Control: public, max-age=600` (10 minutes)

**Curl Command**:
```bash
curl http://localhost:3000/catalog/lessons/LESSON_ID_HERE
```

**Error Response (404)**:
```json
{
  "code": "NOT_FOUND",
  "message": "Lesson not found or not published"
}
```

---

### Cursor Pagination Guide

The catalog API uses cursor-based pagination for efficient querying:

**How it works:**
1. Make first request without cursor parameter
2. API returns results + `pagination` object with `next_cursor` and `has_more`
3. If `has_more` is `true`, use `next_cursor` value in next request
4. Continue until `has_more` is `false`

**Example workflow:**
```bash
# Step 1: Get first page
curl "http://localhost:3000/catalog/programs?limit=20"
# Response includes: "next_cursor": "2026-01-10T10:30:00.000Z", "has_more": true

# Step 2: Get second page using cursor
curl "http://localhost:3000/catalog/programs?limit=20&cursor=2026-01-10T10:30:00.000Z"
# Response includes: "next_cursor": "2026-01-09T15:20:00.000Z", "has_more": true

# Step 3: Continue until has_more is false
curl "http://localhost:3000/catalog/programs?limit=20&cursor=2026-01-09T15:20:00.000Z"
# Response: "next_cursor": null, "has_more": false (end of results)
```

**Advantages over offset pagination:**
- Consistent results even when data changes
- Better performance on large datasets
- Uses database indexes efficiently

---

### Caching Strategy

The catalog API includes cache headers for optimal performance:

| Endpoint | Cache Duration | Rationale |
|----------|---------------|-----------|
| `GET /catalog/programs` | 5 minutes | List changes when lessons are published |
| `GET /catalog/programs/:id` | 10 minutes | Individual programs rarely change |
| `GET /catalog/lessons/:id` | 10 minutes | Lesson content rarely changes |

**Cache Headers**:
```
Cache-Control: public, max-age=300
```

**Benefits**:
- Reduces server load
- Faster response times for end users
- CDN-friendly (can be cached by CDN providers)

**When cache is stale**:
- After scheduled lessons are published by the worker
- Cache automatically expires after the specified duration

---

### Differences from Admin API

| Feature | Admin API (`/api/*`) | Catalog API (`/catalog/*`) |
|---------|---------------------|---------------------------|
| Authentication | Required (JWT token) | None (public access) |
| Content Visibility | All statuses (draft, scheduled, published, archived) | Published only |
| Operations | Full CRUD | Read-only |
| Pagination | Not paginated (returns all results) | Cursor-based pagination |
| Caching | No cache headers | Cache-Control headers |
| Authorization | Role-based (admin, editor, viewer) | None |
| Rate Limiting | Not implemented | Consider adding in production |

---

### Testing the Catalog API

**Complete test workflow:**

```bash
# 1. List all published programs
curl http://localhost:3000/catalog/programs

# 2. Filter by language
curl "http://localhost:3000/catalog/programs?language=en"

# 3. Get specific program (use ID from step 1)
curl http://localhost:3000/catalog/programs/PROGRAM_ID_HERE

# 4. Get specific lesson (use ID from step 3)
curl http://localhost:3000/catalog/lessons/LESSON_ID_HERE

# 5. Test pagination
curl "http://localhost:3000/catalog/programs?limit=2"
# Use next_cursor from response for next page
curl "http://localhost:3000/catalog/programs?limit=2&cursor=CURSOR_VALUE"

# 6. Verify cache headers
curl -I http://localhost:3000/catalog/programs
# Look for: Cache-Control: public, max-age=300

# 7. Test error handling (try non-existent ID)
curl http://localhost:3000/catalog/programs/00000000-0000-0000-0000-000000000000
# Should return 404 with proper error format
```

---

## Health Check

### Check API Health
**Endpoint**: `GET /health`
**Access**: Public
**Description**: Check API and database connectivity

**Response**:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-01-12T13:14:58.066Z"
}
```

**Curl Command**:
```bash
curl http://localhost:3000/health
```

---

## Error Responses

All errors follow this format:

```json
{
  "code": "ERROR_CODE",
  "message": "Human readable error message",
  "details": {}
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `DUPLICATE` | 409 | Unique constraint violation |
| `INVALID_REFERENCE` | 400 | Foreign key constraint violation |
| `INTERNAL_ERROR` | 500 | Server error |

### Example Error Responses

**401 Unauthorized**:
```json
{
  "code": "UNAUTHORIZED",
  "message": "Authentication required. Please provide a valid token."
}
```

**403 Forbidden**:
```json
{
  "code": "FORBIDDEN",
  "message": "Access denied. Required role(s): admin",
  "details": {
    "userRole": "editor",
    "requiredRoles": ["admin"]
  }
}
```

**409 Duplicate**:
```json
{
  "code": "DUPLICATE",
  "message": "Resource already exists",
  "details": {
    "constraint": "users_email_key",
    "table": "users"
  }
}
```

**400 Validation Error**:
```json
{
  "code": "VALIDATION_ERROR",
  "message": "Topic name is required"
}
```

---

## Authentication Header Format

All authenticated endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

To get a token:
1. Call `POST /api/auth/login` with valid credentials
2. Extract the `token` from the response
3. Use it in the Authorization header for subsequent requests

**Token Expiration**: Tokens expire after 7 days

---

## Complete Test Workflow

Here's a complete workflow to test all functionality:

```bash
# 1. Login and get token
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cms.com","password":"admin123"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "Token: $TOKEN"

# 2. Get current user
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

# 3. Create a topic
TOPIC=$(curl -s -X POST http://localhost:3000/api/topics \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Topic"}')

TOPIC_ID=$(echo "$TOPIC" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "Created topic: $TOPIC_ID"

# 4. Create a program
PROGRAM=$(curl -s -X POST http://localhost:3000/api/programs \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Test Program\",\"description\":\"Test\",\"language_primary\":\"en\",\"languages_available\":[\"en\"],\"topics\":[\"$TOPIC_ID\"]}")

PROGRAM_ID=$(echo "$PROGRAM" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "Created program: $PROGRAM_ID"

# 5. Create a term
TERM=$(curl -s -X POST http://localhost:3000/api/terms \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"program_id\":\"$PROGRAM_ID\",\"term_number\":1,\"title\":\"Term 1\"}")

TERM_ID=$(echo "$TERM" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "Created term: $TERM_ID"

# 6. Create a lesson
LESSON=$(curl -s -X POST http://localhost:3000/api/lessons \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"term_id\":\"$TERM_ID\",\"lesson_number\":1,\"title\":\"Lesson 1\",\"content_type\":\"video\",\"duration_ms\":300000,\"is_paid\":false,\"content_language_primary\":\"en\",\"content_languages_available\":[\"en\"],\"content_urls_by_language\":{\"en\":\"https://example.com/video.mp4\"},\"subtitle_languages\":[],\"subtitle_urls_by_language\":{},\"status\":\"draft\"}")

LESSON_ID=$(echo "$LESSON" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "Created lesson: $LESSON_ID"

# 7. Publish the lesson
curl -X POST http://localhost:3000/api/lessons/$LESSON_ID/publish \
  -H "Authorization: Bearer $TOKEN"

# 8. Get the complete program with all nested data
curl http://localhost:3000/api/programs/$PROGRAM_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- UUIDs are used for all entity IDs
- JSONB fields (`content_urls_by_language`, `subtitle_urls_by_language`) must be valid JSON objects
- Array fields (`languages_available`, `content_languages_available`, etc.) must be valid JSON arrays
- The `language_primary` must be included in `languages_available`
- Cascade deletes: Deleting a program deletes all its terms, lessons, and assets
- Publishing a lesson auto-publishes the parent program if it's still in draft status
