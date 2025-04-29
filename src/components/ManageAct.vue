<template>
  <div class="container">
    <!-- Header -->
    <div class="page-header">
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
      <!-- Default View: Menu List -->
      <template v-if="!isDesktop || !currentSubMenu">
        <div class="menu-area">
          <h2 class="subtitle">KELOLA KEGIATAN</h2>

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
      </template>

      <!-- Submenu View (only on desktop) -->
      <template v-else>
        <AddKegiatan v-if="currentSubMenu === 'add'" />
        <EditKegiatan v-if="currentSubMenu === 'edit'" />
        <RemoveKegiatan v-if="currentSubMenu === 'remove'" />
      </template>
    </main>
  </div>
</template>

<script setup>
import { ref, /*computed*/ onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AddKegiatan from '@/components/AddAct.vue'
import EditKegiatan from '@/components/EditAct.vue'
import RemoveKegiatan from '@/components/RemoveAct.vue'

const router = useRouter()

const currentSubMenu = ref(null)
const isDesktop = ref(false)

const checkIsDesktop = () => {
  isDesktop.value = window.innerWidth >= 768
}

onMounted(() => {
  checkIsDesktop()
  window.addEventListener('resize', () => {
    const wasDesktop = isDesktop.value
    checkIsDesktop()

    if (!isDesktop.value && wasDesktop && currentSubMenu.value) {
      router.push(`/${currentSubMenu.value}`)
    }

    if (isDesktop.value && !wasDesktop) {
      const path = router.currentRoute.value.path.replace('/', '')
      if (['add', 'edit', 'remove'].includes(path)) {
        currentSubMenu.value = path
      }
    }
  })
})

const goBack = () => {
  router.push('/dashboard')
}

const handleMenuClick = (menu) => {
  if (isDesktop.value) {
    currentSubMenu.value = menu
  } else {
    router.push(`/${menu}`)
  }
}
</script>

<style scoped>
/* Container full height */
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

/* Header */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  padding: 1rem;
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
  font-style: italic;
  font-weight: bold;
  color: #fff;
}

/* Main Content */
.content {
  flex: 1;
  padding: 1.5rem 1rem;
  height: 100%;
}

.subtitle {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 2rem;
  font-weight: bold;
}

/* Menu List */
.menu-list {
  display: flex;
  flex-direction: column;
  margin: 20px;
  gap: 16px;
}

/* Menu Item */
.menu-item {
  width: 80%;
  margin: 0 auto;
  background: #a27b5c;
  color: #fff;
  border-radius: 12px;
  padding: 20px;
  padding-bottom: 0.5rem;
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
  width: 30%;
  height: 60%;
  margin: 0 auto;
}

.icon img {
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 8px;
  margin: 0 auto;
  margin-top: 0.5rem;
}
.menu-text {
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 2rem;
}

/* Responsive for desktop */
@media (min-width: 768px) {
  .page-header {
    display: none;
  }

  .container {
    min-height: calc(100vh - 60px);
    height: 100%;
  }

  .content {
    box-sizing: border-box;
    min-height: calc(100vh - 60px);
    height: 100%;
    width: 100%;
    max-width: 800%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    padding: 1rem 2rem;
    display: flex;
  }

  .subtitle {
    text-align: start;
    padding-bottom: 2rem;
    font-size: 2rem;
  }

  .menu-list {
    flex-direction: row;
    justify-content: center;
    width: 90%;
    padding: 1rem;
    margin: 0 auto;
  }

  .menu-item {
    width: 100%;
  }

  .icon {
    width: 40%;
    height: 50%;
    margin: 0 auto;
    margin-top: 0.5rem;
  }

  .icon img {
    width: 60%;
    height: 50%;
    margin-top: 1rem;
  }
}
</style>
