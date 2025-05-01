<template>
  <div class="welcome-wrapper">
    <!-- Left: Image or background section -->
    <div class="welcome-image-section">
      <img src="@/assets/playground.jpeg" alt="Welcome Illustration" />
    </div>

    <!-- Right: Content -->
    <div class="welcome-content">
      <h2 class="welcome-title">Semua Kegiatan<br />Dapat Kemudahan</h2>
      <h3 class="welcome-subtitle">SMARTKARTIKA</h3>
      <button class="welcome-button" @click="handleMulai">Mulai</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const handleMulai = () => {
  router.push('/login')
}
</script>

<style scoped>
.welcome-wrapper {
  display: flex;
  height: 100vh;
  flex-direction: column;
  background-color: #fff;
}

.welcome-image-section {
  display: none;
}

/* Content */
.welcome-content {
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  padding: 2rem 1rem;
  max-width: 500px;
  margin: 0 auto;
}

.welcome-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #000;
  margin-top: 2rem;
  line-height: 1.4;
}

.welcome-subtitle {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 3rem 0 2rem;
  color: #000;
}

.welcome-button {
  background-color: #2e3a32;
  color: #fff;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
  max-width: 300px;
  margin-bottom: 2rem;
}

.welcome-button:hover {
  background-color: #1f2822;
}

/* Desktop layout */
@media (min-width: 768px) {
  .welcome-wrapper {
    flex-direction: row;
  }
  .welcome-title {
    margin-bottom: 2rem;
  }
  .welcome-subtitle {
    margin-bottom: 2rem;
  }

  .welcome-image-section {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .welcome-image-section img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .welcome-content {
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .welcome-button {
    margin-top: 2rem;
  }
}
</style>
