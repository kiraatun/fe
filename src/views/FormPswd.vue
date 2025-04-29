<template>
  <div class="container">
    <!-- Versi Mobile -->
    <div class="mobile-panel">
      <div class="atas">
      </div>
      <div class="bawah">
        <h2>Masuk Ke Smartkartika</h2>
        <div class="input-container">
          <label for="username-input" class="input-label">Username</label>
          <input
            id="username-input"
            v-model="username"
            type="username"
            class="input-box"
          />
          <label for="password-input" class="input-label">Kode</label>
          <input
            id="password-input"
            v-model="password"
            type="password"
            class="input-box"
          />
          <!-- <a href="#" class="forgot-password">Lupa kode role?</a> -->
        </div>

        <button @click="handleLogin" class="login-button">Masuk</button>

      </div>
    </div>
  </div>
</template>

<script>

</script>

<style scoped>
/* Layout Dasar */
.container {
  display: flex;
  height: 100vh;
}

.mobile-panel {
  flex-direction: column;
  height: 100vh; /* Menutupi seluruh tinggi layar */
}

.mobile-panel .atas {
  flex: 1; /* Mengisi ruang tersisa */
  background-size: cover; /* Memastikan gambar latar belakang tetap proporsional */
  background-position: center; /* Memusatkan gambar */
}

.mobile-panel .bawah {
  flex:1; /* Mengisi ruang tersisa */
  background-color: white;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  margin: 0;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
}

.mobile-panel .bawah h2 {
  font-size: 1.8rem;
  font-weight: 900;
  color: #000; /* Warna teks */
  margin-top: 0;
  margin-bottom: 50px;
  text-align: center;
}

.mobile-panel .input-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 20px; /* Tambahkan jarak antara input dan tombol */
}

.mobile-panel .input-label {
  color: #000;
  font-size: 14px;
  margin-bottom: 10px;
}

.mobile-panel .input-box {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.mobile-panel .forgot-password {
  position: absolute;
  bottom: -20px; /* Jarak dari bawah kotak input */
  right: 0; /* Posisi kanan */
  font-size: 12px;
  color: #2c3930;
  text-decoration: none;
}

.mobile-panel .forgot-password:hover {
  text-decoration: underline;
}

.mobile-panel .login-button {
  margin-top: 20px;
  background-color: #2c3930;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 80%;

}

.mobile-panel .login-button:hover {
  background-color: #1f2922;
}

@media (max-width: 768px) {
  .container {
    display: block;
  }

  .mobile-panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}

@media (min-width: 768px) {
  .container {
    display: flex;
    flex-direction: row; /* ini yang benar */
    height: 100vh;
  }

  .mobile-panel {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100vh;
  }

  .mobile-panel .atas {
    width: 50%;
    background-size: cover;
    background-position: center;
  }

  .mobile-panel .bawah {
    width: 50%;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 40px;
    border-radius: 0;
    border-top-left-radius: 40px;
    border-bottom-left-radius: 40px;
  }
}
</style>
