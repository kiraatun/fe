<template>
  <div class="dashboard">
    <!-- Header -->
    <div v-if="selectedBerita" class="page-header">
      <div class="left">
        <button class="back-button" @click="goBack">
          <img src="@/assets/arrow-left.png" alt="kembali" />
        </button>
      </div>
      <div class="center">
        <h1 class="app-title">Detail Berita</h1>
      </div>
      <div class="right"></div>
    </div>

    <HeaderDashboard
      v-if="isMobile && !selectedBerita"
      :isMobile="isMobile"
      :isLoggedIn="true"
      @toggleSidebar="showSidebar = !showSidebar"
    />

    <!-- Main content -->
    <div class="main-content">
      <div class="content-area" ref="contentArea">
        <div v-if="!selectedBerita" class="greeting-section">
          <p class="greeting-text">
            Selamat Datang, <span class="user">{{ userName }}</span>
          </p>
          <div class="berita-hari-ini">
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
            <img :src="berita.image" alt="berita" class="berita-image" loading="lazy" />
            <div class="berita-info">
              <h3 class="berita-title">{{ berita.title }}</h3>
            </div>
          </div>
        </div>

        <div v-else class="berita-detail">
          <div class="berita-card">
            <img
              :src="editForm.image"
              alt="detail"
              class="detail-image"
              @click="triggerImageUpload"
            />
            <input
              ref="imageInput"
              type="file"
              accept="image/*"
              style="display: none"
              @change="handleImageChange"
            />
            <div class="berita-card-text">
              <input v-model="editForm.title" class="input-title" />
            </div>
          </div>

          <div class="detail-description">
            <strong class="description-label">Deskripsi :</strong>
            <div class="description-box">
              <textarea v-model="editForm.description" class="textarea-description"></textarea>
            </div>
          </div>
          <button class="save-button" @click="saveChanges">Simpan Perubahan</button>
          <button class="delete-button" @click="deleteBerita">Hapus Berita</button>
        </div>
      </div>
    </div>
    <!-- Confirm Dialog -->
    <ConfirmDialog
      v-if="showConfirm"
      title="Konfirmasi Perubahan"
      message="Apakah Anda yakin ingin menyimpan perubahan?"
      :konfirmasi="'IYA'"
      :batalkan="'BATAL'"
      @close="showConfirm = false"
      @confirm="handleConfirmSave"
    />

    <!-- Success Dialog -->
    <SuccessDialog
      v-if="showSuccess"
      title="Berhasil"
      message="Perubahan berhasil disimpan!"
      @close="showSuccess = false"
    />
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import HeaderDashboard from '@/components/HeaderDashboard.vue'
import ConfirmDialog from '@/components/BlokPopup.vue'
import SuccessDialog from '@/components/MessagePopup.vue'

const beritaList = ref([])
const selectedBerita = ref(null)
const isMobile = ref(window.innerWidth <= 768)
const showSidebar = ref(false)
const userName = ref(localStorage.getItem('userName') || 'User')
const imageInput = ref(null)
const showConfirm = ref(false)
const showSuccess = ref(false)
const page = ref(1)
const itemsPerPage = 3
const isLoading = ref(false)
const contentArea = ref(null)
const editForm = ref({
  title: '',
  subtitle: '',
  description: '',
  image: '',
})

const dummyBerita = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  title: `Berita ${i + 1}`,
  subtitle: `Subjudul berita ${i + 1}`,
  description: `Deskripsi lengkap berita ${i + 1}.`,
  image: `https://via.placeholder.com/400x200?text=Berita+${i + 1}`,
}))

const loadMoreBerita = () => {
  if (isLoading.value) return
  isLoading.value = true

  setTimeout(() => {
    const start = (page.value - 1) * itemsPerPage
    const end = page.value * itemsPerPage
    const nextItems = dummyBerita.slice(start, end)
    beritaList.value = [...beritaList.value, ...nextItems]
    page.value++
    isLoading.value = false
  }, 300)
}

const handleScroll = () => {
  const el = contentArea.value
  if (!el) return

  const bottomReached = el.scrollTop + el.clientHeight >= el.scrollHeight - 10

  if (bottomReached && beritaList.value.length < dummyBerita.length) {
    loadMoreBerita()
  }
}

onMounted(() => {
  fetchBerita()
  contentArea.value?.addEventListener('scroll', handleScroll)
})

const fetchBerita = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/documentations')
    beritaList.value = response.data.data.map((item) => ({
      id: item.id_document,
      title: item.title,
      description: item.description,
      image: item.file_url, // URL dari backend
    }))
    console.log(beritaList.value) // Log data untuk memastikan URL benar
  } catch (error) {
    console.error('Gagal memuat berita:', error)
  }
}

const selectBerita = (berita) => {
  selectedBerita.value = berita
  editForm.value = {
    id: berita.id, // penting agar axios.put punya ID!
    title: berita.title,
    description: berita.description,
    image: berita.image,
  }
}

const goBack = () => {
  selectedBerita.value = null
}

const saveChanges = () => {
  Object.assign(selectedBerita.value, editForm.value)
  showConfirm.value = true
}

const triggerImageUpload = () => {
  imageInput.value.click()
}

const handleImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      editForm.value.image = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

window.addEventListener('resize', () => {
  isMobile.value = window.innerWidth <= 768
})

const deleteBerita = async () => {
  try {
    await axios.delete(`http://localhost:8000/api/documentations/${selectedBerita.value.id}`)
    beritaList.value = beritaList.value.filter((b) => b.id !== selectedBerita.value.id)
    selectedBerita.value = null
    alert('Berita berhasil dihapus!')
  } catch (error) {
    alert('Gagal menghapus berita')
    console.error(error)
  }
}

const handleConfirmSave = async () => {
  try {
    await axios.put(`http://localhost:8000/api/documentations/${selectedBerita.value.id}`, {
      title: editForm.value.title,
      description: editForm.value.description,
    })
    showSuccess.value = true
    showConfirm.value = false
  } catch (error) {
    alert('Gagal memperbarui berita')
  }
}
</script>

<style scoped>
.dashboard {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background:
    linear-gradient(rgba(44, 57, 48, 0.93), rgba(44, 57, 48, 0.93)), url('@/assets/bg.png');
}

/* Header saat lihat detail berita */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
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
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  width: 24px;
  height: 24px;
}

.app-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #fff;
  margin: 0 auto;
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
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

/* Welcome Section */
.greeting-section {
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 10;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-bottom: 1px solid #ccc;
}

.greeting-text {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #8b8b8b;
  margin-left: 0.8rem;
}

.greeting-section .user {
  color: #2c3930;
  font-weight: bold;
  font-size: 1.1rem;
}
.berita-hari-ini h3 {
  font-size: 0.9rem;
  font-weight: bold;
  color: #000;
  margin-left: 0.8rem;
}

/* Berita List */
.load-more-trigger {
  height: 1px;
}
.loading-text {
  text-align: center;
  font-size: 14px;
  padding: 1rem;
  color: #888;
}

.berita-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 1rem;
}

.berita-item {
  width: 70%;
  background: #2c3930;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
}

.berita-image {
  width: 100%;
  height: 200px;
  max-height: 200px;
}

.berita-info {
  padding: 12px;
  color: white;
}

.berita-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 4px;
}

/* Berita Detail */
.berita-detail {
  display: flex;
  flex-direction: column;
  height: 70%;
  padding: 0.5rem;
  gap: 10px;
}

.berita-card {
  background-color: #2c3930;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 70%;
  margin: 0 auto;
  height: 100%;
  margin-bottom: 0;
}

.detail-image {
  width: 100%;
  height: 150px;
  max-height: 150px;
  border-radius: 12px;
  margin-bottom: 0;
}

.berita-card-text {
  padding: 14px;
}

.detail-title {
  font-size: 12px;
  font-weight: bold;
  color: #ffffff;
}

/* Deskripsi */
.detail-description {
  padding: 0 1rem;
}

.description-label {
  font-size: 12px;
  color: #000;
  margin-bottom: 8px;
  display: block;
}

.input-image {
  cursor: pointer;
  display: block;
  width: 100%;
  border-radius: 4px;
  border: 1px solid #2c3930;
  background-color: #2c3930;
  color: white;
  transition:
    border-color 0.3s ease,
    background-color 0.3s ease;
}

.input-title {
  font-weight: bold;
  margin-left: 0;
  margin-top: 0;
  display: block;
  width: 100%;
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #2c3930;
  background-color: #2c3930;
  color: white;
  transition:
    border-color 0.3s ease,
    background-color 0.3s ease;
}

.textarea-description {
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 4px;
  border: 1px solid #8b8b8b;
  background-color: #cdcdcd;
  color: black;
  transition:
    border-color 0.3s ease,
    background-color 0.3s ease;
  width: 100%;
}

.input-title:focus,
.input-image:focus,
.textarea-description:focus {
  background-color: #ffffff;
  color: #000;
  border-color: #1e2a22;
  outline: none;
}

.save-button {
  background-color: #2c3930;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  width: 40%;
  margin: 0 auto;
  margin-top: 2rem;
}

.save-button:hover {
  background-color: #1e2a22;
}
/* Desktop responsive */
@media (min-width: 768px) {
  .dashboard {
    height: 100%;
    min-height: calc(100vh - 84px);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .page-header {
    background: none;
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    margin-bottom: 0;
  }
  .back-button {
    filter: invert(1);
  }
  .app-title {
    color: #2c3930;
  }
  .berita-item {
    width: 50%;
    margin: 0 auto;
  }
  .main-content {
    height: 100%;
    box-sizing: border-box;
    min-height: calc(100vh - 73px);
    width: 100%;
    max-width: 800%;
    padding: 0;
  }
  .input-title {
    font-size: 1rem;
  }
  .berita-card {
    width: 40%;
  }
  .save-button {
    margin-top: 1rem;
    width: 30%;
  }
}
</style>
