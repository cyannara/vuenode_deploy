참고문서 폴더

- [MariaDB with Ubuntu(Naver Cloud).txt](<https://github.com/cyannara/vuenode/blob/main/%EC%B0%B8%EA%B3%A0%EB%AC%B8%EC%84%9C/MariaDB%20with%20Ubuntu(Naver%20Cloud).txt>)
- [node_vue_deploy](https://github.com/cyannara/vue_node_deploy/blob/main/참고문서/node_vue_배포.md)
- [node_vue 분리하여 배포하기](https://github.com/cyannara/vue_node_deploy/blob/main/참고문서/node_vue_분리배포.md)

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
