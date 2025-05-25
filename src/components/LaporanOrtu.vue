<template>
  <div class="laporan-container">
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

    <!-- Daftar Laporan -->
    <div class="form-laporan">
      <h2 class="title">Daftar Laporan Siswa</h2>
      <h2 class="title nama">{{ siswa.nama }} - {{ siswa.nis }}</h2>

      <!-- Tabel -->
      <div class="table-wrapper">
        <table class="laporan-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Kelas</th>
              <th>Tahun Ajaran</th>
              <th>File</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(laporan, index) in daftarLaporan" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ laporan.kelas }}</td>
              <td>{{ laporan.tahunAjaran }}</td>
              <td>
                <a v-if="laporan.file" :href="getFileUrl(laporan.file)" target="_blank">
                  {{ laporan.fileName || 'Lihat File' }}
                </a>
                <span v-else>-</span>
              </td>
              <td>
                <button class="laporan-button unduh" @click="tampilkanKonfirmasi(index)">
                  Unduh
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Popup Konfirmasi -->
    <ConfirmModal
      v-if="confirmUnduh"
      :title="'Konfirmasi Unduh'"
      :message="'Yakin ingin mengunduh laporan ini?'"
      :konfirmasi="'IYA'"
      :batalkan="'BATAL'"
      @confirm="konfirmasiUnduh"
      @cancel="confirmUnduh = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ConfirmModal from '@/components/BlokPopup.vue'

const router = useRouter()

// Contoh data siswa dan laporan
const siswa = ref({
  nama: 'Ani',
  nis: '001',
})

const daftarLaporan = ref([
  {
    kelas: '1A',
    tahunAjaran: '2022/2023',
    file: null,
    fileName: 'laporan_ani.pdf',
  },
  {
    kelas: '1A',
    tahunAjaran: '2022/2023',
    file: null,
    fileName: 'rapor_ani_semester2.pdf',
  },
])

const confirmUnduh = ref(false)
const indexToUnduh = ref(null)

const tampilkanKonfirmasi = (index) => {
  indexToUnduh.value = index
  confirmUnduh.value = true
}

const konfirmasiUnduh = () => {
  const laporan = daftarLaporan.value[indexToUnduh.value]
  if (laporan.file) {
    window.open(getFileUrl(laporan.file), '_blank')
  } else {
    alert('File tidak tersedia.')
  }
  confirmUnduh.value = false
  indexToUnduh.value = null
}

const getFileUrl = (file) => {
  try {
    return file ? URL.createObjectURL(file) : ''
  } catch (e) {
    console.error('Gagal membuat URL file:', e)
    return ''
  }
}

const goBack = () => {
  router.push('/dashboardortu')
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
  margin-bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  background:
    linear-gradient(rgba(162, 123, 92, 0.8), rgba(162, 123, 92, 0.8)), url('@/assets/bg.png');
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

.back-button img {
  filter: invert(1);
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
  text-align: start;
  font-weight: bold;
  color: #000;
  font-size: 1.3rem;
  margin-bottom: 1rem;
}

.title.nama {
  text-align: center;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.table-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.laporan-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  font-size: 0.85rem;
  table-layout: fixed;
  min-width: 1000px;
  color: #000;
}

.laporan-table th,
.laporan-table td {
  border: 1px solid #ccc;
  padding: 6px 8px;
  text-align: left;
  word-break: break-word;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}

.laporan-table th:nth-child(1),
.laporan-table td:nth-child(1) {
  width: 3%;
}

.laporan-table th:nth-child(2),
.laporan-table td:nth-child(2) {
  width: 8%;
}

.laporan-table th:nth-child(3),
.laporan-table td:nth-child(3) {
  width: 10%;
}

.laporan-table th:nth-child(4),
.laporan-table td:nth-child(4) {
  width: 25%;
}

.laporan-table th:nth-child(5),
.laporan-table td:nth-child(5) {
  width: 10%;
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
  background-color: #a59f9f;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin: 0.2rem;
}

.laporan-button.add {
  padding: 0.4rem;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
}

.laporan-button.add,
.laporan-button.save,
.laporan-button.unduh {
  background-color: #31d249;
}
.laporan-button.add:hover,
.laporan-button.save:hover {
  background-color: #27c04d;
}

.laporan-button:hover {
  background-color: #bdbdbd;
}

.laporan-button.edit {
  background-color: #e4cd21;
}

.laporan-button.edit:hover {
  background-color: #fcb454;
}

.laporan-button.delete {
  background-color: #e74c3c;
}

.laporan-button.delete:hover {
  background-color: #d32f2f;
}

@media (min-width: 768px) {
  .form-laporan {
    min-height: calc(100vh - 84px);
    max-width: 100%;
  }

  .title {
    text-align: start;
    font-size: 1.3rem;
  }

  .title.nama {
    text-align: start;
    font-size: 1rem;
  }

  .laporan-table th:nth-child(1),
  .laporan-table td:nth-child(1) {
    width: 2%;
  }

  .laporan-table th:nth-child(2),
  .laporan-table td:nth-child(2) {
    width: 5%;
  }

  .laporan-table th:nth-child(3),
  .laporan-table td:nth-child(3) {
    width: 7%;
  }

  .laporan-table th:nth-child(4),
  .laporan-table td:nth-child(4) {
    width: 20%;
  }

  .laporan-table th:nth-child(5),
  .laporan-table td:nth-child(5) {
    width: 7%;
  }
}
</style>
