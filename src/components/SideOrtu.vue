<template>
  <div class="sidebar-wrapper" @click.self="$emit('close')">
    <div class="sidebar">
      <!-- Header profile -->
      <div class="profile-header">
        <span class="profile-name">Smartkartika</span>
      </div>

      <!-- Menu -->
      <div class="sidebar-content">
        <template v-if="!isLoggedIn">
          <div class="sidebar-item" @click="goTo('/login')">
            <div class="sidebar-text">Log In</div>
          </div>
        </template>

        <template v-else>
          <div class="sidebar-item" @click="goTo('/profilp')">
            <div class="icon-container">
              <img src="@/assets/user.png" alt="" class="icon-img" />
            </div>
            <div class="sidebar-text">Profil</div>
          </div>
          <div class="sidebar-item" @click="goTo('/rapor')">
            <div class="icon-container">
              <img src="@/assets/file-alt.png" alt="" class="icon-img" />
            </div>
            <div class="sidebar-text">Laporan Siswa</div>
          </div>
          <div class="sidebar-item" @click="goTo('/viewkegiatan')">
            <div class="icon-container">
              <img src="@/assets/edit-alt.png" alt="" class="icon-img" />
            </div>
            <div class="sidebar-text">Kegiatan</div>
          </div>
        </template>
      </div>
      <!-- Tombol logout di bawah -->
      <div v-if="isLoggedIn" class="sidebar-item-logout" @click="logout">
        <div class="icon-container">
          <img src="@/assets/upload-alt.png" alt="" class="icon-img" />
        </div>
        <div class="sidebar-text logout">Logout</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { defineProps } from 'vue'
import axios from 'axios'

const router = useRouter()

const { isLoggedIn } = defineProps({
  isLoggedIn: {
    type: Boolean,
    required: true,
  },
})

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

function goTo(route) {
  router.push(route)
}
</script>

<style scoped>
.sidebar-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4); /* efek backdrop */
  z-index: 99;
  display: flex;
}

.sidebar {
  width: 200px;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.2);
  z-index: 100;
  transition: transform 0.3s ease-in-out;
  transform: translateX(0);
}

.profile-header {
  padding: 10px;
  background-color: #a27b5c;
  display: flex;
  align-items: center;
  width: 100%;
  height: 10%;
}

.sidebar-content {
  flex: 1;
  padding-top: 10px;
  overflow-y: auto;
  margin-top: 1rem;
  margin-right: 0.5rem;
  margin-left: 0.5rem;
}

.sidebar-wrapper-enter-active,
.sidebar-wrapper-leave-active {
  transition: opacity 0.3s ease;
}

.sidebar-wrapper-enter-from,
.sidebar-wrapper-leave-to {
  opacity: 0;
}

.profile-name {
  color: white;
  font-size: 15px;
  font-weight: bold;
}

.sidebar-item {
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 10px 20px;
  text-decoration: none;
  cursor: pointer;
  color: #000;
  margin-bottom: 0.7rem;
}

.sidebar-item-logout {
  background-color: #d4d2d2;
  display: flex;
  align-items: center;
  padding: 10px 30px;
  text-decoration: none;
  cursor: pointer;
  margin: 0.5rem;
  border-radius: 10px;
}

.sidebar-item:hover {
  border-radius: 10px;
  background-color: #cfd1d0;
}

.sidebar-item-logout:hover {
  background-color: #b8b8b8;
}

.icon-container {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  display: flex;
  align-items: center;
}

.icon-container.icon {
  margin-left: 2.4rem;
}

.icon-img {
  width: 100%;
  max-height: 14px;
  object-fit: contain;
}

.sidebar-text {
  color: #000;
  font-size: 12px;
  font-weight: 500;
}

.sidebar-text.submenu {
  font-size: 11px;
}

.sidebar-text.logout {
  font-weight: bold;
}

.sidebar-text:hover {
  font-weight: bold;
}

.submenu-wrapper {
  border-left: 2px solid #93909070;
  margin-left: 25px;
  display: flex;
  flex-direction: column;
}
</style>
