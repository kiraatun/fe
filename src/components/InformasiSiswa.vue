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
        <h1>Informasi Siswa</h1>
      </div>

      <div class="tabs">
        <button
          v-for="kolom in sortedTabs"
          :key="kolom"
          :class="['tab-button', { active: activeTab === kolom }]"
          @click="switchTab(kolom)"
        >
          {{ kolom === 'Registrasi' && editingIndex !== null ? 'Edit Data Siswa' : kolom }}
        </button>
      </div>

      <!-- Form Registrasi -->
      <div v-if="activeTab === 'Registrasi'" class="form-registrasi">
        <h2>{{ editingIndex !== null ? 'Form Edit Data Siswa' : 'Form Registrasi Siswa' }}</h2>
        <form @submit.prevent="submitForm">
          <!-- Data Siswa -->
          <h3 class="form-section">Data Siswa</h3>

          <div class="form-row">
            <div class="form-group">
              <label>Nama Siswa</label>
              <input v-model="form.nama" type="text" placeholder="Nama Siswa" required />
            </div>
            <div class="form-group">
              <label>Tempat & Tanggal Lahir</label>
              <div class="ttl-wrapper">
                <input v-model="form.tempatLahir" type="text" placeholder="Tempat Lahir" required />
                <input v-model="form.tanggalLahir" type="date" required />
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>NIS</label>
              <input v-model="form.nis" type="text" placeholder="NIS" required />
            </div>
            <div class="form-group">
              <label>Kelas</label>
              <input v-model="form.kelas" type="text" placeholder="Kelas" required />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Tahun Ajaran</label>
              <select v-model="form.tahunAjaran" required>
                <option disabled value="">Pilih Tahun Ajaran</option>
                <option v-for="tahun in daftarTahunAjaran" :key="tahun.id" :value="tahun.nama">
                  {{ tahun.nama }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>Gender</label>
              <select v-model="form.gender" required>
                <option disabled value="">Pilih Gender</option>
                <option>Laki-laki</option>
                <option>Perempuan</option>
              </select>
            </div>
          </div>

          <!-- Data Orang Tua -->
          <h3 class="form-section">Data Orang Tua</h3>
          <div class="form-row">
            <div class="form-group">
              <label>Nama Wali</label>
              <input v-model="form.wali" type="text" placeholder="Nama Ayah atau Ibu" required />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input
                v-model="form.email"
                type="text"
                placeholder="Contoh: admin@gmail.com"
                required
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>No Telepon</label>
              <input v-model="form.telepon" type="text" placeholder="08xxxxxxx" required />
            </div>
            <div class="form-group">
              <label>Alamat</label>
              <input v-model="form.alamat" type="text" placeholder="Alamat" required />
            </div>
          </div>

          <!-- Akun Smartkartika -->
          <h3 class="form-section">Akun Smartkartika</h3>
          <div class="form-row">
            <div class="form-group">
              <label>Username</label>
              <input v-model="form.username" type="text" placeholder="Username" required />
            </div>
            <div class="form-group">
              <label>Kode</label>
              <div class="password-wrapper">
                <input
                  v-model="form.kode"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Kode"
                  required
                />
                <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                  <img :src="showPassword ? eyeOff : eye" alt="Toggle Password" />
                </button>
              </div>
            </div>
          </div>
          <div class="form-button">
            <label></label>
            <button type="submit" class="btn-submit">
              {{ editingIndex !== null ? 'Simpan Perubahan' : 'Tambah Siswa' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Daftar Siswa -->
      <div class="table-section" v-if="activeTab === 'Daftar Siswa'">
        <div class="filter-bar">
          <input
            type="text"
            placeholder="Cari nama siswa..."
            v-model="searchQuery"
            class="search-input"
          />
        </div>
        <table class="styled-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Tanggal Lahir</th>
              <th>NIS</th>
              <th>Kelas</th>
              <th>Tahun Ajaran</th>
              <th>Gender</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(student, index) in filteredData" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ student.nama }}</td>
              <td>
                {{ student.ttl?.tempatLahir || '-' }}, {{ formatDate(student.ttl?.tanggalLahir) }}
              </td>
              <td>{{ student.nis }}</td>
              <td>{{ student.kelas }}</td>
              <td>{{ student.tahunAjaran }}</td>
              <td>{{ student.gender }}</td>
              <td>
                <button @click="editStudent(student, index)" class="btn-aksi edit">Edit</button>
                <button @click="deleteStudent(index)" class="btn-aksi delete">Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="popup-wrapper" :style="{ zIndex: 9999 }">
      <PopupConfirm
        v-if="showConfirmPromote"
        :title="'MENDAFTARKAN SISWA'"
        :message="'Apakah anda yakin untuk mendaftarkan siswa ini?'"
        :konfirmasi="'IYA'"
        :batalkan="'BATAL'"
        @confirm="saveActivity"
        @cancel="cancelSave"
      />
      <PopupConfirm
        v-if="showConfirmEdit"
        :title="'EDIT INFORMASI SISWA'"
        :message="'Apakah anda yakin untuk menyimpan perubahan informasi siswa ini?'"
        :konfirmasi="'IYA'"
        :batalkan="'BATAL'"
        @confirm="saveEdit"
        @cancel="cancelSave"
      />
      <PopupConfirm
        v-if="showConfirmDelete"
        :title="'MENGHAPUS INFORMASI SISWA'"
        :message="'Apakah anda yakin untuk menghapus informasi siswa ini?'"
        :konfirmasi="'IYA'"
        :batalkan="'BATAL'"
        @confirm="confirmDelete"
        @cancel="cancelSave"
      />
      <PopupConfirm
        v-if="showConfirmChangeTab"
        :title="'MODE EDIT'"
        :message="'Apakah anda yakin untuk berganti tab?'"
        :konfirmasi="'IYA'"
        :batalkan="'BATAL'"
        @confirm="confirmChangeTab"
        @cancel="cancelSave"
      />
      <PopupMessage
        v-if="showSuccesAdd"
        :title="'Berhasil menambahkan informasi siswa'"
        @close="cancelSave"
      />
      <PopupMessage
        v-if="showSuccesEdit"
        :title="'Berhasil mengubah informasi siswa'"
        @close="cancelSave"
      />
      <PopupMessage
        v-if="showSuccesDelete"
        :title="'Berhasil menghapus informasi siswa'"
        @close="cancelSave"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import PopupConfirm from '@/components/BlokPopup.vue'
import PopupMessage from '@/components/MessagePopup.vue'
import eye from '@/assets/eye.png'
import eyeOff from '@/assets/eye-off.png'

const router = useRouter()

const classData = ref({
  'Daftar Siswa': [],
})

const daftarTahunAjaran = ref([])
const activeTab = ref('Registrasi')
const searchQuery = ref('')
const showConfirmPromote = ref(false)
const showPassword = ref(false)
const showConfirmEdit = ref(false)
const showConfirmDelete = ref(false)
const editingIndex = ref(null)
const editingTab = ref(null)
const deletingIndex = ref(null)
const showSuccesAdd = ref(false)
const showSuccesEdit = ref(false)
const showSuccesDelete = ref(false)
const originalForm = ref(null)
const pendingTab = ref(null)
const showConfirmChangeTab = ref(false)
const form = ref({
  nama: '',
  nis: '',
  tempatLahir: '',
  tanggalLahir: '',
  gender: '',
  kelas: '',
  tahunAjaran: '',
  namaWali: '',
  email: '',
  alamat: '',
  telepon: '',
  username: '',
  kode: '',
})

onMounted(() => {
  fetchTahunAjaran()
})

async function fetchTahunAjaran() {
  try {
    const response = await axios.get('/api/tahun-ajaran') // Ganti URL sesuai backend kamu
    daftarTahunAjaran.value = response.data
  } catch (error) {
    console.error('Gagal mengambil data tahun ajaran:', error)
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const options = { day: '2-digit', month: 'long', year: 'numeric' }
  return new Date(dateStr).toLocaleDateString('id-ID', options)
}

function submitForm() {
  if (editingIndex.value !== null) {
    showConfirmEdit.value = true
  } else {
    showConfirmPromote.value = true
  }
}

const filteredData = computed(() => {
  let data = classData.value[activeTab.value] || []

  if (searchQuery.value) {
    data = data.filter((siswa) =>
      siswa.nama.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
  }
  return data
})

function switchTab(kolom) {
  if (editingIndex.value !== null && kolom !== 'Registrasi') {
    // Selalu konfirmasi saat sedang edit
    pendingTab.value = kolom
    showConfirmChangeTab.value = true
  } else {
    activeTab.value = kolom
  }
}

const sortedTabs = computed(() => {
  const keys = Object.keys(classData.value)
  const tabs = ['Registrasi', ...keys.filter((k) => k !== 'Registrasi').sort()]
  return tabs
})

function saveActivity() {
  const siswaBaru = {
    nama: form.value.nama,
    nis: form.value.nis,
    tahunAjaran: form.value.tahunAjaran || '2024/2025',
    gender: form.value.gender,
    ttl: {
      tempatLahir: form.value.tempatLahir,
      tanggalLahir: form.value.tanggalLahir,
    },
    kelas: form.value.kelas,
    orangTua: {
      wali: form.value.namaWali,
      email: form.value.email,
      alamat: form.value.alamat,
      telepon: form.value.telepon,
    },
    akun: {
      username: form.value.username,
      kode: form.value.kode,
    },
  }

  // Menyimpan ke daftar "Daftar Siswa"
  if (!classData.value['Daftar Siswa']) {
    classData.value['Daftar Siswa'] = []
  }
  classData.value['Daftar Siswa'].push(siswaBaru)

  // Reset form
  form.value = {
    nama: '',
    nis: '',
    tempatLahir: '',
    tanggalLahir: '',
    gender: '',
    kelas: '',
    tahunAjaran: '',
    namaWali: '',
    email: '',
    alamat: '',
    telepon: '',
    username: '',
    kode: '',
  }

  showConfirmPromote.value = false
  showSuccesAdd.value = true
}

function editStudent(student, index) {
  const combinedForm = { ...student, ...student.ttl, ...student.orangTua, ...student.akun }
  form.value = combinedForm
  originalForm.value = JSON.parse(JSON.stringify(combinedForm)) // Simpan data awal
  editingIndex.value = index
  editingTab.value = activeTab.value
  activeTab.value = 'Registrasi'
}

function confirmChangeTab() {
  activeTab.value = pendingTab.value
  editingIndex.value = null
  originalForm.value = null
  showConfirmChangeTab.value = false

  // Reset form agar tidak tertinggal
  form.value = {
    nama: '',
    nis: '',
    tempatLahir: '',
    tanggalLahir: '',
    gender: '',
    kelas: '',
    tahunAjaran: '',
    namaWali: '',
    email: '',
    alamat: '',
    telepon: '',
    username: '',
    kode: '',
  }
}

function saveEdit() {
  if (editingIndex.value !== null && editingTab.value) {
    classData.value[editingTab.value][editingIndex.value] = {
      nama: form.value.nama,
      nis: form.value.nis,
      ttl: {
        tempatLahir: form.value.tempatLahir,
        tanggalLahir: form.value.tanggalLahir,
      },
      gender: form.value.gender,
      kelas: form.value.kelas,
      tahunAjaran: form.value.tahunAjaran,
      orangTua: {
        wali: form.value.namaWali,
        email: form.value.email,
        alamat: form.value.alamat,
        telepon: form.value.telepon,
      },
      akun: {
        username: form.value.username,
        kode: form.value.kode,
      },
    }
    showConfirmEdit.value = false
    editingIndex.value = null
    editingTab.value = null
    activeTab.value = 'Daftar Siswa'
    showSuccesEdit.value = true
  }

  form.value = {
    nama: '',
    nis: '',
    tempatLahir: '',
    tanggalLahir: '',
    gender: '',
    kelas: '',
    tahunAjaran: '',
    namaWali: '',
    email: '',
    alamat: '',
    telepon: '',
    username: '',
    kode: '',
  }
}

function deleteStudent(index) {
  deletingIndex.value = index
  showConfirmDelete.value = true
}

function confirmDelete() {
  if (deletingIndex.value !== null) {
    classData.value[activeTab.value].splice(deletingIndex.value, 1)
    showConfirmDelete.value = false
    deletingIndex.value = null
    showSuccesDelete.value = true
  }
}

function cancelSave() {
  showConfirmPromote.value = false
  showConfirmEdit.value = false
  showConfirmDelete.value = false
  editingIndex.value = null
  deletingIndex.value = null
  showSuccesAdd.value = false
  showSuccesEdit.value = false
  showSuccesDelete.value = false
  showConfirmChangeTab.value = false
  pendingTab.value = null
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  background-color: #ffffff;
}
.page-header {
  display: none;
}

.class-table-container {
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  max-width: 100%;
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
  font-size: 1.3rem;
  font-weight: 600;
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

/* Form Registrasi */
.form-registrasi form {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  overflow-y: auto;
  padding-right: 8px;
  background: #fff;
  padding: 12px;
  color: #2c3930;
}

.form-registrasi h2 {
  color: #2c3930;
  font-weight: 700;
  font-size: 1.1rem;
}

.form-registrasi input,
.form-registrasi select {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 5rem;
  width: 70%;
  margin: 0 auto;
}

.form-group {
  flex: 1 1 30%;
  display: flex;
  flex-direction: column;
}

.form-section {
  flex-basis: 100%;
  border-top: 2px solid #ccc;
  padding-top: 10px;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 600;
}

.form-group label {
  display: flex;
  flex-direction: column;
  font-weight: 500;
  margin-bottom: 6px;
}

.ttl-wrapper {
  display: flex;
  gap: 1rem;
}

.ttl-wrapper input {
  flex: 1;
}

.form-group input:focus::placeholder {
  color: transparent;
}

.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-wrapper input {
  flex: 1;
  padding-right: 40px; /* ruang untuk tombol mata */
}

.toggle-password {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.toggle-password img {
  width: 12px;
  height: 12px;
}

.form-button {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

.btn-submit {
  padding: 10px 20px;
  background-color: #31d249;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-submit:hover {
  background-color: #27c04d;
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

.styled-table th {
  font-weight: 600;
}

.styled-table td {
  font-size: 0.8rem;
}

.styled-table th:nth-child(1),
.styled-table td:nth-child(1) {
  width: 3%;
}

.styled-table th:nth-child(2),
.styled-table td:nth-child(2) {
  width: 20%;
}

.styled-table th:nth-child(3),
.styled-table td:nth-child(3) {
  width: 15%;
}

.styled-table th:nth-child(4),
.styled-table td:nth-child(4) {
  width: 10%;
}

.styled-table th:nth-child(6),
.styled-table td:nth-child(6) {
  width: 10%;
}

.styled-table tbody tr:hover {
  background-color: #f9fafb;
  transition: background-color 0.2s;
}

.btn-aksi {
  margin-right: 6px;
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
}

.btn-aksi.edit {
  background-color: #f0c040;
  color: #fff;
}

.btn-aksi.delete {
  background-color: #e74c3c;
  color: #fff;
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

  .search-input {
    width: 50%;
  }

  .form-row {
    gap: 16px;
    width: 50%;
    margin: 0;
  }

  .form-group {
    flex: 1 1 100%;
  }

  .form-group label {
    font-size: 0.8rem;
    font-weight: 600;
  }

  .form-button {
    margin-bottom: 0;
  }
}
</style>
