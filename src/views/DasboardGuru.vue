<template>
  <div class="dashboard-container">
    <!-- Header -->
    <HeaderDashboard
      v-if="!isMobile || (isMobile && route.name === 'dashboardRoot')"
      :isMobile="isMobile"
      :isLoggedIn="true"
      @toggleSidebar="showSidebar = !showSidebar"
    />

    <!-- MOBILE -->
    <div v-if="isMobile" :class="['mobile-content']">
      <template v-if="route.name === 'dashboardRoot'">
        <div class="greeting">
          <p>
            Halo <strong class="user-name">{{ userName }}</strong>
          </p>
          <p>Selamat Datang</p>
        </div>
        <div class="menu-grid">
          <div class="menu-item" @click="goTo('upload')">
            <img src="@/assets/plus.png" alt="Buat Laporan" />
            <p>BUAT LAPORAN</p>
          </div>
          <div class="menu-item" @click="goTo('uploadNews')">
            <img src="@/assets/file-alt.png" alt="Unggah Berita" />
            <p>UNGGAH BERITA</p>
          </div>
          <div class="menu-item" @click="goTo('manage')">
            <img src="@/assets/edit-alt.png" alt="Kelola Kegiatan" />
            <p>KELOLA KEGIATAN</p>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="mobile-component">
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" @back="backToMobileMenu" />
            </keep-alive>
          </router-view>
        </div>
      </template>
    </div>

    <!-- DESKTOP -->
    <div v-else class="desktop-content">
      <div class="left-panel">
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
          <span>Buat Laporan</span>
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

const userName = ref(localStorage.getItem('userName') || 'User')
const isMobile = ref(window.innerWidth <= 768)
const showSidebar = ref(false)

function handleResize() {
  const wasMobile = isMobile.value
  isMobile.value = window.innerWidth <= 768

  if (wasMobile !== isMobile.value) {
    if (isMobile.value) {
      // Dari desktop → mobile
      if (route.name === 'home') {
        router.replace({ name: 'dashboardRoot' })
      }
    } else {
      // Dari mobile → desktop
      if (route.name === 'dashboardRoot' || route.name === null) {
        router.replace({ name: 'home' })
      }
    }
  }
}

function goTo(menuName) {
  router.push({ name: menuName })
}

function backToMobileMenu() {
  router.push('/dashboard')
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

  // Redirect awal
  if (isMobile.value && route.name === 'home') {
    router.replace({ name: 'dashboardRoot' })
  } else if (!isMobile.value && (route.name === null || route.name === 'dashboardRoot')) {
    router.replace({ name: 'home' })
  }
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

/* === MOBILE === */
.mobile-content {
  padding: 0;
  height: 100%;
  overflow: hidden;
  margin: 0;
  background-color: #fff;
}

.mobile-content.no-background {
  background-color: transparent;
}

.greeting p {
  padding-left: 1rem;
  color: #8b8b8b;
  margin-top: 0.3rem;
  font-weight: bold;
  font-size: 0.8rem;
}

.greeting .user-name {
  font-weight: bold;
  font-size: 1rem;
  color: #2c3930;
}

.menu-grid {
  display: flex;
  flex-direction: column;
  margin: 10px;
  gap: 16px;
}

.menu-item {
  width: 60%;
  margin: 0 auto;
  background: #a27b5c;
  color: #fff;
  border-radius: 12px;
  padding: 5px;
  text-align: center;
  cursor: pointer;
  transition: background 0.3s;
}

.menu-item:hover {
  background-color: #dea67a;
}

.menu-item img {
  width: 80px;
  height: 60px;
  object-fit: contain;
  background-color: #fff;
  border-radius: 8px;
  padding: 0.5rem;
}

.menu-item p {
  font-weight: bold;
  font-size: 1rem;
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
  height: calc(100% - 84px);
  overflow: hidden;
  padding: 0;
  margin: 0;
}

.left-panel {
  width: 175px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-right: 1px solid #2c3930;
  flex-shrink: 0;
}

.menu {
  background: #a27b5c;
  color: white;
  margin: 5px;
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

.menu span {
  font-weight: bold;
  font-size: 0.7rem;
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
  height: 40px;
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

.desktop-content .right-panel {
  height: calc(100vh - 84px);
}
</style>
