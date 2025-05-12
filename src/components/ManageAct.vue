<template>
  <div v-if="!currentSubMenu" class="container">
    <!-- Header -->
    <div v-if="!currentSubMenu" class="header-page">
      <div class="left">
        <button class="back-button" @click="goBack">
          <img src="@/assets/arrow-left.png" alt="Kembali" />
        </button>
      </div>
      <div class="center">
        <h1 class="app-title">Smartkartika</h1>
      </div>
      <div class="right"></div>
    </div>

    <!-- Konten -->
    <main class="content">
      <!-- Menu Daftar kegiatan hanya tampil ketika tidak ada submenu yang aktif -->
      <p v-if="!currentSubMenu" class="subtitle">KELOLA KEGIATAN</p>
      <div v-if="!currentSubMenu" class="menu-area">
        <div class="menu-list">
          <div class="menu-item" @click="handleMenuClick('add')">
            <div class="icon">
              <img src="@/assets/edit.png" alt="Tambah Kegiatan" />
            </div>
            <span class="menu-text">TAMBAH KEGIATAN</span>
          </div>

          <div class="menu-item" @click="handleMenuClick('edit')">
            <div class="icon">
              <img src="@/assets/edit-alt.png" alt="Edit Kegiatan" />
            </div>
            <span class="menu-text">EDIT KEGIATAN</span>
          </div>

          <div class="menu-item" @click="handleMenuClick('remove')">
            <div class="icon">
              <img src="@/assets/trash-alt.png" alt="Hapus Kegiatan" />
            </div>
            <span class="menu-text">HAPUS KEGIATAN</span>
          </div>
        </div>
      </div>

      <!-- Tampilan Konten Submenu di Panel Kanan -->
    </main>
  </div>
  <div v-if="currentSubMenu" class="submenu-fullscreen">
    <template v-if="currentSubMenu">
      <div class="submenu-container">
        <AddKegiatan
          v-if="currentSubMenu === 'add'"
          @submenu-select="selectSubMenu"
          @back="handleSubMenuBack"
        />
        <EditKegiatan
          v-else-if="currentSubMenu === 'edit'"
          @submenu-select="selectSubMenu"
          @back="handleSubMenuBack"
        />
        <RemoveKegiatan
          v-else-if="currentSubMenu === 'remove'"
          @submenu-select="selectSubMenu"
          @back="handleSubMenuBack"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AddKegiatan from '@/components/AddAct.vue'
import EditKegiatan from '@/components/EditAct.vue'
import RemoveKegiatan from '@/components/RemoveAct.vue'

const router = useRouter()
const route = useRoute()
const emit = defineEmits(['submenu-select', 'back'])

const props = defineProps({
  currentSubMenu: String,
})
const currentSubMenu = ref(props.currentSubMenu)
const isDesktop = ref(window.innerWidth >= 768)

function updateFromRoute() {
  const submenu = route.params.submenu
  if (['add', 'edit', 'remove'].includes(submenu)) {
    currentSubMenu.value = submenu
  } else {
    currentSubMenu.value = null
  }
}

function handleResize() {
  const wasDesktop = isDesktop.value
  isDesktop.value = window.innerWidth >= 768

  if (wasDesktop !== isDesktop.value) {
    if (isDesktop.value) {
      // Dari mobile ke desktop
      if (currentSubMenu.value) {
        router.replace({ path: `/kelola/${currentSubMenu.value}` })
      }
    } else {
      if (currentSubMenu.value) {
        router.push(`/${currentSubMenu.value}`)
      }
    }
  }
}

const goBack = () => {
  emit('back')
}
function selectSubMenu(submenu) {
  currentSubMenu.value = submenu
}
function handleSubMenuBack() {
  currentSubMenu.value = null
}

function handleMenuClick(menu) {
  currentSubMenu.value = menu
  emit('submenu-select', menu)
}

onMounted(() => {
  updateFromRoute()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

watch(
  () => props.currentSubMenu,
  (val) => {
    currentSubMenu.value = val
  },
)
</script>

<style scoped>
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

.header-page {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  background:
    linear-gradient(rgba(44, 57, 48, 0.93), rgba(44, 57, 48, 0.93)), url('@/assets/bg.png');
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

.back-button {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.app-title {
  font-size: 1.3rem;
  font-style: italic;
  font-weight: bold;
  color: #fff;
}

.content {
  flex: 1;
  height: 100%;
  display: block;
}

.subtitle {
  text-align: center;
  font-size: 1.3rem;
  font-weight: bold;
  color: #2c3930;
  margin-bottom: 1rem;
}

.menu-area {
  display: flex;
  justify-content: center;
}

.menu-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 1rem;
}

.menu-item {
  width: 100%;
  max-width: 300px;
  background: #a27b5c;
  color: #fff;
  border-radius: 12px;
  padding: 18px;
  text-align: center;
  cursor: pointer;
  transition: background 0.3s;
}

.menu-item:hover {
  background-color: #dea67a;
}

.icon {
  background-color: #fff;
  border-radius: 10px;
  width: 60%;
  margin: 0 auto 0.5rem;
  padding: 0.5rem;
}

.icon img {
  width: 30px;
  height: 30px;
  object-fit: contain;
}

.menu-text {
  font-size: 1rem;
  font-weight: bold;
}

/* Tampilan Desktop */
@media (min-width: 768px) {
  .header-page {
    display: none;
  }

  .container {
    min-height: 100%;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    display: block;
  }

  .subtitle {
    font-size: 1.5rem;
    text-align: left;
    margin-bottom: 2rem;
  }

  .desktop-layout {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 2rem;
    padding: 2rem;
  }

  .menu-list {
    flex-direction: row;
    padding: 0;
    gap: 2rem;
    margin-bottom: 0;
    width: 70%;
  }

  .menu-item {
    width: 100%;
  }
}
</style>
