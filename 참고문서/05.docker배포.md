## 도커 기반 배포

- referer : https://codekunst.tistory.com/169

```
/backend
/frontend
/docker-compose.yml
```

### Step1. Docker Image

#### backend Dockerfile

```
//
```

#### frontend Dockerfile

```yml
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### docker-compose.yml

```yml
 services:
  spring-app:
    build:
      context: ./backend
    container_name: spring-app
    image: {도커 사용자 이름}/spring-app:latest
    ports:
      - "8080:8080"
    restart: always
    networks:
      - app-network

  vue-app:
    build:
      context: ./frontend
    container_name: vue-app
    image: {도커 사용자 이름}/vue-app:latest
    ports:
      - "3000:3000"
    depends_on:
      - spring-app
    restart: always
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

### Step2. Github Actions 설정하기

```yml
name: CI/CD Pipeline

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      # Spring Boot 빌드
      - name: Set up JDK 17
        uses: actions/setup-java@v3
        with:
          distribution: "temurin"
          java-version: "17"

      - name: Build Spring Boot app
        run: |
          cd backend
          ./gradlew clean build -x test

      # Docker Hub 로그인
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      # Spring Docker 이미지 빌드 및 푸시
      - name: Build and Push Spring Docker image
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          push: true
          tags: ${{ secrets.DOCKER_USERNAME }}/spring-app:latest

      # Vue Docker 이미지 빌드 및 푸시
      - name: Build and Push Vue Docker image
        uses: docker/build-push-action@v5
        with:
          context: ./frontend
          push: true
          tags: ${{ secrets.DOCKER_USERNAME }}/vue-app:latest

      # EC2에 SSH로 접속하여 배포
      - name: Deploy to EC2 instance
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USERNAME }}
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            export DOCKER_USERNAME=${{ secrets.DOCKER_USERNAME }}
            cd ~/app
            docker pull $DOCKER_USERNAME/spring-app:latest
            docker pull $DOCKER_USERNAME/vue-app:latest
            docker-compose down
            docker-compose up -d
```

그리고 중간 중간에 있는 secrets같은 시크릿 키는

Settings > Security > Secrets and variables에 있는 Actions를 눌러서 등록해주면 됩니다.

```
DOCKER_PASSWORD : Personal Access Token

DOCKER_USERNAME : 도커 사용자 닉네임

EC2_HOST : EC2 사용자 닉네임

EC2_SSH_KEY : .pem을 base64로 인코딩 ( cat 으로 열어서 --- 앞뒤 포함해서 붙여야합니다. )
```
