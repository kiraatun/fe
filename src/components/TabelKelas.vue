<template>
  <div class="container">
    <!-- Mobile Header -->
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

    <div class="class-table-container">
      <div class="top-bar">
        <h1>Daftar Siswa</h1>
        <button class="add-class-button" @click="addClass">+ Tambah Kelas</button>
      </div>

      <div class="tabs">
        <button
          v-for="kelas in sortedTabs"
          :key="kelas"
          :class="['tab-button', { active: activeTab === kelas }]"
          @click="() => switchTab(kelas)"
        >
          {{ kelas }}
        </button>
      </div>

      <div class="filter-bar">
        <input
          type="text"
          placeholder="Cari nama siswa..."
          v-model="searchQuery"
          class="search-input"
        />
        <select
          :value="selectedTahunAjaran"
          @change="handleTahunAjaranChange"
          class="tahun-dropdown"
        >
          <option value="Semua">Semua Tahun Ajaran</option>
          <option v-for="tahun in tahunAjaranOptions" :key="tahun" :value="tahun">
            {{ tahun }}
          </option>
          <option value="Tambah">+ Tambah Tahun Ajaran</option>
        </select>
        <!-- Modal Tambah Tahun Ajaran -->
        <div v-if="showTambahTahunModal" class="modal-overlay">
          <div class="modal-box">
            <h2>Tambah Tahun Ajaran</h2>

            <input v-model="newTahunAjaran" type="text" placeholder="Contoh: 2025/2026" />

            <div class="modal-buttons">
              <button class="btn-cancel" @click="batalTambahTahun">Batal</button>
              <button class="btn-save" @click="simpanTahunAjaran">Simpan</button>
            </div>
          </div>
        </div>
        <button
          class="promote-button"
          v-if="!isLulusTab"
          @click="confirmPromoteOrLulus"
          :disabled="selectedStudents.length === 0"
        >
          {{ isLastRegularClass ? 'Lulus' : 'Naik Kelas' }}
        </button>
      </div>

      <div class="table-section">
        <table class="styled-table">
          <thead>
            <tr>
              <th><input type="checkbox" @change="toggleAll($event)" /></th>
              <th>No</th>
              <th>Nama</th>
              <th>NIS</th>
              <th>Tahun Ajaran</th>
              <th>Gender</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(student, index) in filteredData" :key="index">
              <td>
                <input type="checkbox" :value="student" v-model="selectedStudents" />
              </td>
              <td>{{ index + 1 }}</td>
              <td>{{ student.nama }}</td>
              <td>{{ student.nis }}</td>
              <td>{{ student.tahunAjaran }}</td>
              <td>{{ student.gender }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bottom-bar">
        <button
          class="delete-class-button"
          @click="showDeleteClass = true"
          :disabled="Object.keys(classData).length <= 1"
        >
          🗑 Hapus Kelas Ini
        </button>
      </div>
    </div>

    <div class="popup-wrapper" :style="{ zIndex: 9999 }">
      <PopupConfirm
        v-if="showConfirmPromote"
        :title="'NAIK KELAS'"
        :message="'Apakah anda yakin untuk menaikkan kelas siswa ini?'"
        :konfirmasi="'IYA'"
        :batalkan="'BATAL'"
        @confirm="saveActivity"
        @cancel="cancelSave"
      />

      <PopupConfirm
        v-if="showConfirmLulus"
        :title="'MELULUSKAN SISWA'"
        :message="'Apakah anda yakin untuk meluluskan siswa ini?'"
        :konfirmasi="'IYA'"
        :batalkan="'BATAL'"
        @confirm="lulusActivity"
        @cancel="cancelSave"
      />

      <PopupConfirm
        v-if="showDeleteClass"
        :title="'HAPUS KELAS'"
        :message="'Apakah anda yakin untuk menghpaus kelas ini?'"
        :konfirmasi="'HAPUS'"
        :batalkan="'BATAL'"
        @confirm="deleteActivity"
        @cancel="cancelSave"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import PopupConfirm from '@/components/BlokPopup.vue'

const router = useRouter()

const classData = ref({
  'Kelas A': Array.from({ length: 23 }, (_, i) => ({
    nama: `Siswa ${i + 1}`,
    nis: `00${i + 1}`,
    tahunAjaran: '2024/2025',
    gender: i % 2 === 0 ? 'Laki-laki' : 'Perempuan',
  })),
  'Kelas B': [
    { nama: 'Citra', nis: '003', tahunAjaran: '2024/2025', gender: 'Perempuan' },
    { nama: 'Dewi', nis: '004', tahunAjaran: '2024/2025', gender: 'Perempuan' },
  ],
  'Lulus TK': [
    { nama: 'Citra', nis: '003', tahunAjaran: '2024/2025', gender: 'Perempuan' },
    { nama: 'Dewi', nis: '004', tahunAjaran: '2024/2025', gender: 'Perempuan' },
  ],
})

const activeTab = ref('Kelas A')
const searchQuery = ref('')
const selectedTahunAjaran = ref('Semua')
const selectedStudents = ref([])
const showConfirmPromote = ref(false)
const showConfirmLulus = ref(false)
const showDeleteClass = ref(false)
const tahunAjaranOptions = ref(['2024/2025', '2023/2024'])
const showTambahTahunModal = ref(false)
const newTahunAjaran = ref('')

const filteredData = computed(() => {
  let data = classData.value[activeTab.value] || []

  if (searchQuery.value) {
    data = data.filter((siswa) =>
      siswa.nama.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
  }

  if (selectedTahunAjaran.value !== 'Semua') {
    data = data.filter((siswa) => siswa.tahunAjaran === selectedTahunAjaran.value)
  }

  return data
})

function promoteStudents() {
  const allKelas = sortedTabs.value.filter((k) => k !== 'Lulus TK')
  const currentIndex = allKelas.indexOf(activeTab.value)
  const nextKelas =
    currentIndex !== -1 && currentIndex < allKelas.length - 1
      ? allKelas[currentIndex + 1]
      : 'Lulus TK'

  if (!classData.value[nextKelas]) {
    classData.value[nextKelas] = []
  }

  classData.value[nextKelas].push(...selectedStudents.value)
  classData.value[activeTab.value] = classData.value[activeTab.value].filter(
    (siswa) => !selectedStudents.value.includes(siswa),
  )

  selectedStudents.value = []
}

const isLastRegularClass = computed(() => {
  const regularClasses = sortedTabs.value.filter((k) => k !== 'Lulus TK')
  return activeTab.value === regularClasses[regularClasses.length - 1]
})

const isLulusTab = computed(() => activeTab.value === 'Lulus TK')

function toggleAll(event) {
  if (event.target.checked) {
    selectedStudents.value = [...filteredData.value]
  } else {
    selectedStudents.value = []
  }
}

function switchTab(kelas) {
  activeTab.value = kelas
}

const sortedTabs = computed(() => {
  const keys = Object.keys(classData.value)
  const special = keys.filter((k) => k === 'Lulus TK')
  const regular = keys.filter((k) => k !== 'Lulus TK').sort((a, b) => a.localeCompare(b))
  return [...regular, ...special]
})

function addClass() {
  const existing = Object.keys(classData.value).filter((k) => k !== 'Lulus TK')
  let nextCharCode = 67 // 'C'
  while (existing.includes(`Kelas ${String.fromCharCode(nextCharCode)}`)) {
    nextCharCode++
  }
  const newName = `Kelas ${String.fromCharCode(nextCharCode)}`
  classData.value[newName] = []
  activeTab.value = newName
}

function deleteClass() {
  const current = activeTab.value
  const keys = Object.keys(classData.value)
  if (keys.length <= 1) return

  const index = keys.indexOf(current)
  const nextTab = keys[index === 0 ? 1 : index - 1]
  activeTab.value = nextTab
  delete classData.value[current]
}

function confirmPromoteOrLulus() {
  if (isLastRegularClass.value) {
    showConfirmLulus.value = true
  } else {
    showConfirmPromote.value = true
  }
}

function handleTahunAjaranChange(event) {
  const selected = event.target.value
  if (selected === 'Tambah') {
    showTambahTahunModal.value = true
  }
}

function simpanTahunAjaran() {
  if (newTahunAjaran.value.trim()) {
    tahunAjaranOptions.value.push(newTahunAjaran.value.trim())
    selectedTahunAjaran.value = newTahunAjaran.value.trim()
    newTahunAjaran.value = ''
    showTambahTahunModal.value = false
  }
}

function batalTambahTahun() {
  newTahunAjaran.value = ''
  showTambahTahunModal.value = false
}

function saveActivity() {
  promoteStudents()
  showConfirmPromote.value = false
}

function lulusActivity() {
  promoteStudents()
  showConfirmLulus.value = false
}

function cancelSave() {
  showConfirmPromote.value = false
  showConfirmLulus.value = false
  showDeleteClass.value = false
}

function deleteActivity() {
  deleteClass()
  showDeleteClass.value = false
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  margin: 0;
  padding: 0;
}
.page-header {
  display: none;
}

.class-table-container {
  background-color: #ffffff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  max-width: 100%;
  height: calc(100vh - 61px);
  display: flex;
  flex-direction: column;
}

/* Top Bar */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.top-bar h1 {
  margin: 0;
  color: #2c3930;
  font-size: 1.5rem;
}

.add-class-button {
  background-color: #31ce63;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.add-class-button:hover {
  background-color: #1ae04c;
}

/* Tabs */
.tabs {
  display: flex;
  border-bottom: 2px solid #cbc8c8;
  margin-bottom: 16px;
}

.tab-button {
  padding: 6px 12px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  color: #666;
  transition: all 0.2s;
}

.tab-button:hover {
  background-color: #d8e3f3;
}

.tab-button.active {
  border-bottom: 3px solid #3f8efc;
  color: #3f8efc;
  background-color: #e5e5e5;
}

.filter-bar {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 12px;
  gap: 12px;
}

.search-input {
  width: 20%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}

.tahun-dropdown {
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}

/* Overlay latar belakang */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Kotak modal */
.modal-box {
  background-color: #fff;
  width: 100%;
  max-width: 400px;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

/* Judul modal */
.modal-box h2 {
  margin-bottom: 16px;
  font-size: 18px;
  text-align: center;
  color: #2c3930;
}

/* Input */
.modal-box input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 14px;
}

/* Tombol */
.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.modal-buttons button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.modal-buttons .btn-cancel {
  background-color: #cecccc;
}

.modal-buttons .btn-save {
  background-color: #31ce63;
  color: white;
}

.modal-buttons .btn-save:hover {
  background-color: #1ae04c;
}

.promote-button {
  background-color: #4c9ef5;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  margin-left: 8px;
}

.promote-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Table */
.table-section {
  overflow-x: auto;
  flex-grow: 1;
}

.styled-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  color: #333;
}

.styled-table thead {
  background-color: #f0f4f8;
  text-align: left;
  position: sticky;
  top: 0;
  z-index: 2;
}

.styled-table th,
.styled-table td {
  padding: 10px 14px;
  border-bottom: 1px solid #e0e0e0;
  border: 1px solid #ccc;
}

.styled-table th:nth-child(1),
.styled-table td:nth-child(1) {
  width: 3%;
}

.styled-table th:nth-child(2),
.styled-table td:nth-child(2) {
  width: 3%;
}

.styled-table th:nth-child(3),
.styled-table td:nth-child(3) {
  width: 30%;
}

.styled-table th:nth-child(4),
.styled-table td:nth-child(4) {
  width: 20%;
}

.styled-table tbody tr:hover {
  background-color: #f9fafb;
  transition: background-color 0.2s;
}

/* Bottom Bar */
.bottom-bar {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.delete-class-button {
  background-color: #ff5b5b;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.delete-class-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.delete-class-button:hover:enabled {
  background-color: #e54848;
}

@media (max-width: 768px) {
  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
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
}
</style>
