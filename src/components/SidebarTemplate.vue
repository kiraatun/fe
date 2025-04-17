<template>
  <div class="sidebar">
    <Popup
      v-if="showPopup"
      :title="'GANTI FOTO PROFIL'"
      :message="'Apakah anda yakin untuk mengganti foto profil?'"
      :konfirmasi="'YA'"
      :batalkan="'BATAL'"
      @logout="handleLogout"
      @cancel="showPopup = false"
    />
    <!-- Header profile -->
    <div class="profile-header">
      <label for="profile-upload" class="profile-upload">
        <img :src="profileImage || defaultImage" alt="User Icon" class="profile-icon" />
        <input id="profile-upload" type="file" @change="updateProfileImage" hidden />
      </label>
      <span class="profile-name">{{ isLoggedIn ? userName : 'Tamu' }}</span>
    </div>

    <!-- Menu untuk tamu -->
    <template v-if="!isLoggedIn">
      <router-link to="/login" class="sidebar-item">
        <div class="icon-container">
          <img src="" alt="Login Icon" class="icon" />
        </div>
        <span class="sidebar-text">Log In</span>
      </router-link>
    </template>

    <!-- Menu untuk user login -->
    <template v-else>
      <router-link to="/komentar" class="sidebar-item">
        <div class="sidebar-text">Komentar</div>
      </router-link>
      <router-link to="/berita" class="sidebar-item">
        <div class="sidebar-text">Berita</div>
      </router-link>
      <router-link to="/laporan" class="sidebar-item">
        <div class="sidebar-text">Laporan</div>
      </router-link>
      <router-link to="/logout" class="sidebar-item logout">
        <div class="icon-container">
          <img src="" alt="Logout Icon" class="icon" />
        </div>
        <span class="sidebar-text">Logout</span>
      </router-link>
    </template>
  </div>
</template>

<script>
import Popup from '../components/BlokPopup.vue'

export default {
  components: {
    Popup,
  },
  props: {
    isLoggedIn: {
      type: Boolean,
      required: true,
    },
    userName: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      showPopup: false,
      profileImage: null,
      defaultImage: ' ', // ganti dengan gambar default kamu jika ada
    };
  },
  methods: {
    updateProfileImage(event) {
      const file = event.target.files[0];
      if (file) {
        this.profileImage = URL.createObjectURL(file);
        this.showPopup = true;
      }
    },
    onConfirmChangeImage() {
      this.profileImage = URL.createObjectURL(this.selectedImageFile);
      this.showPopup = false;
      this.selectedImageFile = null;
    },
    onCancelChangeImage() {
      this.showPopup = false;
      this.selectedImageFile = null;
  }
  },
};
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100vh;
  background-color: #fff;
  padding: 140px 0 20px 0;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.2);
  z-index: 20;
}

.profile-header {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  padding: 20px;
  background-color: #2f4036;
  display: flex;
  align-items: center;
  width: 100%;
  z-index: 1000;
}

.profile-upload {
  cursor: pointer;
  margin-right: 20px;
}

.profile-icon {
  width: 100%;
  height: 80px;
  background-color: #ccc;
  border-radius: 50%;
  object-fit: cover;
}

.profile-name {
  color: white;
  font-size: 20px;
  font-weight: bold;
}

.sidebar-item {
  background-color: #2f4036;
  display: flex;
  align-items: center;
  padding: 15px 30px;
  margin: 10px 0;
  text-decoration: none;
  border-radius: 5px;
}

.sidebar-item:hover {
  background-color: #3b5546;
}

.icon-container {
  width: 30px;
  height: 30px;
  margin-right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon {
  width: 100%;
  height: 100%;
}

.sidebar-text {
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
}

.logout {
  margin-top: auto;
}
</style>
