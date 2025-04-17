<template>
  <div class="mock-page">
    <SidebarCompo :isLoggedIn="isLoggedIn" :userName="userName" />
    <h1>Halaman Mock Logout</h1>
    <button @click="showPopup = true" class="logout-button">Logout</button>
    <LogoutPopup
      v-if="showPopup"
      :title="'LOGOUT'"
      :message="'Apakah anda yakin untuk logout?'"
      :konfirmasi="'LOGOUT'"
      :batalkan="'CANCEL'"
      @logout="handleLogout"
      @cancel="showPopup = false"
    />
    <GantiFoto
      v-if="showPopup"
      :title="'GANTI FOTO PROFIL'"
      :message="'Apakah anda yakin untuk mengganti foto profil?'"
      :konfirmasi="'YA'"
      :batalkan="'BATAL'"
      @logout="handleLogout"
      @cancel="showPopup = false"
    />
  </div>
</template>

<script>
import GantiFoto from '../components/BlokPopup.vue'
import SidebarCompo from '../components/SidebarTemplate.vue'

export default {
  components: {
    GantiFoto,
    SidebarCompo,
  },
  data() {
    return {
      showPopup: false, // Kontrol untuk menampilkan popup
    };
  },
  methods: {
    handleLogout() {
      console.log('Methode handleLogout dipanggil');
      // Logika untuk logout
      this.showPopup = false;
      console.log('Logout berhasil dilakukan!');
    },
  },
};
</script>

<style scoped>
.mock-page {
  text-align: center;
  margin-top: 50px;
  flex: 1;
}

.logout-button {
  padding: 10px 20px;
  background-color: #d2a679;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.logout-button:hover {
  background-color: #b88653;
}
</style>
