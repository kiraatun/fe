<template>
  <div class="container">
    <!-- Versi Mobile -->
    <div class="mobile-panel">
      <div class="atas">
      </div>
      <div class="bawah">
        <h1>Masuk Ke Smartkartika</h1>
        <button class="google-login" @click="loginWithGoogle">
          <span>Masuk Dengan Akun Google</span>
          <img src="../assets/google.png" alt="Google Logo">
        </button>
      </div>
    </div>

    <!-- Versi Desktop -->
    <div class="left-panel">
      <h2>Semua Kegiatan Dapat Kemudahan</h2>
    </div>
    <div class="right-panel">
      <h1>LOG IN</h1>
      <button class="google-login" @click="loginWithGoogle">
        <span>Masuk dengan akun google</span>
        <img src="../assets/google.png" alt="Google Logo">
      </button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    loginWithGoogle() {
      // Logic untuk login dengan Google
      console.log("Login dengan Google");
    }
  }
};
</script>

<style scoped>
/* Layout Dasar */
.container {
  display: flex;
  height: 100vh;
}

.mobile-panel {
  display: none;
  flex-direction: column;
  height: 100vh; /* Menutupi seluruh tinggi layar */
}

/* Class 'atas' hanya menampilkan background image dari CSS global */
.mobile-panel .atas {
  flex: 2; /* Mengisi ruang tersisa */
  background-size: cover; /* Memastikan gambar latar belakang tetap proporsional */
  background-position: center; /* Memusatkan gambar */
}

/* Class 'bawah' dengan background putih dan konten terpusat */
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

.mobile-panel .bawah h1 {
  font-size: 1.8rem;
  font-weight: 900;
  color: #000; /* Warna teks */
  margin-bottom: 20px;
  text-align: center;
}

.mobile-panel .google-login {
  background-color: #2c3930;
  border: none;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: white;
  cursor: pointer;
  width: 80%;
  max-width: 300px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s ease;
}

.mobile-panel .google-login img {
  width: 24px;
  height: 24px;
  margin-left: 10px;
}

.mobile-panel .google-login:hover {
  background-color: #1f2922; /* Warna lebih gelap saat hover */
}

/* Desktop Layout */
.left-panel {
  color: #DCD7C9;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.left-panel h2 {
  font-size: 25px;
  font-weight: 600;
}

.right-panel {
  color: #000;
  flex: 2;
  background-color: white;
  display: flex;
  flex-direction: column;
  padding: 40px;
  border-top-left-radius: 40px;
  border-bottom-left-radius: 40px;
}

.right-panel h1 {
  font-size: 64px;
  font-weight: 1000;
  margin-bottom: 4rem;
}

.google-login {
  background-color: #DEA67A;
  border: none;
  border-radius: 8px;
  padding: 16px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s;
}

.google-login img {
  background-color: white;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  margin-right: 10px;
  margin-left: 16px;
}

.google-login:hover {
  background-color: #C48863;
  cursor: pointer;
}

/* Responsiveness */
@media (max-width: 768px) {
  .container {
    display: block;
  }

  .mobile-panel {
    display: flex; /* Aktifkan mobile layout */
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .left-panel, .right-panel {
    display: none; /* Sembunyikan versi desktop */
  }
}
</style>
