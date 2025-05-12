<template>
  <div class="page-wrapper">
    <!-- Header -->
    <div class="page-header">
      <div class="left">
        <button v-if="!selectedKegiatan" class="back-button" @click="goBack">
          <img src="@/assets/arrow-left.png" alt="Kembali" />
        </button>
      </div>
      <div class="center">
        <h1 v-if="!isDesktop" class="app-title">Smartkartika</h1>
        <h1 v-if="isDesktop" class="edit-title">EDIT KEGIATAN</h1>
      </div>
      <div class="right"></div>
    </div>

    <div class="container">
      <h1 v-if="!isDesktop" class="subtitle">EDIT KEGIATAN</h1>
      <p v-if="!isDesktop && !selectedKegiatan">Pilih salah satu kegiatan</p>
      <div v-if="!selectedKegiatan" class="list-kegiatan">
        <div
          v-for="kegiatan in kegiatanList"
          :key="kegiatan.id"
          class="kegiatan-item"
          @click="selectKegiatan(kegiatan)"
        >
          <div class="tanggal">
            <span class="tanggal-atas">{{ formatTanggal(kegiatan.tanggal).day }}</span>
            <span class="tanggal-bawah">{{ formatTanggal(kegiatan.tanggal).monthYear }}</span>
          </div>
          <div class="detail">
            <h2>{{ kegiatan.judul }}</h2>
            <p>{{ kegiatan.rincian }}</p>
          </div>
        </div>
      </div>

      <!-- Form Edit -->
      <div v-if="selectedKegiatan" class="edit-form">
        <label>Judul Kegiatan</label>
        <input v-model="selectedKegiatan.judul" type="text" />

        <label>Tanggal Pelaksanaan</label>
        <input v-model="selectedKegiatan.tanggal" type="date" />

        <label>Rincian Kegiatan</label>
        <textarea v-model="selectedKegiatan.rincian" rows="4"></textarea>

        <div class="edit-actions">
          <button @click="saveEdit">Simpan</button>
          <button @click="cancelEdit">Batal</button>
        </div>
      </div>
    </div>
    <PopupKonfirmasi
      v-if="showConfirm"
      title="UBAH KEGIATAN"
      message="Apakah Anda yakin ingin menyimpan perubahan kegiatan?"
      :konfirmasi="'IYA'"
      :batalkan="'BATAL'"
      @confirm="handleConfirmSave"
      @cancel="cancelExit"
    />

    <PopupSukses
      v-if="showMessage"
      title="KEGIATAN TERSIMPAN"
      message="Perubahan berhasil disimpan!"
      @close="exit"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PopupKonfirmasi from '@/components/BlokPopup.vue'
import PopupSukses from '@/components/MessagePopup.vue'

const showConfirm = ref(false)
const showMessage = ref(false)
const isDesktop = ref(window.innerWidth >= 768)
const emit = defineEmits(['back'])

const kegiatanList = ref([
  {
    id: 1,
    tanggal: '2025-03-27',
    judul: 'Membuat kreasi kertas lipat',
    rincian: 'Siswa/Siswi berlatih di bidang kreativitas...',
  },
  {
    id: 2,
    tanggal: '2025-04-01',
    judul: 'Olahraga Senam Di Lapangan',
    rincian: 'Puji syukur pada hari ini anak-anak...',
  },
  {
    id: 3,
    tanggal: '2025-04-07',
    judul: 'Lorem Ipsum Dolor Sit Amet',
    rincian: 'Lorem ipsum dolor sit amet...',
  },
])

const selectedKegiatan = ref(null)

function formatTanggal(tanggal) {
  const date = new Date(tanggal)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return { day, monthYear: `${month}/${year}` }
}

function selectKegiatan(kegiatan) {
  selectedKegiatan.value = { ...kegiatan }
}

function saveEdit() {
  showConfirm.value = true
}
function cancelExit() {
  showConfirm.value = false
}
function exit() {
  selectedKegiatan.value = null
  showConfirm.value = false
  showMessage.value = false
}

function handleConfirmSave() {
  const index = kegiatanList.value.findIndex((k) => k.id === selectedKegiatan.value.id)
  if (index !== -1) {
    kegiatanList.value[index] = { ...selectedKegiatan.value }
  }
  showMessage.value = true
}

function cancelEdit() {
  selectedKegiatan.value = null
}

function goBack() {
  emit('back')
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
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  width: 24px;
  height: 24px;
}
.app-title,
.edit-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #fff;
}

/* Container */
.container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 1rem;
}

.subtitle {
  text-align: center;
  font-weight: bold;
  color: #1f3a2d;
  margin-bottom: 0.5rem;
  font-size: 1.3rem;
}

.container p {
  padding: 0.5rem;
  color: black;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
}

.list-kegiatan {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.kegiatan-item {
  display: flex;
  background: #d9d9d9;
  padding: 4px;
  border-radius: 10px;
  cursor: pointer;
  align-items: center;
  width: 90%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  position: relative;
}

.kegiatan-item::before {
  content: '';
  position: absolute;
  left: 8rem;
  top: 5%;
  bottom: 5%;
  width: 2px;
  background-color: #2c3930;
}

.tanggal {
  background: #2c3930;
  color: white;
  padding: 12px;
  text-align: center;
  border-radius: 8px;
  min-width: 50px;
  min-height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  margin-left: 20px;
  z-index: 1;
}

.tanggal-atas {
  font-size: 16px;
  font-weight: bold;
  line-height: 1;
}

.tanggal-bawah {
  font-size: 13px;
}

.detail {
  margin-left: 2.5rem;
  flex: 1;
}

.detail h2 {
  color: black;
  font-weight: bold;
  font-size: 14px;
  margin-top: 0.5rem;
}

.detail p {
  font-size: 10px;
  color: gray;
  margin-top: 4px;
}

/* Edit Form */
.edit-form {
  background: #fff;
  padding: 1rem;
  border-radius: 12px;
  margin-top: 1rem;
}

.edit-form h2 {
  font-size: 1.2rem;
  color: #2c3930;
  margin-bottom: 1rem;
}

.edit-form label {
  display: block;
  font-weight: bold;
  margin-top: 0.5rem;
  color: #2c3930;
}

.edit-form input,
.edit-form textarea {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.2rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

.edit-actions {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
}

.edit-actions button {
  padding: 0.5rem 1rem;
  border: none;
  background-color: #d19156;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  width: 20%;
  margin-top: 1rem;
}

.edit-actions button:hover {
  background-color: #dea67a;
}

.edit-actions button:last-child {
  background-color: #999;
}

.edit-actions button:last-child:hover {
  background-color: grey;
}

@media (min-width: 768px) {
  .page-header {
    background: none;
    margin-bottom: 0.5rem;
  }
  .edit-title {
    color: #2c3930;
    font-size: 1.3rem;
    font-weight: bold;
  }
  .back-button {
    filter: invert(1);
  }
  .page-wrapper {
    padding: 0;
    margin: 0;
  }
  .container {
    padding: 1rem;
    box-shadow: none;
  }
  .list-kegiatan {
    gap: 10px;
    width: 60%;
    margin-left: 2rem;
  }
  .kegiatan-item {
    padding: 0;
    border-radius: 10px;
  }
  .kegiatan-item::before {
    left: 7rem;
  }
  .tanggal {
    min-height: 40px;
    min-width: 40px;
  }
  .tanggal-atas {
    font-size: 12px;
  }
  .tanggal-bawah {
    font-size: 11px;
  }
  .detail {
    margin-left: 2rem;
  }
  .detail h2 {
    font-size: 14px;
  }
  .detail p {
    font-size: 10px;
  }
  .edit-form {
    margin: 0;
    padding: 0;
  }
  .edit-form label {
    font-size: 0.8rem;
  }
}
</style>
