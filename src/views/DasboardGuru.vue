<template>
  <div class="dashboard-container">
    <!-- Header -->
    <HeaderDashboard
      v-if="!isMobile || (isMobile && !selectedMenu)"
      :isMobile="isMobile"
      :isLoggedIn="true"
      @toggleSidebar="showSidebar = !showSidebar"
    />

    <!-- MOBILE -->
    <div v-if="isMobile" :class="['mobile-content', { 'no-background': selectedMenu }]">
      <template v-if="!selectedMenu">
        <div class="greeting">
          <p>Halo <strong class="user-name">{{ userName }}</strong></p>
          <p>Selamat Datang</p>
        </div>
        <div class="menu-grid">
          <div class="menu-item" @click="selectMenu('laporan')">
            <img src="@/assets/plus.png" alt="Buat Laporan" />
            <p>BUAT LAPORAN</p>
          </div>
          <div class="menu-item" @click="selectMenu('uploadNews')">
            <img src="@/assets/file-alt.png" alt="Unggah Berita" />
            <p>UNGGAH BERITA</p>
          </div>
          <div class="menu-item" @click="selectMenu('manage')">
            <img src="@/assets/edit-alt.png" alt="Kelola Kegiatan" />
            <p>KELOLA KEGIATAN</p>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="mobile-component">
          <component v-if="currentMobileComponent" :is="currentMobileComponent" @back="backToMobileMenu" />
        </div>
      </template>
    </div>

    <!-- DESKTOP -->
    <div v-else class="desktop-content">
      <div class="left-panel">
        <div
          class="menu"
          :class="{ active: selectedMenu === 'home' }"
          @click="selectMenu('home')"
        >
          <div class="icon-container">
            <img src="@/assets/home-alt.png" alt="Home" />
          </div>
          <span>Halaman Utama</span>
        </div>
        <div
          class="menu"
          :class="{ active: selectedMenu === 'upload' }"
          @click="selectMenu('upload')"
        >
          <div class="icon-container">
            <img src="@/assets/plus.png" alt="Tambah Kegiatan" />
          </div>
          <span>Buat Laporan</span>
        </div>
        <div
          class="menu"
          :class="{ active: selectedMenu === 'uploadNews' }"
          @click="selectMenu('uploadNews')"
        >
          <div class="icon-container">
            <img src="@/assets/camera-plus.png" alt="Tambah Dokumentasi" />
          </div>
          <span>Unggah Berita</span>
        </div>
        <div
          class="menu"
          :class="{ active: selectedMenu === 'manage' }"
          @click="selectMenu('manage')"
        >
          <div class="icon-container">
            <img src="@/assets/edit-alt.png" alt="Kelola Kegiatan" />
          </div>
          <span>Kelola Kegiatan</span>
        </div>

        <div class="spacer"></div>

        <div class="logout" @click="logout">
          <img src="@/assets/upload-alt.png" alt="Logout" />
          <span>Logout</span>
        </div>
      </div>

      <div class="right-panel">
        <component :is="currentPageComponent" />
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import HeaderDashboard from '@/components/HeaderDashboard.vue'

import HomeContent from '@/components/MainHome.vue'
import UploadPage from '@/components/ReportForm.vue'
import UploadNewsPage from '@/components/UpNews.vue'
import ManagePage from '@/components/ManageAct.vue'

const route = useRoute()

const userName = 'User'
const isMobile = ref(window.innerWidth <= 768)
const selectedMenu = ref('home') // default halaman utama
const showMobileMenu = ref(false) // dashboard mobile menu grid

const components = {
  home: HomeContent,
  upload: UploadPage,
  uploadNews: UploadNewsPage,
  manage: ManagePage,
  laporan: UploadPage,
}

// === Komponen desktop ===
const currentPageComponent = computed(() => {
  return components[selectedMenu.value] || HomeContent
})

// === Komponen mobile ===
const currentMobileComponent = computed(() => {
  if (showMobileMenu.value) return null // kalau dashboard mobile aktif, tidak tampil konten menu
  return components[selectedMenu.value] || null
})

function handleResize() {
  const wasMobile = isMobile.value
  isMobile.value = window.innerWidth <= 768

  if (wasMobile !== isMobile.value) {
    if (isMobile.value) {
      // Pindah ke Mobile
      if (selectedMenu.value === 'home') {
        selectedMenu.value = null // khusus halaman utama, tampilkan dashboard mobile
        showMobileMenu.value = true
      } else {
        showMobileMenu.value = false
      }
    } else {
      // Pindah ke Desktop
      if (!selectedMenu.value) {
        selectedMenu.value = 'home'
      }
      showMobileMenu.value = false
    }
  }
}

// Menangani klik menu
function selectMenu(menu) {
  selectedMenu.value = menu
  if (isMobile.value) {
    showMobileMenu.value = false  // Tambahkan ini agar kontennya bisa tampil
  }
}

// Monitoring perubahan route (optional)
watch(
  () => route.name,
  (newRouteName) => {
    if (newRouteName && !isMobile.value) {
      selectedMenu.value = newRouteName
    }
  }
)

onMounted(() => {
  window.addEventListener('resize', handleResize)

  if (isMobile.value) {
    if (selectedMenu.value === 'home') {
      selectedMenu.value = null
      showMobileMenu.value = true
    }
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

function backToMobileMenu() {
  selectedMenu.value = null
  showMobileMenu.value = true
}

function logout() {
  console.log('Logout clicked')
}
</script>



<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

/* === MOBILE === */
.mobile-content {
  padding: 0;
  height: 100%;
  overflow: hidden;
  margin: 0;
  background-color: #fff;
}

.mobile-content.no-background {
  background-color: transparent; /* Kalau sudah pilih menu: transparan */
}

.greeting p {
  padding-left: 1rem;
  color:#2c3930;
  margin-top: 0.3rem;
  font-weight: bold;
}

.greeting .user-name {
  font-weight: bold;
  font-size: 1.3rem;
}

.menu-grid {
  display: flex;
  flex-direction: column;
  margin: 20px;
  gap: 16px;
}

.menu-item {
  width: 90%;
  margin: 0 auto;
  background: #a27b5c;
  color: #fff;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: background 0.3s;
}

.menu-item:hover {
  background-color: #dea67a;
}

.menu-item img {
  width: 100px;
  height: 70px;
  object-fit: contain;
  background-color: #fff;
  border-radius: 8px;
}

.menu-item p {
  font-weight: bold;
  font-size: 1.2rem;
}

.mobile-component {
  flex-grow: 1;
  overflow-y: auto;
  min-height: 0;
}

/* === DESKTOP === */
.desktop-content {
  display: flex;
  flex-grow: 1;
  height: calc(100% - 60px);
  overflow: hidden;
  padding: 0;
  margin: 0;
}

.left-panel {
  width: 300px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-right: 1px solid #2c3930;
}

.menu {
  background: #a27b5c;
  color: white;
  margin: 5px;
  height: 80px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 0 16px 0 0;
  border-radius: 12px;
  transition: background 0.3s;
  overflow: hidden;
}

.menu span {
  font-weight: bold;
  font-size: 1rem;
}

.menu.active,
.menu:hover {
  background: #dea67a;
}

.spacer {
  flex-grow: 1;
}

.icon-container {
  height: 100%;
  aspect-ratio: 1/1;
  background-color: #d9d9d9;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0;
  width: 35%;
}

.icon-container img {
  width: 50%;
  height: 50%;
  object-fit: contain;
}

.logout {
  background: #d9d9d9;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  border-radius: 12px;
  transition: background 0.3s;
  margin-top: 5rem;
  width: 100%;
  padding-left: 0;
}

.logout:hover {
  background-color: gray;
}

.logout img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.logout span {
  font-weight: bold;
  color: black;
}

.right-panel {
  width: 100%;
  height: 100vh;
  flex-grow: 1;
  background-color: #f9f9f9;
  overflow-y: auto;
  min-height: 0;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
}

.right-panel > * {
  width: 100%;
  max-width: 100%;
  height: 100%;
  max-height: 100%;
}

.right-panel > .desktop-component {
  width: 100%;
  max-width: 100%;
  height: auto;
}

.desktop-content .right-panel {
  height: calc(100vh - 60px); /* Menyesuaikan tinggi dengan tinggi layar minus header jika ada */
}
</style>
