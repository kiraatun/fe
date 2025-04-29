<template>
  <div class="container">
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
      <!-- dummy agar kiri dan kanan seimbang -->
    </div>

    <!-- Content -->
    <main class="content">
      <h2 class="subtitle">TAMBAH KEGIATAN</h2>

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
import { useRouter } from 'vue-router'

import PopupConfirm from '@/components/BlokPopup.vue'
import PopupConfirmBack from '@/components/BlokPopup.vue'
import PopupSuccess from '@/components/MessagePopup.vue'

const router = useRouter()

const form = ref({
  kegiatan: '',
  tanggal: '',
  rincian: '',
})

const showExitConfirm = ref(false)
const showSaveConfirm = ref(false)
const showSuccess = ref(false)

const goBack = () => {
  showExitConfirm.value = true
}

// Saat klik tombol "Simpan Kegiatan"
const handleSave = () => {
  showSaveConfirm.value = true
}

// Saat user klik "UNGGAH" di popup konfirmasi
const saveActivity = () => {
  showSaveConfirm.value = false

  // Simulasi proses simpan data
  setTimeout(() => {
    showSuccess.value = true
  }, 500)
}

// Saat user klik "YA" di popup keluar
const confirmExit = () => {
  router.push('/kelola')
}

// Saat user klik tombol "OK" setelah sukses
const goToKelolaKegiatan = () => {
  showSuccess.value = false
  router.back('')
}

// Saat batal keluar
const cancelExit = () => {
  showExitConfirm.value = false
}

// Saat batal upload
const cancelSave = () => {
  showSaveConfirm.value = false
}
</script>

<style>
/* Basic Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding: 1.5rem 1rem;
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
  filter: brightness(0) invert(1);
}

.app-title {
  font-size: 1.3rem;
  font-style: italic;
  font-weight: bold;
  color: #fff;
}

/* Content */
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 1rem;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  height: 100%;
  width: 100vw;
  box-sizing: border-box;
}

.subtitle {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  color: #024c28;
  margin-bottom: 2rem;
}

.form {
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 2rem;
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
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  margin-top: 2rem;
}

/* Responsive Desktop */
@media (min-width: 768px) {
  .page-header {
    display: none;
  }

  .subtitle {
    font-size: 2rem;
    text-align: start;
  }

  .content {
    padding: 0;
    width: 100%;
    height: 100%;
    margin: 0 auto;
  }

  .subtitle {
    font-size: 28px;
  }

  .submit-button {
    font-size: 18px;
  }
}
</style>
