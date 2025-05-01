<template>
  <div class="dashboard">
    <!-- Header -->
    <HeaderDashboard
      v-if="(!isMobile && !selectedBerita) || (isMobile && !selectedBerita)"
      :isMobile="isMobile"
      :isLoggedIn="true"
      @toggleSidebar="showSidebar = !showSidebar"
    />

    <div v-if="selectedBerita" class="page-header">
      <div class="left">
        <button class="back-button" @click="goBack">
          <img src="@/assets/arrow-left.png" alt="kembali" />
        </button>
      </div>
      <div class="center">
        <h1 class="app-title">Detail Berita</h1>
      </div>
      <div class="right"></div>
    </div>

    <!-- Main content -->
    <div class="main-content">
      <!-- Sidebar atau Back Button -->
      <div class="sidebar-area">
        <Sidebar
          v-if="showSidebar && !selectedBerita"
          :isMobile="isMobile"
          :isLoggedIn="isLoggedIn"
          :userName="userName"
          @close="showSidebar = false"
          @select="(menu) => (selectedMenu = menu)"
        />
      </div>

      <!-- Konten utama -->
      <div class="content-area">
        <div v-if="!selectedBerita" class="greeting-section">
          <div class="greeting-text">
            <p>
              Halo, <span class="user">{{ userName }}</span>
            </p>
            <p>Selamat Datang</p>
          </div>
          <div class="berita-hari-ini">
            <h3>Berita Utama</h3>
          </div>
        </div>
        <div v-if="!selectedBerita" class="berita-list">
          <div
            v-for="berita in beritaList"
            :key="berita.id"
            class="berita-item"
            @click="selectBerita(berita)"
          >
            <img :src="berita.image" alt="berita" class="berita-image" />
            <div class="berita-info">
              <h3 class="berita-title">{{ berita.title }}</h3>
              <p class="berita-subtitle">{{ berita.subtitle }}</p>
            </div>
          </div>
        </div>

        <div v-else class="berita-detail">
          <!-- Kotak Gambar + Judul + Subjudul -->
          <div class="berita-card">
            <img :src="selectedBerita.image" alt="detail" class="detail-image" />
            <div class="berita-card-text">
              <h2 class="detail-title">{{ selectedBerita.title }}</h2>
              <p class="detail-subtitle">{{ selectedBerita.subtitle }}</p>
            </div>
          </div>

          <!-- Label Deskripsi dan Box -->
          <div class="detail-description">
            <strong class="description-label">Deskripsi :</strong>
            <div class="description-box">
              <p>{{ selectedBerita.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Sidebar from '@/components/SideOrtu.vue'
import HeaderDashboard from '@/components/HeaderOrangTua.vue'

// States
const beritaList = ref([])
const selectedBerita = ref(null)

const isMobile = ref(window.innerWidth <= 768)
const showSidebar = ref(false)
const isLoggedIn = ref(true)
const userName = ref('User')
const selectedMenu = ref('')

// Dummy berita
const dummyBerita = [
  {
    id: 1,
    title: 'Berita Pertama',
    subtitle: 'Subjudul berita pertama',
    description: 'Deskripsi lengkap berita pertama.',
    image: 'https://via.placeholder.com/400x200?text=Berita+1',
  },
  {
    id: 2,
    title: 'Berita Kedua',
    subtitle: 'Subjudul berita kedua',
    description: 'Deskripsi lengkap berita kedua.',
    image: 'https://via.placeholder.com/400x200?text=Berita+2',
  },
  {
    id: 3,
    title: 'Berita Ketiga',
    subtitle: 'Subjudul berita ketiga',
    description: 'Deskripsi lengkap berita ketiga.',
    image: 'https://via.placeholder.com/400x200?text=Berita+3',
  },
]

const selectBerita = (berita) => {
  selectedBerita.value = berita
}

const goBack = () => {
  selectedBerita.value = null
}

onMounted(() => {
  beritaList.value = dummyBerita
})

window.addEventListener('resize', () => {
  isMobile.value = window.innerWidth <= 768
})
</script>

<style scoped>
.dashboard {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header saat lihat detail berita */
.page-header {
  margin-bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  background:
    linear-gradient(rgba(162, 123, 92, 0.8), rgba(162, 123, 92, 0.8)), url('@/assets/bg.png');
}

.left,
.center,
.right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.left {
  justify-content: flex-start;
}

.right {
  justify-content: flex-end;
}

.back-button img {
  width: 24px;
  height: 24px;
  filter: brightness(0) invert(1);
}

.app-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #fff;
  margin: 0 auto;
}

/* Main */
.main-content {
  display: flex;
  flex: 1;
  height: 100%;
  overflow: hidden;
  position: relative;
  flex-direction: column;
}

.content-area {
  flex: 1;
  overflow-y: auto; /* scrollable di sini */
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

/* Welcome Section */
.greeting-section {
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 10;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-bottom: 1px solid #ccc;
  margin-top: 0;
}

.greeting-text {
  font-size: 0.9rem;
  margin-bottom: 1rem;
  color: #2c3930;
  margin-left: 0.8rem;
}
.greeting-text p {
  font-weight: bold;
  color: #626262;
}

.greeting-text .user {
  font-weight: bold;
  font-size: 1rem;
  color: #2c3930;
}

.berita-hari-ini h3 {
  font-size: 0.8rem;
  font-weight: bold;
  color: #2c3930;
  margin-left: 1rem;
}

/* Berita List */
.berita-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.berita-item {
  width: 65%;
  background: #a27b5c;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
}

.berita-image {
  width: 100%;
  height: 140px;
  object-fit: cover;
}

.berita-info {
  padding: 12px;
  color: white;
}

.berita-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 4px;
}

.berita-subtitle {
  font-size: 14px;
  color: white;
}

/* Berita Detail */
.berita-detail {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 1rem;
  height: 100%;
  height: 100%;
}

/* Kartu berita */
.berita-card {
  background-color: #a27b5c;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 70%;
  margin: 0 auto;
  margin-top: 1rem;
}

.detail-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.berita-card-text {
  padding: 16px;
}

.detail-title {
  font-size: 15px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 8px;
}

.detail-subtitle {
  font-size: 16px;
  color: #cccccc;
}

/* Deskripsi */
.detail-description {
  padding: 0 1rem;
}

.description-label {
  font-size: 12px;
  color: #000;
  margin-bottom: 8px;
  display: block;
}

.description-box {
  background-color: #e0e0e0;
  color: #333;
  padding: 16px;
  border-radius: 8px;
  font-size: 10px;
  line-height: 1.5;
}

@media (min-width: 769px) {
  .berita-item {
    width: 50%;
  }
  .berita-card {
    width: 50%;
  }
}
</style>
