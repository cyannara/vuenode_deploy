## Nginx와 Node 통합 이점 [참조](https://ai-one.tistory.com/entry/Nginx와-Nodejs-연계-완벽한-웹-서버-구축-가이드)

Node.js는 단일 스레드, 이벤트 기반 모델로 작동하여 가볍고 효율적이지만, 정적 파일 제공, SSL 종료, 로드 밸런싱 등의 기능에서는 Nginx가 더 뛰어난 성능을 보여줍니다.  
두 기술을 함께 사용했을 때의 주요 이점입니다:

1. **정적 자원의 효율적인 제공**: Nginx는 이미지, CSS, JavaScript 등 정적 파일을 매우 효율적으로 제공합니다.
2. **로드 밸런싱**: 여러 Node.js 인스턴스 간에 트래픽을 분산시켜 애플리케이션 가용성을 높입니다.
3. **보안 강화**: SSL/TLS 종료, 기본적인 DDoS 보호 등을 Nginx가 담당합니다.
4. **캐싱**: Nginx의 강력한 캐싱 기능으로 반복 요청에 대한 서버 부하를 줄입니다.
5. **멀티코어 활용**: 단일 스레드인 Node.js의 한계를 Nginx를 통해 보완할 수 있습니다.

![https://ai-one.tistory.com/entry/Nginx와-Nodejs-연계-완벽한-웹-서버-구축-가이드](image-1.png)

### 기본 아키텍쳐

- 정적파일요청 --> Nginx가 직접 처리
- API요청 --> Node.js로 프록시

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

### 작업순서

1. Vue 프론트엔드 빌드
2. node 소스 압축파일 만들기
3. Naver Cloud 서버 준비 (Ubuntu 가상 서버)
4. 패키지 설치(nvm, nginx, node, unzip)
5. 서버에 vue 빌드한 파일 업로드
6. 서버에 node 소스 업로드(.env 포함)
7. PM2로 Node 서버 실행(&, nohup)
8. Nginx로 프록시 설정
9. (선택) 도메인 연결 및 HTTPS 설정 (Let's Encrypt)
10. github action

### 1. Vue 프론트엔드 빌드

```sh
cd frontend
npm run build
```

### 2. node 소스 압축파일 만들기

```sh
cd backapp
git archive --format=zip main -o ../backapp.zip
```

### 3. Naver Cloud 서버 준비 (Ubuntu 가상 서버)

[참조](https://devmg.tistory.com/346){\_target=blank}

### 4. 패키지 설치(nvm, node, nginx)

#### nvm으로 node 설치

```sh
# 패키지 업데이트
sudo apt-get update

# nvm 설치
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.1/install.sh | bash
source ~/.bashrc

# nvm 설치 확인
nvm --version

# nvm 명령어로 node와 npm을 설치
nvm install 24.11.0

```

#### Nginx 설치

```sh
sudo apt update
# 설치
sudo apt install nginx
# 버전 확인
nginx -v
# 서버 구동
sudo systemctl start nginx        # sudo service nginx start
```

#### unzip 설치

```sh
sudo apt install unzip
```

### 5. 서버에 vue 빌드한 파일 업로드

```sh
mkdir /var/www/frontapp
sudo chmod 777 /var/www/frontapp
# dist 폴더의 파일들을 /var/www/frontapp 폴더로 복사
```

### 6. 서버에 node 소스 업로드(.env 포함)

```sh
# 폴더 생성
mkdir ~/backapp

# backapp 폴더에 압축파일 업로드

# 압출풀기
unzip backapp.zip
```

### 7. PM2로 Node 서버 실행(&, nohup)

```sh
# pm2 설치
npm install -g pm2

# node 서버 구동
pm2 start app.js --name app

# 지금 실행 중인 모든 Node 프로세스 목록을 저장
pm2 save

# 서버가 부팅될 때 PM2가 자동으로 실행되도록 OS에 등록
pm2 startup

# 테스트
curl http://localhost:3000/guestbook
```

### 8. Nginx로 프록시 설정

```bash
sudo nano /etc/nginx/sites-available/frontapp
```

```sh
server {
    listen 80;
    server_name _;

    root /var/www/frontapp;
    index index.html;

    # API 요청을 Node.js 백엔드 서버로 프록시
    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}

```

```bash
sudo ln -s /etc/nginx/sites-available/frontapp /etc/nginx/sites-enabled/

# 설정파일 문법검사
sudo nginx -t

# nginx 다시시작
sudo systemctl reload nginx

# 테스트
curl http://localhost/api/guestbook
```

### 10. [github action](https://docs.github.com/ko/actions/writing-workflows/quickstart)

```
GitHub
  ↓ (push)
GitHub Actions
  ↓
[frontapp 수정 -> Front Build → 서버 업로드 → Nginx 반영]
[backapp 수정 -> Back Deploy → 서버 업로드 → PM2 무중단 재시작]
```

##### [GitHub에 Secrets 등록](https://docs.github.com/ko/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets)

GitHub → Settings → Secrets → Actions

| 키 이름    | 설명                     |
| :--------- | :----------------------- |
| HOST       | 서버 주소 또는 IP        |
| USER       | ubuntu                   |
| KEY        | SSH 개인키 (id_rsa) 내용 |
| FRONT_PATH | front 정적파일 위치      |
| BACK_PATH  | node 소스 위치           |

#### front workflow

foont 파일 업로드. scp는 추가만 하고 삭제는 안 함.

```yml
- name: Upload Dist
  uses: appleboy/scp-action@v0.1.7
  with:
    host: ${{ secrets.HOST }}
    username: ${{ secrets.USER }}
    key: ${{ secrets.KEY }}
    source: "frontapp/dist/*"
    target: ${{ secrets.FRONT_PATH }}
```

front 파일 sync

```yml
- name: Sync dist to server
  uses: appleboy/ssh-action@v1.0.3
  with:
    host: ${{ secrets.HOST }}
    username: ${{ secrets.USER }}
    key: ${{ secrets.KEY }}
    script: |
      rsync -av --delete frontapp/dist/ ${{ secrets.FRONT_PATH }}/
```
