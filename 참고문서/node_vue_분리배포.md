### 전체 구조

```
[사용자 브라우저]
        |
        v
 ┌──────────────┐
 │   Vue Front  │   → 정적파일 서버 (Nginx)
 └──────────────┘
        |
        v
 ┌──────────────┐
 │ Node Backend │   → API 서버 (Express)
 └──────────────┘
        |
        v
     Database

```

### 서버구성

| 서버  | 역할                 | 포트        |
| :---- | :------------------- | :---------- |
| Nginx | Vue 정적 파일 서비스 | 80 / 443    |
| Node  | API 서버             | 3000        |
| DB    | MySQL, Oracle, etc   | 3306 / 1521 |

### backend 배포

```sh
git archive --format=zip main -o ../backend.zip
```

```sh
npm install -g pm2
pm2 start app.js --name backapp
pm2 save
pm2 startup
```

### nginx 설치

```bash
sudo nano /etc/nginx/sites-available/frontapp
```

```sh
server {
  listen 80;
  server_name _;

  root /var/www/frontapp;
  index index.html;

  # API는 무조건 Node로 보내라
  location ^~ /api/ {
      proxy_pass http://127.0.0.1:3000;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
  }

  # Vue 라우팅 처리
  location / {
      try_files $uri $uri/ /index.html;
  }
}

```

proxy_pass http://127.0.0.1:3000/  
 proxy_pass 뒤에 / 가 있으면  
 /api/guestbook → /guestbook 으로 변환되어 Node에 전달됩니다.

### frontend 배포

```sh
cd frontapp
npm run build

# frontapp 폴더 생성
sudo mkdir frontapp
sodu chmod 777 foontapp

#dist 폴더 복사

```

### frontend 실행하도록 설정하고 node 연결 proxy 설정

```bash
sudo ln -s /etc/nginx/sites-available/frontapp /etc/nginx/sites-enabled/

# 설정파일 문법검사
sudo nginx -t

# nginx 다시시작
sudo systemctl reload nginx
```
