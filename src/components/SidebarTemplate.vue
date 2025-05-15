<template>
  <div class="sidebar-wrapper" @click.self="$emit('close')">
    <div class="sidebar">
      <!-- Header profile -->
      <div class="profile-header">
        <label class="profile-upload">
          <img :src="profileImage" alt="User Icon" class="profile-icon" />
        </label>
        <span class="profile-name">{{ isLoggedIn ? userName : 'Tamu' }}</span>
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
            <div class="sidebar-text">Profil</div>
          </div>
          <div class="sidebar-item" @click="goTo('dashboard/home')">
            <div class="sidebar-text">Berita</div>
          </div>
          <div class="sidebar-item-logout" @click="goTo('/logout')">
            <div class="sidebar-text">Logout</div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import defaultImage from '@/assets/profil.jpeg'
import { defineProps } from 'vue'

const router = useRouter()
const userStore = useUserStore()

const profileImage = computed(() => userStore.photoUrl || defaultImage)

const { isLoggedIn, userName } = defineProps({
  isLoggedIn: {
    type: Boolean,
    required: true,
  },
  userName: {
    type: String,
    default: '',
  },
})

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
  margin-bottom: 2rem;
}

.sidebar-content {
  flex: 1;
  padding-top: 20px;
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

.profile-icon {
  width: 100%;
  height: 60px;
  background-color: #ccc;
  border-radius: 50%;
  object-fit: cover;
}

.profile-name {
  color: white;
  font-size: 20px;
  font-weight: bold;
}

.sidebar-item {
  background-color: #2f4036;
  display: flex;
  align-items: center;
  padding: 10px 30px;
  text-decoration: none;
  border-bottom: 2px solid #fff;
  cursor: pointer;
}

.sidebar-item-logout {
  background-color: #2f4036;
  display: flex;
  align-items: center;
  padding: 10px 30px;
  text-decoration: none;
  margin-top: 9rem;
  cursor: pointer;
}

.sidebar-item:hover {
  background-color: #3b5546;
}

.sidebar-item-logout:hover {
  background-color: #3b5546;
}

.icon-container {
  width: 30px;
  height: 30px;
  margin-right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon {
  width: 100%;
  height: 100%;
}

.sidebar-text {
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
}

.logout {
  margin-top: auto;
}
</style>
