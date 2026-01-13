# CMS Platform Database Structure

## Complete Database Schema Overview

### Table Summary
| Table Name | Records | Purpose |
|------------|---------|---------|
| **users** | 3 | Authentication & RBAC (admin, editor, viewer) |
| **topics** | 4 | Program categories (Mathematics, Science, Programming, Language Learning) |
| **programs** | 2 | Top-level content containers with multi-language support |
| **program_topics** | 3 | Many-to-many link between programs and topics |
| **program_assets** | 8 | Program posters (portrait, landscape, square variants per language) |
| **terms** | 2 | Sections within programs |
| **lessons** | 6 | Individual content units (video/article) with publishing workflow |
| **lesson_assets** | 14 | Lesson thumbnails (portrait, landscape variants per language) |

---

## Entity Relationship Diagram

```
┌─────────────────┐
│     USERS       │
│─────────────────│
│ id (PK)         │
│ email (UNIQUE)  │
│ password_hash   │
│ name            │
│ role (ENUM)     │◄─── Roles: admin, editor, viewer
│ is_active       │
│ created_at      │
│ updated_at      │
└─────────────────┘


┌─────────────────┐                    ┌──────────────────┐                    ┌─────────────────┐
│     TOPICS      │                    │  PROGRAM_TOPICS  │                    │    PROGRAMS     │
│─────────────────│                    │──────────────────│                    │─────────────────│
│ id (PK)         │◄───────────────────│ topic_id (FK)    │                    │ id (PK)         │
│ name (UNIQUE)   │                    │ program_id (FK)  │───────────────────►│ title           │
│ created_at      │                    │ created_at       │                    │ description     │
└─────────────────┘                    └──────────────────┘                    │ language_primary│
                                           Many-to-Many                         │ languages[]     │
      │                                    Junction Table                       │ status (ENUM)   │◄─── draft/published/archived
      │                                                                          │ published_at    │
      │                                                                          │ created_at      │
      │                                                                          │ updated_at      │
      │                                                                          └─────────────────┘
      │                                                                                  │
      │                                                                                  │
      │                                                                                  ▼
      │                                                                          ┌─────────────────────┐
      │                                                                          │  PROGRAM_ASSETS     │
      │                                                                          │─────────────────────│
      │                                                                          │ id (PK)             │
      │                                                                          │ program_id (FK)     │
      │                                                                          │ language            │
      │                                                                          │ variant (ENUM)      │◄─── portrait/landscape/square/banner
      │                                                                          │ asset_type          │     (poster)
      │                                                                          │ url                 │
      │                                                                          │ created_at          │
      │                                                                          └─────────────────────┘
      │                                                                                  │
      │                                                                                  │
      │                                                                          UNIQUE (program_id, language, variant, asset_type)
      │
      │
      │                                                                          ┌─────────────────┐
      └──────────────────────────────────────────────────────────────────────►  │      TERMS      │
                                                                                 │─────────────────│
                                                                                 │ id (PK)         │
                                                                                 │ program_id (FK) │
                                                                                 │ term_number     │
                                                                                 │ title           │
                                                                                 │ created_at      │
                                                                                 └─────────────────┘
                                                                                         │
                                                                          UNIQUE (program_id, term_number)
                                                                                         │
                                                                                         │
                                                                                         ▼
                                                                                 ┌──────────────────────────┐
                                                                                 │       LESSONS            │
                                                                                 │──────────────────────────│
                                                                                 │ id (PK)                  │
                                                                                 │ term_id (FK)             │
                                                                                 │ lesson_number            │
                                                                                 │ title                    │
                                                                                 │ content_type (ENUM)      │◄─── video/article
                                                                                 │ duration_ms              │     (required if video)
                                                                                 │ is_paid                  │
                                                                                 │ content_language_primary │
                                                                                 │ content_languages[] (ARR)│
                                                                                 │ content_urls (JSONB)     │◄─── {"en": "url", "te": "url"}
                                                                                 │ subtitle_languages[] (ARR)│
                                                                                 │ subtitle_urls (JSONB)    │◄─── {"en": "url", "hi": "url"}
                                                                                 │ status (ENUM)            │◄─── draft/scheduled/published/archived
                                                                                 │ publish_at               │
                                                                                 │ published_at             │
                                                                                 │ created_at               │
                                                                                 │ updated_at               │
                                                                                 └──────────────────────────┘
                                                                                         │
                                                                          UNIQUE (term_id, lesson_number)
                                                                                         │
                                                                                         │
                                                                                         ▼
                                                                                 ┌──────────────────────┐
                                                                                 │   LESSON_ASSETS      │
                                                                                 │──────────────────────│
                                                                                 │ id (PK)              │
                                                                                 │ lesson_id (FK)       │
                                                                                 │ language             │
                                                                                 │ variant (ENUM)       │◄─── portrait/landscape/square/banner
                                                                                 │ asset_type           │     (thumbnail)
                                                                                 │ url                  │
                                                                                 │ created_at           │
                                                                                 └──────────────────────┘
                                                                                         │
                                                                          UNIQUE (lesson_id, language, variant, asset_type)
```

---

## Current Data Visualization

### 1. Users (3 records)

```
┌────────────────────────────────────┬────────────────┬─────────────┬────────┐
│ id                                 │ email          │ name        │ role   │
├────────────────────────────────────┼────────────────┼─────────────┼────────┤
│ d70ad7cc-2419-4d52-b64e-e989a833e278│ admin@cms.com  │ Admin User  │ admin  │
│ 032cabb1-1025-4ee6-a28d-20cf07e62a07│ editor@cms.com │ Editor User │ editor │
│ 19ec627f-a96a-4b6f-9d65-12690042715b│ viewer@cms.com │ Viewer User │ viewer │
└────────────────────────────────────┴────────────────┴─────────────┴────────┘

Passwords: admin123, editor123, viewer123
```

### 2. Topics (4 records)

```
┌────────────────────────────────────┬───────────────────┐
│ id                                 │ name              │
├────────────────────────────────────┼───────────────────┤
│ 753371fa-978a-4dde-a1cd-598f4bc5528b│ Mathematics       │
│ aeba14bb-6571-4372-8ece-cac9eb7986a0│ Science           │
│ 52fc49f3-d577-496e-8622-aadb52d7b2e3│ Programming       │
│ d5fec110-81b7-4f83-b03c-6ea22ce52ac0│ Language Learning │
└────────────────────────────────────┴───────────────────┘
```

### 3. Programs (2 records)

```
Program 1: Introduction to Programming
├─ ID: 97e81553-176c-4d57-be55-f8b8964b787e
├─ Languages: [en, te] (Primary: en)
├─ Status: published
├─ Topics: Programming, Science
└─ Assets:
   ├─ English: portrait, landscape, square
   └─ Telugu: portrait, landscape

Program 2: गणित की मूल बातें
├─ ID: 24807c33-125b-4e38-abef-aac042c91960
├─ Languages: [hi] (Primary: hi)
├─ Status: published
├─ Topics: Mathematics
└─ Assets:
   └─ Hindi: portrait, landscape, square
```

### 4. Terms (2 records)

```
Term 1: Getting Started
├─ ID: 55433f32-268b-49c7-ba51-4f587528c970
├─ Program: Introduction to Programming
└─ Term Number: 1

Term 2: बुनियादी संचालन
├─ ID: ff541dcf-2905-4fff-ac89-a12f5873570a
├─ Program: गणित की मूल बातें
└─ Term Number: 1
```

### 5. Lessons (6 records)

```
Term: Getting Started
│
├─ Lesson 1: Introduction to Variables
│  ├─ Type: video (10 minutes)
│  ├─ Languages: [en, te]
│  ├─ Status: PUBLISHED ✅
│  ├─ Subtitles: en, te, hi
│  ├─ Is Paid: No
│  └─ Thumbnails: en(portrait, landscape), te(portrait, landscape)
│
├─ Lesson 2: Understanding Data Types
│  ├─ Type: article
│  ├─ Languages: [en]
│  ├─ Status: PUBLISHED ✅
│  ├─ Is Paid: No
│  └─ Thumbnails: en(portrait, landscape)
│
├─ Lesson 3: Control Structures
│  ├─ Type: video (8 minutes)
│  ├─ Languages: [en]
│  ├─ Status: SCHEDULED ⏰ (will publish at 2026-01-12 11:41:45)
│  ├─ Is Paid: Yes 💰
│  └─ Thumbnails: en(portrait, landscape)
│
└─ Lesson 4: Functions and Methods
   ├─ Type: article
   ├─ Languages: [en]
   ├─ Status: DRAFT 📝
   ├─ Is Paid: No
   └─ Thumbnails: en(portrait, landscape)

Term: बुनियादी संचालन
│
├─ Lesson 1: संख्याओं के साथ काम करना
│  ├─ Type: video (9 minutes)
│  ├─ Languages: [hi]
│  ├─ Status: PUBLISHED ✅
│  ├─ Is Paid: No
│  └─ Thumbnails: hi(portrait, landscape)
│
└─ Lesson 2: जोड़ और घटाव
   ├─ Type: article
   ├─ Languages: [hi]
   ├─ Status: DRAFT 📝
   ├─ Is Paid: No
   └─ Thumbnails: hi(portrait, landscape)
```

---

## How Tables Are Linked

### One-to-Many Relationships

1. **programs → terms** (1:N)
   - One program has many terms
   - Foreign Key: `terms.program_id → programs.id`
   - Cascade Delete: If program is deleted, all its terms are deleted

2. **terms → lessons** (1:N)
   - One term has many lessons
   - Foreign Key: `lessons.term_id → terms.id`
   - Cascade Delete: If term is deleted, all its lessons are deleted

3. **programs → program_assets** (1:N)
   - One program has many assets (posters in different languages/variants)
   - Foreign Key: `program_assets.program_id → programs.id`
   - Cascade Delete: If program is deleted, all its assets are deleted

4. **lessons → lesson_assets** (1:N)
   - One lesson has many assets (thumbnails in different languages/variants)
   - Foreign Key: `lesson_assets.lesson_id → lessons.id`
   - Cascade Delete: If lesson is deleted, all its assets are deleted

### Many-to-Many Relationship

5. **programs ↔ topics** (M:N)
   - One program can have multiple topics
   - One topic can be associated with multiple programs
   - Junction Table: `program_topics`
   - Foreign Keys:
     - `program_topics.program_id → programs.id`
     - `program_topics.topic_id → topics.id`
   - Cascade Delete: If program or topic is deleted, the association is removed

---

## Database Constraints

### UNIQUE Constraints

1. **users.email** - No duplicate email addresses
2. **topics.name** - No duplicate topic names
3. **(program_id, term_number)** - Each term number is unique within a program
4. **(term_id, lesson_number)** - Each lesson number is unique within a term
5. **(program_id, language, variant, asset_type)** - Each asset variant is unique per program/language
6. **(lesson_id, language, variant, asset_type)** - Each asset variant is unique per lesson/language

### CHECK Constraints

1. **Video lessons must have duration**
   ```sql
   content_type != 'video' OR duration_ms IS NOT NULL
   ```

2. **Scheduled lessons must have publish_at**
   ```sql
   status != 'scheduled' OR publish_at IS NOT NULL
   ```

3. **Published lessons must have published_at**
   ```sql
   status != 'published' OR published_at IS NOT NULL
   ```

4. **Primary language must be in available languages** (Programs & Lessons)
   ```sql
   language_primary = ANY(languages_available)
   ```

5. **Primary language must have content URL**
   ```sql
   content_urls_by_language ? content_language_primary
   ```

### Foreign Key Constraints

All relationships use `ON DELETE CASCADE` to maintain referential integrity:
- Delete program → deletes terms, program_assets, program_topics
- Delete term → deletes lessons
- Delete lesson → deletes lesson_assets

---

## Performance Indexes

### High-Priority Indexes (for Worker & API queries)

1. **lessons(status, publish_at)** - Worker finding scheduled lessons
2. **lessons(term_id, lesson_number)** - Ordering lessons within terms
3. **programs(status, language_primary, published_at)** - Catalog API filtering
4. **program_topics(program_id)** - Program-to-topics lookups
5. **program_topics(topic_id)** - Topic-to-programs lookups
6. **program_assets(program_id, language)** - Asset lookups by program
7. **lesson_assets(lesson_id, language)** - Asset lookups by lesson

---

## Multi-Language Support

### Programs
- **language_primary**: Main language (e.g., 'en', 'te', 'hi')
- **languages_available**: Array of all supported languages
- **Assets**: Separate rows for each language × variant combination

### Lessons
- **content_language_primary**: Main content language
- **content_languages_available**: Array of all content languages
- **content_urls_by_language**: JSONB map `{"en": "url", "te": "url"}`
- **subtitle_languages**: Array of subtitle languages
- **subtitle_urls_by_language**: JSONB map `{"en": "url", "hi": "url"}`
- **Assets**: Separate rows for each language × variant combination

---

## Publishing Workflow

### Lesson States
```
draft → scheduled → published → archived
  ↓         ↓
  └─────────┴──────────► archived
```

### Rules
1. **Draft → Scheduled**: Set `publish_at` timestamp
2. **Scheduled → Published**: Worker runs every minute, auto-publishes when `publish_at <= now()`
3. **Published → Archived**: Manual archival
4. **Draft/Scheduled → Archived**: Manual archival

### Program Auto-Publishing
When a lesson is published, its program is automatically set to `published` if it's currently `draft`.

---

## JSONB Usage Examples

### Storing Content URLs
```json
{
  "en": "https://example.com/videos/lesson1-en.mp4",
  "te": "https://example.com/videos/lesson1-te.mp4"
}
```

### Storing Subtitle URLs
```json
{
  "en": "https://example.com/subtitles/lesson1-en.vtt",
  "hi": "https://example.com/subtitles/lesson1-hi.vtt",
  "te": "https://example.com/subtitles/lesson1-te.vtt"
}
```

### Querying JSONB
```sql
-- Check if English content exists
SELECT * FROM lessons WHERE content_urls_by_language ? 'en';

-- Get English URL
SELECT content_urls_by_language->>'en' as english_url FROM lessons;
```

---

## Summary Statistics

```
Total Tables: 9
├─ Core Entities: 6 (users, topics, programs, terms, lessons)
├─ Junction Tables: 1 (program_topics)
└─ Asset Tables: 2 (program_assets, lesson_assets)

Total Records: 40
├─ Users: 3
├─ Topics: 4
├─ Programs: 2
├─ Program Topics: 3
├─ Program Assets: 8
├─ Terms: 2
├─ Lessons: 6
└─ Lesson Assets: 14

Total Indexes: 15+
Total Constraints: 20+
ENUMs: 4 (user_role, program_status, lesson_status, content_type, asset_variant)
```
