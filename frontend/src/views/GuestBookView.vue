<template>
  <div>
    <!-- 상단 이미지 -->
    <div class="bg-dark text-white text-center position-relative">
      <img
        src="/banner.jpg"
        class="img-fluid w-100"
        style="max-height: 300px; object-fit: cover"
      />
      <div
        class="position-absolute top-50 start-50 translate-middle text-info-emphasis"
      >
        <h1 class="fw-bold">📖 Guest Book</h1>
        <p>방문해주셔서 감사합니다</p>
      </div>
    </div>

    <!-- 입력 카드 -->
    <div class="container mt-4">
      <div class="card shadow">
        <div class="card-body">
          <h5 class="card-title">방명록 작성</h5>
          <div class="row g-2">
            <div class="col-md-3">
              <input class="form-control" v-model="name" placeholder="이름" />
            </div>
            <div class="col-md-7">
              <input
                class="form-control"
                v-model="message"
                placeholder="메시지"
              />
            </div>
            <div class="col-md-2 d-grid">
              <button class="btn btn-primary" @click="save">등록</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 리스트 -->
      <div class="mt-4">
        <div class="card mb-2 shadow-sm" v-for="g in list" :key="g.id">
          <div class="card-body d-flex justify-content-between">
            <div>
              <strong>{{ g.name }}</strong>
              <span class="text-muted small ms-2">{{ g.regdate }}</span>
              <div>{{ g.message }}</div>
            </div>
            <button class="btn btn-outline-danger btn-sm" @click="del(g.id)">
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as api from "../api/guestbook";

const name = ref("");
const message = ref("");
const list = ref([]);

const load = async () => {
  list.value = (await api.list()).data;
};

const save = async () => {
  if (!name.value || !message.value) return alert("내용을 입력하세요");
  await api.insert({ name: name.value, message: message.value });
  name.value = "";
  message.value = "";
  load();
};

const del = async (id) => {
  await api.remove(id);
  load();
};

onMounted(load);
</script>
