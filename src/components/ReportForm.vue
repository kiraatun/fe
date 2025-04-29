<template>
  <div class="page-wrapper">
    <!-- Header -->
    <div class="page-header">
      <div class="left">
        <button class="back-button" @click="goBack">
          <img src="@/assets/arrow-left.png" alt="Kembali">
        </button>
      </div>
      <div class="center">
        <h1 class="app-title">Smartkartika</h1>
      </div>
      <div class="right"></div> <!-- dummy agar kiri dan kanan seimbang -->
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
            <img src="@/assets/arrow-up-sm.png" alt="Upload Icon" class="upload-icon">
            <span class="upload-text">{{ fileName || 'Pilih File' }}</span>
          </div>
          <input type="file" @change="handleFile" accept="application/pdf" />
        </label>

        <small class="file-note">Unggah file berupa pdf (maksimal 10MB)</small>
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ModalKonfirmasi from '@/components/BlokPopup.vue'
import ModalSukses from '@/components/MessagePopup.vue'

// --- Emit buat tombol back
const emit = defineEmits(['back'])

// --- State lokal
const kelasList = ref([])
const siswaList = ref([])
const selectedClass = ref('')
const selectedStudent = ref('')
const file = ref(null)
const fileName = ref('')
const showConfirm = ref(false)
const showSuccess = ref(false)

// --- Fungsi
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
  const uploadedFile = event.target.files[0]
  if (uploadedFile && uploadedFile.size > 10 * 1024 * 1024) {
    alert('Ukuran file melebihi 10MB!')
    event.target.value = ''
    file.value = null
    fileName.value = ''
  } else {
    file.value = uploadedFile
    fileName.value = uploadedFile.name
  }
}

const confirmSubmit = () => {
  if (!selectedClass.value || !selectedStudent.value || !file.value) {
    alert('Harap lengkapi semua data!')
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
    alert('Gagal mengunggah file!')
    console.error(error)
  }
}

const resetForm = () => {
  selectedClass.value = ''
  selectedStudent.value = ''
  file.value = null
  fileName.value = ''
}

// --- Back ke dashboard menu
const goBack = () => {
  emit('back')
}

// --- Lifecycle
onMounted(() => {
  fetchKelas()
})
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
  margin-bottom: 1rem;
  padding: 1.5rem 1rem;
}

.left, .center, .right {
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

.back-button img{
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

/* Form Container */
.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #fff;
  padding: 2rem;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto;
}

.title {
  text-align: center;
  font-weight: bold;
  color: #1f3a2d;
}

.form-group {
  margin-bottom: 0,5rem;
}

.form-group label {
  color: #1f3a2d;
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.form-group select {
  color: #1f3a2d;
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #aaa;
  border-radius: 4px;
}

.form-file label {
  color: #1f2922;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 400;
  margin-bottom: 1rem;
}

.custom-file-upload {
  color: #fff;
  display: inline-block;
  background-color: #7d726a;
  padding: 0.75rem 1.5rem;
  border-radius: 15px;
  cursor: pointer;
  text-align: center;
  width: 100%;
  font-weight: bold;
}

.custom-file-upload input[type="file"] {
  display: none;
}

.custom-file-upload.file-selected {
  background-color: #2c3930;
  color: #fff;
}

.form-file small {
  margin-top: 1rem;
  color: #1f3a2d;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
}

.submit-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #7d726a;
  color: white;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  margin-bottom: 1rem;
}

.submit-button:hover {
  background-color: #4d4d4d;
}

.upload-icon {
  display: none;
}
.upload-text {
  text-align: center;
}
.file-note {
  margin-top: 1rem;
  text-align: center;
  color: #1f3a2d;
}

@media(min-width: 768px) {
  .page-header {
    display: none;
  }

  .form {
    flex-direction: row;
  }

  .page-wrapper {
    height: 100%;
    box-sizing: border-box;
    min-height: calc(100vh - 60px);
    width: 100%;
    max-width: 800%;
    padding: 0;
  }

  .title {
    text-align: start;
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .form-group {
    flex: 1;
  }

  .form-group label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
  }

  .form-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  }

  .form-file {
    margin: 1rem 0;
    text-align: center;
  }

  .custom-file-upload {
    margin-top: 0;
    padding: 2rem;
    border: 2px dashed #aaa;
    border-radius: 10px;
    background: #f0f0f0;
    color: #333;
    cursor: pointer;
    position: relative;
    margin: 0 auto;
  }

  .custom-file-upload input[type="file"]{
    opacity: 0;
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }

  .upload-icon {
    display: block;
    width: 40px;
    height: 40px;
    margin-bottom: 0.5rem;
    margin: 0 auto;
  }

  .upload-content {
    gap: 0.5rem;
  }

  .form-file .file-note {
    display: none;
  }

  .custom-file-upload {
    position: relative;
  }

  .upload-text::after {
    content: "Unggah file berupa pdf (Maksimal 10Mb)";
    display: block;
    font-size: 0.875rem;
    color: #666;
    margin-top: 0.7rem;
  }

  .submit-button {
    margin-bottom: 3.5rem;
  }
}
</style>
