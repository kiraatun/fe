<template>
  <div class="sidebar-wrapper" @click.self="$emit('close')">
    <div class="sidebar">
      <!-- Header profile -->
      <div class="profile-header">
        <label for="profile-upload" class="profile-upload">
          <img :src="profileImage || defaultImage" alt="User Icon" class="profile-icon" />
        </label>
        <span class="profile-name">{{ isLoggedIn ? userName : 'Tamu' }}</span>
      </div>

      <!-- Menu -->
      <div class="sidebar-content">
        <template v-if="!isLoggedIn">
          <router-link to="/login" class="sidebar-item">
            <div class="sidebar-text">Log In</div>
          </router-link>
        </template>

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
            <div class="sidebar-text">Logout</div>
          </router-link>
        </template>
      </div>
    </div>
  </div>
</template>


<script>
import { useUserStore } from '@/stores/user';
import { computed } from 'vue';
import defaultImage from '@/assets/profil.jpeg';

export default {
  setup() {
    const userStore = useUserStore();

    const profileImage = computed(() => userStore.photoUrl || defaultImage);

    return {
      user: userStore,
      profileImage,
    };
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
.sidebar-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4); /* efek backdrop */
  z-index: 99;
  display: flex;
}

.sidebar {
  width: 250px;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.2);
  z-index: 100;
  transition: transform 0.3s ease-in-out;
  transform: translateX(0);
}

.profile-header {
  padding: 20px;
  background-color: #2f4036;
  display: flex;
  align-items: center;
  width: 100%;
}

.sidebar-content {
  flex: 1;
  padding-top: 20px;
  overflow-y: auto;
}

.sidebar-wrapper-enter-active, .sidebar-wrapper-leave-active {
  transition: opacity 0.3s ease;
}

.sidebar-wrapper-enter-from, .sidebar-wrapper-leave-to {
  opacity: 0;
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
