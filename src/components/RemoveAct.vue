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
        <h1 v-if="isDesktop" class="remove-title">HAPUS KEGIATAN</h1>
      </div>
      <div class="right"></div>
    </div>

    <div class="container">
      <h1 v-if="!isDesktop" class="subtitle">HAPUS KEGIATAN</h1>
      <p v-if="!isDesktop && !selectedKegiatan">Pilih salah satu kegiatan</p>

      <!-- List kegiatan -->
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

      <!-- Detail form -->
      <div v-if="selectedKegiatan" class="remove-form">
        <label>Judul Kegiatan</label>
        <input :value="selectedKegiatan.judul" type="text" disabled />

        <label>Tanggal Pelaksanaan</label>
        <input :value="selectedKegiatan.tanggal" type="date" disabled />

        <label>Rincian Kegiatan</label>
        <textarea :value="selectedKegiatan.rincian" rows="4" disabled></textarea>

        <div class="remove-actions">
          <button @click="showConfirmPopup = true">Hapus</button>
          <button @click="cancelDelete">Batal</button>
        </div>
      </div>
    </div>

    <!-- Popup -->
    <PopupConfirm
      v-if="showConfirmPopup"
      :title="'HAPUS KEGIATAN'"
      message="Apakah kamu yakin ingin menghapus kegiatan ini?"
      :konfirmasi="'IYA'"
      :batalkan="'BATAL'"
      @confirm="removeKegiatan"
      @cancel="showConfirmPopup = false"
    />

    <PopupMessage
      v-if="showSuccessPopup"
      :title="'KEGIATAN TERHAPUS'"
      :message="successMessage"
      @close="exit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PopupConfirm from '@/components/BlokPopup.vue'
import PopupMessage from '@/components/MessagePopup.vue'

const selectedKegiatan = ref(null)
const showConfirmPopup = ref(false)
const showSuccessPopup = ref(false)
const successMessage = ref('')
const isDesktop = ref(false)
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

function formatTanggal(tanggal) {
  const date = new Date(tanggal)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return { day, monthYear: `${month}/${year}` }
}

function selectKegiatan(kegiatan) {
  selectedKegiatan.value = kegiatan
}

function cancelDelete() {
  selectedKegiatan.value = null
}

function removeKegiatan() {
  kegiatanList.value = kegiatanList.value.filter((k) => k.id !== selectedKegiatan.value.id)
  showConfirmPopup.value = false
  successMessage.value = 'Kegiatan berhasil dihapus.'
  showSuccessPopup.value = true
}

function exit() {
  selectedKegiatan.value = null
  showConfirmPopup.value = false
  showSuccessPopup.value = false
}

onMounted(() => {
  isDesktop.value = window.innerWidth >= 768
})

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

.app-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #fff;
}

/*Form*/
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

.container h1 {
  font-size: 1.3rem;
  text-align: center;
  font-weight: bold;
  color: #1f3a2d;
  margin-bottom: 0.5rem;
}

.container p {
  padding: 0.5rem;
  color: black;
  margin-bottom: 0.5rem;
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
  display: block;
  font-size: 16px;
  font-weight: bold;
  line-height: 1;
}

.tanggal-bawah {
  display: block;
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

.remove-form {
  background: #fff;
  padding: 1rem;
  border-radius: 12px;
  margin-top: 1rem;
}

.remove-form h2 {
  font-size: 1.2rem;
  color: #2c3930;
  margin-bottom: 1rem;
}

.remove-form label {
  display: block;
  font-weight: bold;
  margin-top: 0.5rem;
  color: #2c3930;
}

.remove-form input,
.remove-form textarea {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.2rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

.remove-actions {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
}

.remove-actions button {
  padding: 0.5rem 1rem;
  border: none;
  background-color: #d19156;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  width: 20%;
  margin-top: 1rem;
}

.remove-actions button:hover {
  background-color: #dea67a;
}

.remove-actions button:last-child {
  background-color: #999;
}

.remove-actions button:last-child:hover {
  background-color: grey;
}

@media (min-width: 768px) {
  .page-wrapper {
    padding: 0.5rem;
    margin: 0;
    overflow: hidden;
    height: inherit;
  }
  .page-header {
    padding: 0;
    background: none;
  }
  .back-button {
    filter: invert(1);
  }
  .remove-title {
    color: #2c3930;
    font-size: 1.3rem;
    font-weight: bold;
  }
  .container {
    padding: 0;
    margin: 0;
    box-shadow: none;
    height: inherit;
    padding: 1rem;
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
    margin-top: 0.5rem;
  }
  .detail p {
    font-size: 10px;
  }
  .remove-form {
    margin: 0;
    padding: 0;
  }
  .remove-form label {
    font-size: 0.8rem;
  }
}
</style>
