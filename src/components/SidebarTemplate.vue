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
          <div class="sidebar-item" @click="goTo('/profil')">
            <div class="icon-container">
              <img src="@/assets/user.png" alt="" class="icon-img" />
            </div>
            <div class="sidebar-text">Profil</div>
          </div>
          <div class="sidebar-item" @click="goTo('upload')">
            <div class="icon-container">
              <img src="@/assets/plus.png" alt="" class="icon-img" />
            </div>
            <div class="sidebar-text">Kelola Laporan</div>
          </div>
          <div class="sidebar-item" @click="goTo('uploadNews')">
            <div class="icon-container">
              <img src="@/assets/camera-plus.png" alt="" class="icon-img" />
            </div>
            <div class="sidebar-text">Unggah Berita</div>
          </div>
          <div class="sidebar-item" @click="goTo('manage')">
            <div class="icon-container">
              <img src="@/assets/edit-alt.png" alt="" class="icon-img" />
            </div>
            <div class="sidebar-text">Kelola Kegiatan</div>
          </div>
          <div class="sidebar-item" @click="goTo('kelas')">
            <div class="icon-container">
              <img src="@/assets/graduation-cap.png" alt="" class="icon-img" />
            </div>
            <div class="sidebar-text">Kelas</div>
          </div>
          <div class="sidebar-item parent-item" @click="toggleSubmenu">
            <div class="icon-container">
              <img src="@/assets/menu-hamburger.png" alt="" class="icon-img" />
            </div>

            <div class="sidebar-text">Informasi</div>
            <div class="icon-container icon">
              <img :src="showSubmenu ? ChevronDown : ChevronRight" alt="" class="icon-img" />
            </div>
          </div>

          <div v-if="showSubmenu" class="submenu-wrapper">
            <div class="sidebar-item submenu" @click="goTo('infosiswa')">
              <div class="icon-container">
                <img src="@/assets/info-circle.png" alt="" class="icon-img" />
              </div>
              <div class="sidebar-text submenu">Informasi Siswa</div>
            </div>
            <div class="sidebar-item submenu" @click="goTo('infoguru')">
              <div class="icon-container">
                <img src="@/assets/info-circle.png" alt="" class="icon-img" />
              </div>
              <div class="sidebar-text submenu">Informasi Guru</div>
            </div>
          </div>
        </template>
      </div>
      <!-- Tombol logout di bawah -->
      <div v-if="isLoggedIn" class="sidebar-item-logout" @click="goTo('/logout')">
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
import { ref } from 'vue'
import { defineProps } from 'vue'
import ChevronDown from '@/assets/chevron-down-sm.png'
import ChevronRight from '@/assets/chevron-right-sm.png'

const router = useRouter()
const showSubmenu = ref(false)

const { isLoggedIn } = defineProps({
  isLoggedIn: {
    type: Boolean,
    required: true,
  },
  userName: {
    type: String,
    default: '',
  },
})

function toggleSubmenu() {
  showSubmenu.value = !showSubmenu.value
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
  background-color: #2f4036;
  display: flex;
  align-items: center;
  width: 100%;
  height: 10%;
}

.sidebar-content {
  flex: 1;
  padding-top: 10px;
  overflow-y: auto;
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
  margin: 0 0.5rem;
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
