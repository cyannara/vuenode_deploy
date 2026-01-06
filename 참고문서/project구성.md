# vue + node + sqllite3 을 이용한 방명록 작성

## 전체 아키텍처

```
Vue (frontapp)
   │ axios
   ▼
Node.js (backapp / Express)
   │
   ▼
SQLite3 DB (guestbook.db)

```

## backend

### backend폴더 구조

```
backend/
 ├ db/
 │   └ db.js
 ├ routes/
 │   └ guestbook.js
 ├ app.js
 └ guestbook.db
```

### 패키지 설치

```sh
npm init -y
npm install express sqlite3
```

## frontend

### frontend 폴더 구조

```
frontend/
 ├ public/
 │   └ banner.jpg
 └ src/
    ├ api/
    │   └ guestbook.js
    ├ router/
    │   └ index.js
    ├ views/
    │   └ GuestBookView.vue
    ├ app.vue
    └ main.js
```
