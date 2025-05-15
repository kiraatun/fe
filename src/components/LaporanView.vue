<template>
  <div class="laporan-container">
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

    <!-- Daftar Laporan -->
    <div class="form-laporan">
      <h2 class="title">DAFTAR LAPORAN</h2>
      <!-- Tombol Tambah -->
      <button class="laporan-button add" @click="showForm('add')">Tambah Laporan</button>

      <!-- FORM POPUP MENGAMBANG -->
      <div v-if="formVisible" class="modal-overlay" @click.self="cancelForm">
        <div class="modal-content">
          <h3 class="modal-title">{{ isEditing ? 'Edit Laporan' : 'Tambah Laporan' }}</h3>
          <form @submit.prevent="submitForm" class="modal-form">
            <select v-model="formData.tahunAjaran" name="tahunAjaran" required>
              <option value="" disabled>Pilih Tahun Ajaran</option>
              <option v-for="tahun in tahunAjaranOptions" :key="tahun" :value="tahun">
                {{ tahun }}
              </option>
            </select>

            <select
              v-model="formData.kelas"
              name="kelas"
              required
              :disabled="!formData.tahunAjaran"
            >
              <option value="" disabled>Pilih Kelas</option>
              <option v-for="kelas in kelasOptions" :key="kelas" :value="kelas">
                {{ kelas }}
              </option>
            </select>

            <select v-model="formData.nama" name="nama" required :disabled="!formData.kelas">
              <option value="" disabled>Pilih Nama Siswa</option>
              <option v-for="nama in namaOptions" :key="nama" :value="nama">
                {{ nama }}
              </option>
            </select>
            <label class="custom-file-upload" :class="{ 'file-selected': formData.file }">
              <div class="upload-content">
                <template v-if="!formData.file">
                  <div class="icon">
                    <img src="@/assets/arrow-up-sm.png" alt="Upload Icon" class="upload-icon" />
                  </div>
                  <span class="upload-text">Pilih File</span>
                </template>
                <template v-else>
                  <span class="file-name">{{ fileNameDisplay }}</span>
                </template>
              </div>
              <input type="file" name="file" @change="handleFile" accept="application/pdf" />
            </label>
            <div class="modal-actions">
              <button type="submit" class="laporan-button save">
                {{ isEditing ? 'Simpan Perubahan' : 'Unggah' }}
              </button>
              <button type="button" class="laporan-button delete" @click="cancelForm">Batal</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Tabel -->
      <div class="table-wrapper">
        <table class="laporan-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>NIS</th>
              <th>Kelas</th>
              <th>Tahun Ajaran</th>
              <th>File</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(laporan, index) in daftarLaporan" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ laporan.nama }}</td>
              <td>{{ laporan.nis }}</td>
              <td>{{ laporan.kelas }}</td>
              <td>{{ laporan.tahunAjaran }}</td>
              <td>
                <a
                  v-if="laporan.file"
                  :href="getFileUrl(laporan.file)"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ laporan.fileName || 'Lihat File' }}
                </a>
                <span v-else>-</span>
              </td>

              <td>
                <button class="laporan-button">Unduh</button>
                <button class="laporan-button edit" @click="editLaporan(index)">Edit</button>
                <button class="laporan-button delete" @click="hapusLaporan(index)">Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- Komponen Konfirmasi -->
    <ConfirmModal
      v-if="confirmVisible"
      :title="'Hapus Laporan'"
      :message="'Yakin ingin menghapus laporan ini?'"
      :konfirmasi="'IYA'"
      :batalkan="'BATAL'"
      @confirm="konfirmasiHapus"
      @cancel="confirmVisible = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import ConfirmModal from '@/components/BlokPopup.vue'

const router = useRouter()
const daftarLaporan = ref([])
const formVisible = ref(false)
const isEditing = ref(false)
const editingIndex = ref(null)
const confirmVisible = ref(false)
const indexToDelete = ref(null)
const isRestoring = ref(false)
const formData = ref({
  nama: '',
  kelas: '',
  tahunAjaran: '',
  file: null,
  fileName: '',
})

const dataSiswa = ref({
  '2022/2023': {
    'Kelas 1A': [
      { nama: 'Ani', nis: '001' },
      { nama: 'Budi', nis: '002' },
    ],
    'Kelas 1B': [
      { nama: 'Citra', nis: '003' },
      { nama: 'Dedi', nis: '004' },
    ],
  },
  '2023/2024': {
    'Kelas 2A': [
      { nama: 'Eka', nis: '005' },
      { nama: 'Fajar', nis: '006' },
    ],
    'Kelas 2B': [
      { nama: 'Gita', nis: '007' },
      { nama: 'Hadi', nis: '008' },
    ],
  },
})

const tahunAjaranOptions = computed(() => Object.keys(dataSiswa.value))

const kelasOptions = computed(() => {
  const tahun = formData.value.tahunAjaran
  return tahun ? Object.keys(dataSiswa.value[tahun] || {}) : []
})

const namaOptions = computed(() => {
  const tahun = formData.value.tahunAjaran
  const kelas = formData.value.kelas
  return tahun && kelas ? dataSiswa.value[tahun]?.[kelas]?.map((siswa) => siswa.nama) || [] : []
})

watch(
  () => formData.value.tahunAjaran,
  () => {
    if (!isRestoring.value) {
      formData.value.kelas = ''
      formData.value.nama = ''
    }
  },
)

watch(
  () => formData.value.kelas,
  () => {
    if (!isRestoring.value) {
      formData.value.nama = ''
    }
  },
)

watch(
  () => formData.value.nama,
  (val) => {
    const tahun = formData.value.tahunAjaran
    const kelas = formData.value.kelas
    const siswa = dataSiswa.value[tahun]?.[kelas]?.find((s) => s.nama === val)
    formData.value.nis = siswa?.nis || '' // Menarik nis berdasarkan nama yang dipilih
  },
)

const resetForm = () => {
  formData.value.nama = ''
  formData.value.nis = ''
  formData.value.kelas = ''
  formData.value.tahunAjaran = ''
  formData.value.file = null
  formData.value.fileName = ''
  editingIndex.value = null
}

const handleFile = (e) => {
  const file = e.target.files[0]
  formData.value.file = file
  formData.value.fileName = file ? file.name : ''
}

const fileNameDisplay = computed(() => formData.value.file?.name || 'Pilih File')

const submitForm = () => {
  const laporan = {
    nama: formData.value.nama,
    nis: formData.value.nis,
    kelas: formData.value.kelas,
    tahunAjaran: formData.value.tahunAjaran,
    file: formData.value.file,
    fileName: formData.value.file?.name || '',
  }

  if (isEditing.value) {
    daftarLaporan.value[editingIndex.value] = laporan
  } else {
    daftarLaporan.value.push(laporan)
  }

  cancelForm()
}

const getFileUrl = (file) => {
  try {
    return file ? URL.createObjectURL(file) : ''
  } catch (e) {
    console.error('Gagal membuat URL file:', e)
    return ''
  }
}

const showForm = (mode) => {
  formVisible.value = true
  isEditing.value = mode === 'edit'
  if (!isEditing.value) {
    resetForm()
  }
}

const editLaporan = (index) => {
  const laporan = daftarLaporan.value[index]
  isRestoring.value = true

  formData.value.tahunAjaran = laporan.tahunAjaran
  formData.value.kelas = laporan.kelas
  formData.value.nama = laporan.nama
  formData.value.nis = laporan.nis
  formData.value.file = laporan.file
  formData.value.fileName = laporan.fileName
  editingIndex.value = index
  isEditing.value = true
  formVisible.value = true

  // Matikan flag setelah data dipulihkan
  setTimeout(() => {
    isRestoring.value = false
  }, 0)
}

const cancelForm = () => {
  formVisible.value = false
  resetForm()
}

const hapusLaporan = (index) => {
  indexToDelete.value = index
  confirmVisible.value = true
}

const konfirmasiHapus = () => {
  if (indexToDelete.value !== null) {
    daftarLaporan.value.splice(indexToDelete.value, 1)
  }
  confirmVisible.value = false
  indexToDelete.value = null
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.laporan-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  margin: 0;
  padding: 0;
}

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

.form-laporan {
  flex: 1;
  background-color: #fff;
  padding: 1rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  height: 100%;
  width: 100vw;
  box-sizing: border-box;
  overflow-y: auto;
}

.title {
  text-align: center;
  font-weight: bold;
  color: #1f3a2d;
  font-size: 1.3rem;
  margin-bottom: 1rem;
}

.table-wrapper {
  overflow-x: auto;
}

.laporan-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  font-size: 0.9rem;
}

.laporan-table th,
.laporan-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
  color: #000;
}

.laporan-table th {
  background-color: #f2f2f2;
  color: #333;
  font-weight: 600;
}

.laporan-table tr:hover {
  background-color: #f9f9f9;
}

.laporan-button {
  padding: 6px 12px;
  font-size: 0.8rem;
  background-color: #7d726a;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin: 0.2rem;
}

.laporan-button.add,
.laporan-button.save {
  background-color: #4caf50;
}
.laporan-button.add:hover,
.laporan-button.save:hover {
  background-color: #45a049;
}

.laporan-button:hover {
  background-color: #b39779;
}

.laporan-button.edit {
  background-color: #e4cd21;
}

.laporan-button.edit:hover {
  background-color: #fcb454;
}

.laporan-button.delete {
  background-color: #f44336;
}

.laporan-button.delete:hover {
  background-color: #d32f2f;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease-in-out;
}

.modal-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
  color: #1f3a2d;
}

.modal-form select {
  display: block;
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.6rem;
  font-size: 0.9rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.custom-file-upload {
  border: 2px dashed #aaa;
  border-radius: 10px;
  background: #f0f0f0;
  color: #333;
  cursor: pointer;
  position: relative;
  width: 80%;
  height: 100px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  box-sizing: border-box;
  margin-bottom: 0.7rem;
}

.custom-file-upload.file-selected {
  background-color: #d6f5e3;
  border: 2px solid #4caf50;
}

.custom-file-upload input[type='file'] {
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  margin: 0 atuo;
}

.file-name {
  font-size: 0.8rem;
  font-weight: 500;
  color: #2e7d32;
  text-align: center;
}

.upload-text::after {
  content: 'Unggah file berupa pdf (Maksimal 10Mb)';
  display: block;
  font-size: 0.6rem;
  color: #666;
  margin-bottom: 0.5rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (min-width: 768px) {
  .page-header {
    display: none;
  }

  .form-laporan {
    min-height: calc(100vh - 84px);
    max-width: 100%;
  }

  .title {
    text-align: start;
    font-size: 1.5rem;
  }
}
</style>
