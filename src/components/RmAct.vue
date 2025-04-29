<template>
  <div class="page-wrapper">
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

    <div class="container">
      <h1>Hapus Kegiatan</h1>

      <form @submit.prevent="hapusKegiatan">
        <div class="form-group">
          <label>Isi Judul Kegiatan<span class="required">*</span></label>
          <div class="input-wrapper">
            <input v-model="kegiatan.judul" type="text" required />
          </div>
        </div>

        <div class="form-group">
          <label>Isi Tanggal Pelaksanaan<span class="required">*</span></label>
          <input v-model="kegiatan.tanggal" type="date" required />
        </div>

        <div class="form-group">
          <label>Isi Rincian Kegiatan <span class="optional">(Optional)</span></label>
          <div class="input-wrapper">
            <textarea v-model="kegiatan.rincian" rows="4"></textarea>
          </div>
        </div>

        <button type="submit">Hapus Kegiatan</button>
      </form>
    </div>

    <PopupConfirm
      v-if="showSaveConfirm"
      :title="'HAPUS KEGIATAN'"
      :message="'Apakah anda yakin untuk menGHAPUS kegiatan ini?'"
      :konfirmasi="'HAPUS'"
      :batalkan="'BATAL'"
      @confirm="confirmHapus"
      @cancel="cancelHapus"
    />

    <PopupSuccess
      v-if="showSuccess"
      :title="'KEGIATAN BERHASIL DIHAPUS'"
      @close="goToKelolaKegiatan"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import PopupConfirm from '@/components/BlokPopup.vue'
import PopupSuccess from '@/components/MessagePopup.vue'

// Simulasi ambil dari database
const kegiatanDatabase = [
  {
    id: 1,
    judul: 'Membuat kreasi kertas lipat',
    tanggal: '2025-03-27',
    rincian:
      'Siswa/Siswi berlatih di bidang kreativitas dengan membuat kreasi kertas lipat dari origami.',
  },
  {
    id: 2,
    judul: 'Olahraga Senam Di Lapangan',
    tanggal: '2025-04-01',
    rincian: 'Puji syukur pada hari ini anak-anak dapat melaksanakan kegiatan senam pagi.',
  },
  {
    id: 3,
    judul: 'Lorem Ipsum Dolor Sit Amet',
    tanggal: '2025-04-07',
    rincian: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
]

const route = useRoute()
const router = useRouter()
const kegiatan = ref({})
const showSaveConfirm = ref(false)
const showSuccess = ref(false)

onMounted(() => {
  const id = parseInt(route.params.id)
  kegiatan.value = kegiatanDatabase.find((k) => k.id === id) || {}
})

function hapusKegiatan() {
  showSaveConfirm.value = true
}

function confirmHapus() {
  const id = kegiatan.value.id
  const index = kegiatanDatabase.value.findIndex((k) => k.id === id)
  if (index !== -1) {
    kegiatanDatabase.value.splice(index, 1) // Hapus dari database
  }
  showSaveConfirm.value = false
  showSuccess.value = true
}

function cancelHapus() {
  showSaveConfirm.value = false
}

function goBack() {
  router.back()
}

function goToKelolaKegiatan() {
  router.push('/remove')
}
</script>

<style scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 0;
  margin: 0;
  overflow: hidden;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
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
  cursor: pointer;
  outline: none;
  box-shadow: none;
  display: flex;
  justify-content: start;
  align-items: center;
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

.container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 2rem;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}

.container h1 {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  color: #024c28;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: black;
}

input,
textarea {
  width: 100%;
  padding: 12px 10px 8px 10px; /* ada jarak bawah biar garis bawah keliatan */
  background: #eee; /* warna latar kotaknya */
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: relative;
  font-size: 16px;
  outline: none;
}

input::after,
textarea::after {
  content: '';
  display: block;
  width: 100%;
  height: 2px;
  background-color: #aaa;
  margin-top: 8px;
}

.input-wrapper {
  background: #eee;
  border-radius: 12px;
  padding: 10px;
  position: relative;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 0rem;
}

.input-wrapper input {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-size: 16px;
}

.input-wrapper::after {
  content: '';
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 10px;
  height: 2px;
  background-color: #aaa;
}

.required {
  color: red;
  margin-left: 4px;
}

.optional {
  color: red;
  font-size: 12px;
}

button {
  background-color: #d19156;
  color: white;
  font-weight: bold;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  margin-top: 0.5rem;
  width: 100%;
}

@media (min-width: 768px) {
  .page-header {
    display: none;
  }
  .container {
    width: 100%;
    margin: auto;
  }
}
</style>
