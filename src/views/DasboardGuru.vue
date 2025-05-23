<template>
  <div class="dashboard-container">
    <!-- Header -->
    <HeaderDashboard
      v-if="!isMobile || (isMobile && route.name === 'dashboardRoot')"
      :isMobile="isMobile"
      :isLoggedIn="true"
      @toggleSidebar="showSidebar = !showSidebar"
    />

    <!-- DESKTOP -->
    <div class="desktop-content">
      <div v-if="!isMobile" class="left-panel">
        <div class="menu" :class="{ active: route.name === 'home' }" @click="goTo('home')">
          <div class="icon-container">
            <img src="@/assets/home-alt.png" alt="Home" />
          </div>
          <span>Halaman Utama</span>
        </div>
        <div class="menu" :class="{ active: route.name === 'upload' }" @click="goTo('upload')">
          <div class="icon-container">
            <img src="@/assets/plus.png" alt="Tambah Laporan" />
          </div>
          <span>Kelola Laporan</span>
        </div>
        <div
          class="menu"
          :class="{ active: route.name === 'uploadNews' }"
          @click="goTo('uploadNews')"
        >
          <div class="icon-container">
            <img src="@/assets/camera-plus.png" alt="Tambah Dokumentasi" />
          </div>
          <span>Unggah Berita</span>
        </div>
        <div class="menu" :class="{ active: route.name === 'manage' }" @click="goTo('manage')">
          <div class="icon-container">
            <img src="@/assets/edit-alt.png" alt="Kelola Kegiatan" />
          </div>
          <span>Kelola Kegiatan</span>
        </div>
        <div class="menu" :class="{ active: route.name === 'kelas' }" @click="goTo('kelas')">
          <div class="icon-container">
            <img src="@/assets/graduation-cap.png" alt="Kelas" />
          </div>
          <span>Kelas</span>
        </div>
        <div class="menu" @click="toggleSubmenu">
          <div class="icon-container">
            <img src="@/assets/menu-hamburger.png" alt="Informasi" />
          </div>
          <span>Informasi</span>
        </div>

        <div v-if="showSubmenu" class="submenu">
          <div
            class="menu submenu"
            :class="{ active: route.name === 'infosiswa' }"
            @click="goTo('infosiswa')"
          >
            <div class="icon-container submenu">
              <img src="@/assets/info-circle.png" alt="Info" />
            </div>
            <span>Infromasi Siswa</span>
          </div>
          <div
            class="menu submenu"
            :class="{ active: route.name === 'infoguru' }"
            @click="goTo('infoguru')"
          >
            <div class="icon-container submenu">
              <img src="@/assets/info-circle.png" alt="" />
            </div>
            <span>Informasi Guru</span>
          </div>
        </div>

        <div class="spacer"></div>

        <div class="logout" @click="logout">
          <img src="@/assets/upload-alt.png" alt="Logout" />
          <span>Logout</span>
        </div>
      </div>

      <div class="right-panel">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

import HeaderDashboard from '@/components/HeaderDashboard.vue'

const route = useRoute()
const router = useRouter()

const isMobile = ref(window.innerWidth <= 768)
const showSidebar = ref(false)
const showSubmenu = ref(false)

function handleResize() {
  const wasMobile = isMobile.value
  isMobile.value = window.innerWidth <= 768

  if (wasMobile !== isMobile.value) {
    if (!route.name) {
      router.replace({ name: 'home' })
    }
  }
}

function goTo(name) {
  showSubmenu.value = false
  router.push({ name })
}

function toggleSubmenu() {
  showSubmenu.value = !showSubmenu.value
}

async function logout() {
  try {
    const response = await axios.post('http://localhost:8000/api/logout')
    if (response.data.status === 'success') {
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('role')
      localStorage.removeItem('userName')
      router.push('/login')
    } else {
      alert('Logout gagal dari server.')
    }
  } catch (error) {
    console.error('Logout error:', error)
    alert('Logout gagal karena koneksi atau server.')
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)

  if (!route.name) {
    router.replace({ name: 'home' })
  }

  setTimeout(() => {
    router.replace({ name: 'home' })
  }, 10)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

/* === DESKTOP === */
.desktop-content {
  display: flex;
  flex-grow: 1;
  height: calc(100% - 84px);
  overflow: hidden;
  padding: 0;
  margin: 0;
}

.left-panel {
  width: 185px;
  background-color: #f9fafa;
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-right: 1px solid #2c3930;
  flex-shrink: 0;
}

.menu {
  color: #000;
  height: 40px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 0 12px 0 0;
  border-radius: 12px;
  transition: background 0.3s;
  overflow: hidden;
}

.menu.submenu {
  height: 40px;
  border-radius: 8px;
  gap: 0;
  padding: 0;
  margin-left: 1rem;
  flex-direction: row;
  border: none;
}

.menu span {
  font-weight: bold;
  font-size: 0.7rem;
}

.menu.submenu span {
  font-size: 0.6rem;
}

.menu.active,
.menu:hover {
  background: #cfd1d0;
}

.spacer {
  flex-grow: 1;
}

.icon-container {
  height: 100%;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0;
  width: 30%;
}

.icon-container.submenu {
  margin-left: 0;
  width: 28%;
  border: none;
}

.icon-container img {
  width: 40%;
  height: 40%;
  object-fit: contain;
}

.submenu {
  border-left: 2px solid #93909070;
  margin-left: 18px;
  display: flex;
  flex-direction: column;
}

.logout {
  background: #d4d2d2;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.3s;
  margin-top: 2rem;
  width: 100%;
  padding-left: 0;
}

.logout:hover {
  background-color: #b8b8b8;
}

.logout img {
  margin-left: 1rem;
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.logout span {
  font-weight: bold;
  color: black;
  font-size: 0.7rem;
}

.right-panel {
  flex-grow: 1;
  background-color: #f9f9f9;
  overflow-y: auto;
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
  height: 100%;
}
</style>
