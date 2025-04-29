<template>
  <div class="dashboard">
    <!-- Header -->

    <div v-if="selectedBerita" class="page-header">
      <div class="left">
        <button class="back-button" @click="goBack">
          <img src="@/assets/arrow-left.png" alt="kembali">
        </button>
      </div>
      <div class="center">
        <h1 class="app-title">Detail Berita</h1>
      </div>
      <div class="right">
      </div>
    </div>

    <!-- Main content -->
    <div class="main-content">
      <!-- Sidebar atau Back Button -->
      <div class="sidebar-area">
        <Sidebar
          v-if="isMobile && showSidebar && !selectedBerita"
          :isMobile="isMobile"
          :isLoggedIn="isLoggedIn"
          :userName="userName"
          @close="showSidebar = false"
          @select="menu => selectedMenu = menu"
        />
      </div>

      <!-- Konten utama -->
      <div class="content-area">

        <div v-if="!selectedBerita && userRole === 'teacher' && !isMobile" class="greeting-section">
          <p class="greeting-text">Selamat Datang, {{ userName }}</p>
          <div class="berita-hari-ini" v-if="userRole === 'teacher'">
            <h3>Berita hari ini</h3>
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
//import HeaderDashboard from '@/components/HeaderDashboard.vue'
import Sidebar from '@/components/SidebarTemplate.vue'

// States
const beritaList = ref([])
const selectedBerita = ref(null)

const isMobile = ref(window.innerWidth <= 768)
const showSidebar = ref(false)
const isLoggedIn = ref(true)
const userName = ref('User')
const selectedMenu = ref('')
const userRole = ref('teacher')

// Dummy berita
const dummyBerita = [
  {
    id: 1,
    title: 'Berita Pertama',
    subtitle: 'Subjudul berita pertama',
    description: 'Deskripsi lengkap berita pertama.',
    image: 'https://via.placeholder.com/400x200?text=Berita+1'
  },
  {
    id: 2,
    title: 'Berita Kedua',
    subtitle: 'Subjudul berita kedua',
    description: 'Deskripsi lengkap berita kedua.',
    image: 'https://via.placeholder.com/400x200?text=Berita+2'
  },
  {
    id: 3,
    title: 'Berita Ketiga',
    subtitle: 'Subjudul berita ketiga',
    description: 'Deskripsi lengkap berita ketiga.',
    image: 'https://via.placeholder.com/400x200?text=Berita+3'
  }
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  padding: 1rem;
}

.left, .center, .right {
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

.back-button img{
  width: 24px;
  height: 24px;
  filter: brightness(0) invert(1);
}

.app-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #fff;
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
  padding: 0;
}

/* Welcome Section */
.greeting-section {
  position: sticky;
  top: 0; /* agar greeting tetap sticky di atas */
  background-color: #fff;
  z-index: 10;
  padding: 1.5rem; /* beri padding pada greeting */
  min-height: 100px; /* pastikan cukup tinggi */
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-bottom: 1px solid #ccc; /* bisa tambahkan border untuk efek */
}

.greeting-text {
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #2c3930;
  margin-left: 0.8rem;
  margin-top: 1.5rem;
}

.berita-hari-ini {
  margin-bottom: 1rem;
}

.berita-hari-ini h3 {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2c3930;
  margin: 0;
  text-decoration: underline;
  margin-left: 11.5rem;
}


/* Berita List */
.berita-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.berita-item {
  width: 80%;
  background: #2c3930;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
}

.berita-image {
  width: 100%;
  height: 180px;
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
  padding: 2rem;
  height: 100%;
}

/* Kartu berita */
.berita-card {
  background-color: #2c3930;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.detail-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.berita-card-text {
  padding: 16px;
}

.detail-title {
  font-size: 20px;
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
  font-size: 16px;
  color: #000;
  margin-bottom: 8px;
  display: block;
  text-transform: lowercase;
}

.description-box {
  background-color: #e0e0e0;
  color: #333;
  padding: 16px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;
}


/* Desktop responsive */
@media (min-width: 768px) {
  .dashboard{
    height: 100%;
    min-height: calc(100vh - 60px);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .berita-item {
    width: 60%;
    margin: 0 auto;
  }
  .detail-image {
    height: 100%;
  }
  .main-content {
    height: 100%;
    box-sizing: border-box;
    min-height: calc(100vh - 60px);
    width: 100%;
    max-width: 800%;
    padding: 0;
  }
  .page-header {
    background:
      linear-gradient(rgba(44, 57, 48, 0.93), rgba(44, 57, 48, 0.93)),
      url("@/assets/bg.png");
      background-size: cover;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    padding: 1rem;
    height: 100%;
  }
}
</style>
