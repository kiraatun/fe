<template>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="left">
        <button class="back-button" @click="goBack">
          <img src="@/assets/arrow-left.png" alt="Kembali" />
        </button>
      </div>
      <div class="center">
        <h1 v-if="!isDesktop" class="app-title">Smartkartika</h1>
        <h1 v-if="isDesktop" class="title">TAMBAH KEGIATAN</h1>
      </div>
      <div class="right"></div>
      <!-- dummy agar kiri dan kanan seimbang -->
    </div>

    <!-- Content -->
    <main class="content">
      <h2 v-if="!isDesktop" class="subtitle">TAMBAH KEGIATAN</h2>

      <form @submit.prevent="handleSave" class="form">
        <div class="form-group">
          <label>Judul Kegiatan<span class="required">*</span></label>
          <input v-model="form.kegiatan" type="text" required />
        </div>

        <div class="form-group">
          <label>Tanggal pelaksanaan<span class="required">*</span></label>
          <input v-model="form.tanggal" type="date" required />
        </div>

        <div class="form-group">
          <label>Rincian Kegiatan <span class="optional">(Opsional)</span></label>
          <textarea v-model="form.rincian" rows="3"></textarea>
        </div>

        <button type="submit" class="submit-button">Simpan Kegiatan</button>
      </form>
    </main>

    <!-- Confirm Dialog Component -->
    <PopupConfirm
      v-if="showSaveConfirm"
      :title="'TAMBAH KEGIATAN'"
      :message="'Apakah anda yakin untuk menyimpan kegiatan ini?'"
      :konfirmasi="'SIMPAN'"
      :batalkan="'BATAL'"
      @confirm="saveActivity"
      @cancel="cancelSave"
    />

    <PopupConfirmBack
      v-if="showExitConfirm"
      :title="'KEGIATAN TIDAK AKAN TERSIMPAN!'"
      :message="'Apakah anda yakin untuk kembali ke halaman sebelumnya?'"
      :konfirmasi="'YA'"
      :batalkan="'BATAL'"
      @confirm="confirmExit"
      @cancel="cancelExit"
    />

    <!-- Success Dialog Component -->
    <PopupSuccess
      v-if="showSuccess"
      :title="'KEGIATAN BERHASIL DISIMPAN'"
      @close="goToKelolaKegiatan"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
// import { useRouter } from 'vue-router'

import PopupConfirm from '@/components/BlokPopup.vue'
import PopupConfirmBack from '@/components/BlokPopup.vue'
import PopupSuccess from '@/components/MessagePopup.vue'

//const router = useRouter()
const emit = defineEmits(['back'])
const isDesktop = ref(window.innerWidth >= 768)

// Form input
const form = ref({
  kegiatan: '',
  tanggal: '',
  rincian: '',
})

// State popup
const showSaveConfirm = ref(false)
const showExitConfirm = ref(false)
const showSuccess = ref(false)

// Simpan tombol ditekan
const handleSave = () => {
  showSaveConfirm.value = true
}

// Simpan data
const saveActivity = () => {
  showSaveConfirm.value = false
  showSuccess.value = true
}

// Batal menyimpan
const cancelSave = () => {
  showSaveConfirm.value = false
}

// Tombol kembali ditekan
const goBack = () => {
  if (form.value.kegiatan || form.value.tanggal || form.value.rincian) {
    showExitConfirm.value = true
  } else {
    showExitConfirm.value = false
    emit('back')
  }
}
const confirmExit = () => {
  showExitConfirm.value = false
  emit('back')
}

// Batal keluar
const cancelExit = () => {
  showExitConfirm.value = false
}

const goToKelolaKegiatan = () => {
  showSuccess.value = false
  emit('back')
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: inherit;
  width: inherit;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
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
  font-style: italic;
  font-weight: bold;
  color: #fff;
}

/* Content */
.content {
  display: block;
  flex: 1;
  flex-direction: column;
  background-color: #fff;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.subtitle {
  font-size: 1.3rem;
  font-weight: bold;
  text-align: center;
  color: #024c28;
  margin-bottom: 2rem;
}

.form {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: black;
}

.required {
  color: red;
  margin-left: 4px;
}

.optional {
  color: red;
  font-size: 12px;
}

input,
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #cccccc;
  border-radius: 8px;
}

.submit-button {
  background-color: #d19156;
  color: white;
  font-weight: bold;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  width: 50%;
  margin: 0 auto;
  border: none;
  margin-top: 2rem;
}

.submit-button:hover {
  background-color: #dea67a;
}

/* Responsive Desktop */
@media (min-width: 768px) {
  .back-button {
    filter: invert(1) brightness(0);
  }
  .title {
    color: #2c3930;
    font-size: 1.3rem;
    font-weight: bold;
  }
  .subtitle {
    font-size: 2rem;
    text-align: start;
    font-weight: bold;
  }
  .container {
    display: block;
    min-height: 100%;
    height: 100%;
    width: 100%;
    display: flex;
  }

  .content {
    padding: 0;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    box-shadow: none;
    border-radius: none;
  }

  .form {
    width: 100%;
    padding: 1rem;
  }

  .subtitle {
    font-size: 1.3rem;
  }

  .submit-button {
    font-size: 15px;
    padding: 8px;
    width: 40%;
    margin-top: 0;
  }
}
</style>
