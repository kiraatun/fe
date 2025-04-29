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
      <!-- dummy agar kiri dan kanan seimbang -->
    </div>

    <div class="container">
      <h1 class="subtitle">Edit Kegiatan</h1>
      <p>Pilih salah satu kegiatan</p>
      <div class="list-kegiatan">
        <div
          v-for="kegiatan in kegiatanList"
          :key="kegiatan.id"
          class="kegiatan-item"
          @click="goToEdit(kegiatan)"
        >
          <div class="tanggal">
            <span class="tanggal-atas">{{ formatTanggal(kegiatan.tanggal).day }}</span>
            <span class="tanggal-bawah">{{ formatTanggal(kegiatan.tanggal).monthYear }}</span>
          </div>
          <div class="detail">
            <h2>{{ kegiatan.judul }}</h2>
            <p>{{ kegiatan.ringkasan }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const kegiatanList = ref([
  {
    id: 1,
    tanggal: '2025-03-27',
    judul: 'Membuat kreasi kertas lipat',
    ringkasan: 'Siswa/Siswi berlatih di bidang kreativitas...',
  },
  {
    id: 2,
    tanggal: '2025-04-01',
    judul: 'Olahraga Senam Di Lapangan',
    ringkasan: 'Puji syukur pada hari ini anak-anak...',
  },
  {
    id: 3,
    tanggal: '2025-04-07',
    judul: 'Lorem Ipsum Dolor Sit Amet',
    ringkasan: 'Lorem ipsum dolor sit amet...',
  },
])

function formatTanggal(tanggal) {
  const date = new Date(tanggal)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return { day, monthYear: `${month}/${year}` }
}

function goToEdit(kegiatan) {
  router.push({ name: 'EditKegiatan', params: { id: kegiatan.id } })
}

function goBack() {
  router.back()
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
  margin-bottom: 0.5rem;
  padding: 1rem;
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

.back-button img {
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

.subtitle {
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
  padding: 12px;
  border-radius: 15px;
  cursor: pointer;
  align-items: center;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  position: relative;
}

.kegiatan-item::before {
  content: '';
  position: absolute;
  left: 10.5rem;
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
  min-width: 80px;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  margin-left: 20px;
  z-index: 1;
}

.tanggal-atas {
  display: block;
  font-size: 30px;
  font-weight: bold;
  line-height: 1;
}

.tanggal-bawah {
  display: block;
  font-size: 20px;
}

.detail {
  margin-left: 2.5rem;
  flex: 1;
}

.detail h2 {
  color: black;
  font-weight: bold;
  font-size: 18px;
  margin: 0;
}

.detail p {
  font-size: 12px;
  color: gray;
  margin-top: 4px;
}

@media (min-width: 768px) {
  .page-header {
    display: none;
  }
  .subtitle {
    text-align: start;
    font-size: 2rem;
  }
  .container {
    padding: 0;
  }
  .list-kegiatan {
    flex-direction: column;
  }
  .kegiatan-item {
    width: 100%;
  }
}
</style>
