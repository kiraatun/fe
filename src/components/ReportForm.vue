<template>
  <div class="page-wrapper">
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

    <!-- Form Container -->
    <div class="form-wrapper">
      <h2 class="title">BUAT LAPORAN</h2>

      <!-- Pilih Kelas -->
      <div class="form">
        <div class="form-group">
          <label for="kelas">Pilih Kelas</label>
          <select id="kelas" v-model="selectedClass" @change="fetchStudents">
            <option disabled value="">Kelas</option>
            <option v-for="kelas in kelasList" :key="kelas.id" :value="kelas.id">
              {{ kelas.name }}
            </option>
          </select>
        </div>

        <!-- Pilih Siswa -->
        <div class="form-group">
          <label for="siswa">Pilih Nama Siswa</label>
          <select id="siswa" v-model="selectedStudent">
            <option disabled value="">Nama Siswa</option>
            <option v-for="siswa in siswaList" :key="siswa.id" :value="siswa.id">
              {{ siswa.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Upload File -->
      <div class="form-file">
        <label>Capaian kegiatan pembelajaran</label>

        <label class="custom-file-upload" :class="{ 'file-selected': fileName }">
          <div class="upload-content">
            <div class="icon">
              <img src="@/assets/arrow-up-sm.png" alt="Upload Icon" class="upload-icon" />
            </div>
            <span class="upload-text">{{ fileName || 'Pilih File' }}</span>
          </div>
          <input type="file" @change="handleFile" accept="application/pdf" />
        </label>
      </div>

      <!-- Tombol Kirim -->
      <button class="submit-button" @click="confirmSubmit">Kirim</button>
    </div>

    <!-- Modal Konfirmasi -->
    <ModalKonfirmasi
      v-if="showConfirm"
      :title="'KIRIM LAPORAN'"
      :message="'Apakah Anda yakin ingin mengirim laporan ini?'"
      :konfirmasi="'SIMPAN'"
      :batalkan="'BATAL'"
      @confirm="submitForm"
      @cancel="showConfirm = false"
    />

    <!-- Modal Sukses -->
    <ModalSukses
      v-if="showSuccess"
      :title="'LAPORAN BERHASIL DIKIRIM'"
      @close="showSuccess = false"
    />

    <ModalPesan v-if="showError" :title="errorTitle" @close="showError = false" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ModalKonfirmasi from '@/components/BlokPopup.vue'
import ModalSukses from '@/components/MessagePopup.vue'
import ModalPesan from '@/components/MessagePopup.vue'

const emit = defineEmits(['back'])

const kelasList = ref([])
const siswaList = ref([])
const selectedClass = ref('')
const selectedStudent = ref('')
const file = ref(null)
const fileName = ref('')
const showConfirm = ref(false)
const showSuccess = ref(false)
const showError = ref(false)
const errorTitle = ref('')

const fetchKelas = async () => {
  try {
    const response = await axios.get('/api/kelas')
    kelasList.value = response.data
  } catch (error) {
    console.error('Gagal mengambil data kelas:', error)
  }
}

const fetchStudents = async () => {
  try {
    const response = await axios.get(`/api/kelas/${selectedClass.value}/siswa`)
    siswaList.value = response.data
  } catch (error) {
    console.error('Gagal mengambil data siswa:', error)
  }
}

const handleFile = (event) => {
  const uploaded = event.target.files[0]
  if (uploaded && uploaded.size > 10 * 1024 * 1024) {
    showErrorPopup('Ukuran File Tidak Valid')
    event.target.value = ''
    file.value = null
    fileName.value = ''
  } else {
    file.value = uploaded
    fileName.value = uploaded.name
  }
}

const confirmSubmit = () => {
  if (!selectedClass.value || !selectedStudent.value || !file.value) {
    showErrorPopup('Form Tidak Lengkap')
    return
  }
  showConfirm.value = true
}

const submitForm = async () => {
  try {
    const formData = new FormData()
    formData.append('kelas_id', selectedClass.value)
    formData.append('siswa_id', selectedStudent.value)
    formData.append('file', file.value)

    await axios.post('/api/laporan', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    showConfirm.value = false
    showSuccess.value = true
    resetForm()
  } catch (error) {
    showErrorPopup('Gagal Upload')
    console.error(error)
  }
}

const resetForm = () => {
  selectedClass.value = ''
  selectedStudent.value = ''
  file.value = null
  fileName.value = ''
}

const goBack = () => {
  emit('back')
}

onMounted(() => {
  fetchKelas()
})
const showErrorPopup = (title) => {
  errorTitle.value = title
  showError.value = true
}
</script>

<style scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 0;
  margin: 0;
}

/* Header */
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

/* Form Container */
.form {
  display: flex;
  flex-direction: column;
  margin-bottom: 0;
}

.form-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #fff;
  padding: 1rem;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto;
}

.title {
  text-align: center;
  font-weight: bold;
  color: #1f3a2d;
  font-size: 1.3rem;
}

.form-group label {
  color: #1f3a2d;
  display: block;
  font-size: 0.8rem;
  font-weight: bold;
}

.form-group select {
  color: #1f3a2d;
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #aaa;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.form-file label {
  color: #1f2922;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.8rem;
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
  margin-bottom: 0;
  margin: 0 atuo;
}

.upload-text::after {
  content: 'Unggah file berupa pdf (Maksimal 10Mb)';
  display: block;
  font-size: 0.6rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.submit-button {
  width: 50%;
  padding: 0.5rem;
  background-color: #7d726a;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  margin: 0 auto;
  margin-top: 0.5rem;
  margin-bottom: 2rem;
  border: none;
}

.submit-button:hover {
  background-color: #4d4d4d;
}

.upload-text {
  text-align: center;
  font-size: 0.7rem;
}
.file-note {
  margin-top: 1rem;
  text-align: center;
  color: #1f3a2d;
}

@media (min-width: 768px) {
  .page-header {
    display: none;
  }

  .form {
    flex-direction: row;
    margin-bottom: 0;
  }

  .page-wrapper {
    height: 100%;
    box-sizing: border-box;
    min-height: calc(100vh - 90px);
    width: 100%;
    max-width: 800%;
    padding: 0;
    margin-bottom: 0;
  }

  .title {
    text-align: start;
    font-size: 1.5rem;
  }

  .form-group {
    flex: 1;
  }

  .form-group label {
    font-weight: bold;
    display: block;
  }

  .form-group select {
    width: 85%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 8px;
  }

  .form-file {
    text-align: center;
  }

  .submit-button {
    width: 40%;
    margin: 0 auto;
    margin-bottom: 2rem;
    padding: 0.5rem;
  }
}
</style>
