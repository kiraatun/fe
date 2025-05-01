<template>
  <div class="container">
    <div class="page-header">
      <div class="left">
        <button class="back-button" @click="goBack">
          <img src="@/assets/arrow-left.png" alt="kembali" />
        </button>
      </div>
      <div class="center">
        <h1 class="app-title">Rapor</h1>
      </div>
      <div class="right"></div>
    </div>

    <div class="content">
      <p class="description">Unduh e-rapot untuk untuk melihat perkembangan anak anda</p>

      <!-- Dropdown kelas & semester -->
      <div class="option-wrapper">
        <div class="select-group">
          <label for="kelas">Kelas</label>
          <select id="kelas" v-model="selectedKelas">
            <option value="" disabled>Pilih Kelas</option>
            <option v-for="kelas in kelasOptions" :key="kelas.id" :value="kelas.id">
              {{ kelas.nama }}
            </option>
          </select>
        </div>

        <div class="select-group">
          <label for="semester">Semester</label>
          <select id="semester" v-model="selectedSemester">
            <option value="" disabled>Pilih Semester</option>
            <option v-for="smt in semesterOptions" :key="smt.id" :value="smt.id">
              {{ smt.nama }}
            </option>
          </select>
        </div>
      </div>

      <!-- Tombol Unduh -->
      <button class="download-button" @click="openConfirmPopup">UNDUH E-RAPOT</button>
    </div>

    <!-- Popup Konfirmasi -->
    <ConfirmPopup
      v-if="showConfirm"
      title="UNDUH E-RAPOT"
      message="Apakah Anda yakin ingin mengunduh e-rapot?"
      :konfirmasi="'IYA'"
      :batalkan="'BATAL'"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ConfirmPopup from '@/components/BlokPopup.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const showConfirm = ref(false)
const selectedKelas = ref('')
const selectedSemester = ref('')
const kelasOptions = ref([])
const semesterOptions = ref([])

const openConfirmPopup = () => {
  showConfirm.value = true
}

const handleConfirm = () => {
  showConfirm.value = false
  // Lanjutkan logika unduh e-rapot di sini
}

const handleCancel = () => {
  showConfirm.value = false
}

// Simulasi ambil data dari backend
const fetchKelas = async () => {
  return [
    { id: '1', nama: 'Kelas 1' },
    { id: '2', nama: 'Kelas 2' },
    { id: '3', nama: 'Kelas 3' },
  ]
}

const fetchSemester = async () => {
  return [
    { id: '1', nama: 'Semester 1' },
    { id: '2', nama: 'Semester 2' },
  ]
}

const fetchOptions = async () => {
  kelasOptions.value = await fetchKelas()
  semesterOptions.value = await fetchSemester()
}

onMounted(() => {
  fetchOptions()
})

const goBack = () => {
  router.push('/dashboardortu')
}
</script>

<style scope>
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-header {
  margin-bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  background:
    linear-gradient(rgba(162, 123, 92, 0.8), rgba(162, 123, 92, 0.8)), url('@/assets/bg.png');
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
  font-weight: bold;
  color: #fff;
  margin: 0 auto;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: #fff;
  border-radius: 0;
}

.description {
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

/* Dropdown Options */
.option-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  width: 100%;
  max-width: 400px;
}

.select-group {
  display: flex;
  flex-direction: column;
}

.select-group label {
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.3rem;
  color: #444;
}

.select-group select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  background-color: #f9f9f9;
}

.download-button {
  background-color: #2e3a32;
  color: #fff;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 3rem;
}

.download-button:hover {
  background-color: #1f2822;
}
/* Responsive: desktop layout kanan-kiri */
@media (min-width: 768px) {
  .description {
    margin-bottom: 3rem;
  }
  .option-wrapper {
    flex-direction: row;
    justify-content: center;
    gap: 2rem;
  }

  .select-group {
    width: 100%;
  }
}
</style>
