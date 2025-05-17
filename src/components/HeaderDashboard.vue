<template>
  <header class="header">
    <!-- Tombol garis tiga hanya muncul di mobile -->
    <button class="hamburger" @click="toggleSidebar" v-if="isMobile">☰</button>

    <SidebarTemplate
      v-if="isMobile && showSidebar && !selectedMenu"
      :isMobile="isMobile"
      :isLoggedIn="isLoggedIn"
      :userName="userName"
      @close="closeSidebar"
      @select="handleSelect"
    />

    <h1 class="app-name">Smartkartika</h1>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import SidebarTemplate from '@/components/SidebarTemplate.vue'

defineProps({ isMobile: Boolean, isLoggedIn: Boolean })

const showSidebar = ref(false)
const selectedMenu = ref(null)
const userName = ref('')

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value
}

const closeSidebar = () => {
  showSidebar.value = false
}

const handleSelect = (menu) => {
  selectedMenu.value = menu
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 16px;
  color: white;
  position: relative;
  margin-bottom: 0;
}

.hamburger {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  margin-right: 12px;
  cursor: pointer;
  font-weight: bold;
}

.app-name {
  font-style: italic;
  font-size: 24px;
  font-weight: bold;
}

@media (min-width: 769px) {
  .header {
    justify-content: flex-start;
  }
  .app-name {
    font-size: 1.6rem;
    font-style: italic;
    margin: 0;
    text-align: left;
  }
}
</style>
