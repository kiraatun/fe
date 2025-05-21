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
        <h1>Informasi Guru</h1>
      </div>

      <div class="tabs">
        <button
          v-for="kolom in sortedTabs"
          :key="kolom"
          :class="['tab-button', { active: activeTab === kolom }]"
          @click="switchTab(kolom)"
        >
          {{ kolom === 'Registrasi' && editingIndex !== null ? 'Edit Data Guru' : kolom }}
        </button>
      </div>

      <!-- Form Registrasi -->
      <div v-if="activeTab === 'Registrasi'" class="form-registrasi">
        <h2>{{ editingIndex !== null ? 'Form Edit Data Guru' : 'Form Registrasi Guru' }}</h2>
        <form @submit.prevent="submitForm">
          <!-- Data Guru -->
          <h3 class="form-section">Data Guru</h3>

          <div class="form-group-row">
            <label>Nama Guru</label>
            <input v-model="form.nama" type="text" placeholder="Nama Guru" required />
          </div>

          <div class="form-group-row">
            <label>NIP</label>
            <input v-model="form.nip" type="text" placeholder="NIP" required />
          </div>

          <div class="form-group-row">
            <label>Email</label>
            <input v-model="form.email" type="text" placeholder="admin@gmail.com" required />
          </div>

          <div class="form-group-row">
            <label>No Telepon</label>
            <input v-model="form.telepon" type="text" placeholder="08xxx" required />
          </div>

          <div class="form-group-row">
            <label>Password</label>
            <div class="password-wrapper">
              <input
                v-model="form.kode"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Password"
                required
              />
              <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                <img :src="showPassword ? eyeOff : eye" alt="Toggle Password" />
              </button>
            </div>
          </div>
          <div class="form-button">
            <label></label>
            <button type="submit" class="btn-submit">
              {{ editingIndex !== null ? 'Simpan Perubahan' : 'Tambah Guru' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Daftar Guru -->
      <div class="table-section" v-if="activeTab === 'Daftar Guru'">
        <div class="filter-bar">
          <input
            type="text"
            placeholder="Cari nama guru..."
            v-model="searchQuery"
            class="search-input"
          />
        </div>
        <table class="styled-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>NIP</th>
              <th>Email</th>
              <th>No Telepon</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(teacher, index) in filteredData" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ teacher.nama }}</td>
              <td>{{ teacher.nip }}</td>
              <td>{{ teacher.email }}</td>
              <td>{{ teacher.telepon }}</td>
              <td>
                <button @click="editStudent(teacher, index)" class="btn-aksi edit">Edit</button>
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
        :title="'MENAMBAHKAN DATA GURU'"
        :message="'Apakah anda yakin untuk menambahkan data guru?'"
        :konfirmasi="'IYA'"
        :batalkan="'BATAL'"
        @confirm="saveActivity"
        @cancel="cancelSave"
      />
      <PopupConfirm
        v-if="showConfirmEdit"
        :title="'EDIT INFORMASI GURU'"
        :message="'Apakah anda yakin untuk menyimpan perubahan informasi guru ini?'"
        :konfirmasi="'IYA'"
        :batalkan="'BATAL'"
        @confirm="saveEdit"
        @cancel="cancelSave"
      />
      <PopupConfirm
        v-if="showConfirmDelete"
        :title="'MENGHAPUS INFORMASI GURU'"
        :message="'Apakah anda yakin untuk menghapus data guru ini?'"
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
        :title="'Berhasil menambahkan data guru'"
        @close="cancelSave"
      />
      <PopupMessage
        v-if="showSuccesEdit"
        :title="'Berhasil mengubah data guru'"
        @close="cancelSave"
      />
      <PopupMessage
        v-if="showSuccesDelete"
        :title="'Berhasil menghapus data guru'"
        @close="cancelSave"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import PopupConfirm from '@/components/BlokPopup.vue'
import PopupMessage from '@/components/MessagePopup.vue'
import eye from '@/assets/eye.png'
import eyeOff from '@/assets/eye-off.png'

const router = useRouter()

const classData = ref({
  'Daftar Guru': [],
})

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
  nip: '',
  email: '',
  telepon: '',
  kode: '',
})

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
    data = data.filter((teacher) =>
      teacher.nama.toLowerCase().includes(searchQuery.value.toLowerCase()),
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
  const teacherBaru = {
    nama: form.value.nama,
    nip: form.value.nip,
    email: form.value.email,
    telepon: form.value.telepon,
    kode: form.value.kode,
  }

  // Menyimpan ke daftar "Daftar Guru"
  if (!classData.value['Daftar Guru']) {
    classData.value['Daftar Guru'] = []
  }
  classData.value['Daftar Guru'].push(teacherBaru)

  // Reset form
  form.value = {
    nama: '',
    nip: '',
    email: '',
    telepon: '',
    kode: '',
  }

  showConfirmPromote.value = false
  showSuccesAdd.value = true
}

function editStudent(teacher, index) {
  const combinedForm = { ...teacher }
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
    nip: '',
    email: '',
    telepon: '',
    kode: '',
  }
}

function saveEdit() {
  if (editingIndex.value !== null && editingTab.value) {
    classData.value[editingTab.value][editingIndex.value] = {
      nama: form.value.nama,
      nip: form.value.nip,
      email: form.value.email,
      telepon: form.value.telepon,
      kode: form.value.kode,
    }
    showConfirmEdit.value = false
    editingIndex.value = null
    editingTab.value = null
    activeTab.value = 'Daftar Guru'
    showSuccesEdit.value = true
  }

  form.value = {
    nama: '',
    nip: '',
    email: '',
    telepon: '',
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
  min-height: 100vh;
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
  max-height: 100%;
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
.form-section {
  flex-basis: 100%;
  border-top: 2px solid #ccc;
  padding-top: 10px;
  text-align: start;
  font-size: 1.1rem;
  font-weight: 600;
}

.form-registrasi input,
.form-registrasi select {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

.form-group-row {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  width: 100%;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.form-group {
  display: flex;
  flex-direction: column;
  flex: 1 1 10%;
}

.form-group-row label {
  width: 150px;
  font-weight: 600;
  margin-right: 12px;
  text-align: right;
}

.form-group-row input,
.form-group-row .password-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
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
  max-width: 600px;
  margin: 24px auto 0;
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
  height: 100%;
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
  width: 20%;
}

.styled-table th:nth-child(3),
.styled-table td:nth-child(3) {
  width: 17%;
}

.styled-table th:nth-child(4),
.styled-table td:nth-child(4) {
  width: 20%;
}

.styled-table th:nth-child(5),
.styled-table td:nth-child(5) {
  width: 15%;
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

  .form-row {
    gap: 16px;
    width: 50%;
    margin: 0;
    margin-left: 1rem;
  }

  .form-group {
    flex: 1 1 100%;
  }
}
</style>
