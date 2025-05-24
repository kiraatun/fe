<template>
  <div class="profile-container">
    <!-- Header -->
    <div class="profile-header">
      <button class="back-button" @click="goBack">
        <img src="@/assets/arrow-left.png" alt="" />
      </button>

      <p class="username">{{ user.name || 'Pengguna' }}</p>
      <p class="email">{{ user.email || 'email@gmail.com' }}</p>
    </div>

    <!-- Info Section -->
    <div class="profile-info">
      <div class="info-item">
        <label>Nama</label>
        <p>{{ user.name || 'Nama Guru' }}</p>
      </div>
      <div class="info-item">
        <label>NIP</label>
        <p>{{ user.nip || 'NIP' }}</p>
      </div>
      <div class="info-item">
        <label>No Telepon</label>
        <p>{{ user.telepon || 'No Telepon' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const user = JSON.parse(localStorage.getItem('user') || '{}')

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.profil-container {
  height: 100vh;
  margin: 0;
  padding: 0;
}

.profile-header {
  background-color: #2c3930;
  color: #fff;
  text-align: center;
  padding: 0.8rem 0.5rem;
  position: relative;
}

.username {
  font-weight: bold;
  font-size: 1.3rem;
  margin-top: 0.5rem;
}

.email {
  font-size: 0.7rem;
  color: #ccc;
  margin-top: 0.2rem;
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

.profile-info {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  width: 100%;
  margin: auto;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 90px);
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
  color: #000;
}
</style>
