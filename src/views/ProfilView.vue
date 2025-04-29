<template>
  <div class="profile-container">
    <!-- Header -->
    <div class="profile-header">
      <button class="back-button" @click="goBack">←</button>

      <div class="profile-image-wrapper">
        <input type="file" ref="fileInput" @change="onFileChange" style="display: none" />
        <img :src="profileImage" class="profile-image" alt="Profile" />
        <button class="edit-button" @click="$refs.fileInput.click()">✏️</button>
      </div>

      <p class="username">User</p>
      <p class="email">{{ user.email }}</p>
    </div>

    <!-- Info Section -->
    <div class="profile-info">
      <div class="info-item">
        <label>Nama</label>
        <p>{{ user.name }}</p>
      </div>
      <div class="info-item">
        <label>NIP</label>
        <p>{{ user.nip }}</p>
      </div>
      <div class="info-item">
        <label>Tahun Masuk</label>
        <p>{{ user.entryDate }}</p>
      </div>
    </div>

    <BlokPopup
      v-if="showModal"
      title="Ganti Foto Profil"
      message="Apakah anda yakin untuk mengganti foto profil anda?"
      :konfirmasi="'YA'"
      :batalkan="'BATAL'"
      @confirm="confirmUpload"
      @cancel="cancelUpload"
    />
  </div>
</template>

<script>
import BlokPopup from '@/components/BlokPopup.vue';
import defaultImage from '@/assets/profil.jpeg';
import { useUserStore } from '@/stores/user';
import { computed, ref } from 'vue';

export default {
  components: {
    BlokPopup,
  },
  setup() {
    const userStore = useUserStore();
    const showModal = ref(false);
    const selectedFile = ref(null);

    const profileImage = computed(() => {
      return userStore.photoUrl || defaultImage;
    });

    const fileInput = ref(null);

    const onFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        selectedFile.value = file;
        showModal.value = true;
      }
    };

    const confirmUpload = () => {
      const formData = new FormData();
      formData.append('photo', selectedFile.value);

      // Simulasi update foto sementara
      const tempUrl = URL.createObjectURL(selectedFile.value);
      userStore.setPhotoUrl(tempUrl);
      showModal.value = false;
    };

    const cancelUpload = () => {
      showModal.value = false;
      selectedFile.value = null;
    };

    const goBack = () => {
      window.history.back();
    };

    return {
      user: userStore,
      profileImage,
      showModal,
      selectedFile,
      onFileChange,
      confirmUpload,
      cancelUpload,
      fileInput,
      goBack,
    };
  }
};
</script>

<style scoped>
.profile-container {
  font-family: sans-serif;
  min-height: 100vh;
  background-color: #fff;
  color: #000;
}

.profile-header {
  background-color: #2c3930;
  color: #fff;
  text-align: center;
  padding: 2rem 1rem;
  position: relative;
}

.back-button {
  position: absolute;
  left: 1rem;
  top: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: white;
  cursor: pointer;
}

.profile-image-wrapper {
  position: relative;
  display: inline-block;
}

.profile-image {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid white;
}

.edit-button {
  position: absolute;
  right: 0;
  bottom: 0;
  background: white;
  border: none;
  border-radius: 50%;
  padding: 5px;
  cursor: pointer;
}

.username {
  font-weight: bold;
  margin-top: 0.5rem;
}

.email {
  font-size: 0.9rem;
  color: #ccc;
}

.profile-info {
  padding: 1rem;
  max-width: 600px;
  margin: auto;
}

.info-item {
  border-bottom: 1px solid #ccc;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
}

.info-item label {
  display: block;
  font-size: 0.85rem;
  color: #555;
}

.info-item p {
  font-weight: bold;
  margin: 0.2rem 0 0;
}

@media (min-width: 768px) {
  .profile-header {
    padding: 3rem 1rem;
  }

  .profile-image {
    width: 128px;
    height: 128px;
  }
}
</style>
