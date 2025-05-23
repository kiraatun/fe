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
          <!-- Area atas berisi tombol save -->
          <div class="detail-header">
            <button class="save-button" @click="saveChanges">Simpan Perubahan</button>
          </div>

          <!-- Isi konten berita -->
          <div class="detail-content">
            <!-- Gambar -->
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
            </div>

            <!-- Deskripsi -->
            <div class="detail-description">
              <!-- Judul -->
              <div class="berita-card-text">
                <input v-model="editForm.title" class="input-title" placeholder="Judul berita" />
              </div>
              <div class="description-box">
                <textarea
                  v-model="editForm.description"
                  class="textarea-description"
                  placeholder="Deskripsi berita"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Area bawah berisi tombol hapus -->
          <div class="detail-footer">
            <button class="delete-button" @click="deleteBerita">Hapus Berita</button>
          </div>
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

    <ConfirmDialog
      v-if="showConfirmDelete"
      title="Konfirmasi Hapus Berita"
      message="Apakah Anda yakin ingin menghapus berita ini?"
      :konfirmasi="'IYA'"
      :batalkan="'BATAL'"
      @close="showConfirmDelete = false"
      @confirm="handleConfirmDelete"
    />

    <!-- Success Dialog -->
    <SuccessDialog
      v-if="showSuccess"
      title="Perubahan Berhasil Disimpan"
      @close="showSuccess = false"
    />

    <SuccessDialog v-if="showFail" title="Perubahan Gagal Disimpan" @close="showFail = false" />
    <SuccessDialog
      v-if="showSuccessDelete"
      title="Beita Berhasil Dihapus"
      @close="showSuccessDelete = false"
    />

    <SuccessDialog
      v-if="showFailDelete"
      title="Gagal Menghapus Berita"
      @close="showFailDelete = false"
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
const showConfirmDelete = ref(false)
const showSuccessDelete = ref(false)
const showFailDelete = ref(false)
const showFail = ref(false)
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

const nipGuru = localStorage.getItem('nip')

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
  //fetchBerita()
  beritaList.value = dummyBerita.slice(0, itemsPerPage)
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

const deleteBerita = () => {
  showConfirmDelete.value = true
}

const handleConfirmDelete = async () => {
  try {
    await axios.delete(`http://localhost:8000/api/documentations/${selectedBerita.value.id}`)
    beritaList.value = beritaList.value.filter((b) => b.id !== selectedBerita.value.id)
    selectedBerita.value = null
    showSuccessDelete.value = true
  } catch (error) {
    showFailDelete.value = true
    console.error(error)
  } finally {
    showConfirmDelete.value = false
  }
}

const handleConfirmSave = async () => {
  try {
    await axios.put(`http://localhost:8000/api/documentations/${selectedBerita.value.id}`, {
      title: editForm.value.title,
      description: editForm.value.description,
      nip: nipGuru,
    })
    showSuccess.value = true
  } catch (error) {
    showFail.value = true
    console.error(error)
  } finally {
    showConfirm.value = false
  }
}

const goBack = () => {
  selectedBerita.value = null
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
  min-height: calc(100vh - 130px);
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
  margin-bottom: 1.5rem;
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
  box-shadow: 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  border-radius: 8px;
}

.berita-image {
  width: 100%;
  height: 350px;
  max-height: 350px;
  border-radius: 8px;
  object-fit: cover;
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
  height: 100%;
  padding: 1rem;
  background-color: #fff;
}

.detail-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.5rem;
}

.detail-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.berita-card {
  width: 90%;
  max-width: 600px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.detail-image {
  width: 100%;
  height: 350px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
}

.detail-description {
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  border: none;
  margin-left: 1.5rem;
}

.input-title {
  font-size: 1rem;
  font-weight: 600;
  width: 100%;
  background-color: #fff;
  color: #000;
  border: none;
  padding: 0.5rem;
}

.textarea-description {
  width: 400px;
  font-size: 0.8rem;
  min-height: 100px;
  padding: 0.5rem;
  border: none;
  resize: vertical;
  color: #7a7878;
}

.input-title:focus,
.textarea-description:focus {
  border-radius: 6px;
  outline: none;
  border: none;
  background-color: #ededed;
}

/* Tombol hapus di bawah kanan */
.detail-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
  padding-top: 1rem;
}

/* Optional perbaikan layout */
.save-button {
  background-color: #31d249;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  width: 30%;
  font-size: 0.8rem;
}

.delete-button {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.8rem;
  width: 30%;
  margin-bottom: 1rem;
}

/* Desktop responsive */
@media (min-width: 768px) {
  .dashboard {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 84px);
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
  .back-button img {
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
    box-sizing: border-box;
    min-height: calc(100vh - 130px);
    width: 100%;
    max-width: 800%;
    padding: 0;
    overflow-y: auto;
  }
  .input-title {
    font-size: 1rem;
  }
  .berita-card {
    width: 40%;
  }
  .save-button {
    margin-top: 1rem;
    width: 15%;
  }
}
</style>
