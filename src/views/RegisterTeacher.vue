<template>
  <div class="container-auth">
    <div class="panel-left">
      <h2>SMARTKARTIKA</h2>
      <P>Semua Kegiatan Dapat Kemudahan</P>
    </div>
    <div class="panel">
      <h2>Daftar Sebagai Guru</h2>
      <form @submit.prevent="handleRegister">
        <div class="input-container">
          <label class="input-label">Nama</label>
          <input
            v-model="form.name"
            type="text"
            class="input-box"
            placeholder="Nama Guru"
            required
          />

          <label class="input-label">NIP</label>
          <input v-model="form.nip" type="text" class="input-box" placeholder="NIP" required />

          <label class="input-label">Email</label>
          <input
            v-model="form.email"
            type="email"
            class="input-box"
            placeholder="guru@gmail.com"
            required
          />

          <label class="input-label">Password</label>
          <div class="password-wrapper">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="input-box"
              placeholder="Password"
              required
            />
            <button type="button" class="toggle-password" @click="showPassword = !showPassword">
              <img :src="showPassword ? eyeOff : eye" alt="Toggle Password" />
            </button>
          </div>

          <label class="input-label">No Telepon</label>
          <input
            v-model="form.num_telp"
            type="text"
            class="input-box"
            placeholder="08xxx"
            required
          />
        </div>
        <div class="login-wrapper">
          <button type="submit" class="login-button">Daftar</button>
        </div>
      </form>
      <div class="login-redirect">
        <span>
          Sudah punya akun?
          <router-link to="/login" class="login-link">Masuk di sini</router-link>
        </span>
      </div>
      <Popup v-if="showPopup" :title="popupMessage" @close="showPopup = false" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import Popup from '@/components/MessagePopup.vue'
import eye from '@/assets/eye.png'
import eyeOff from '@/assets/eye-off.png'

const showPassword = ref(false)
const showPopup = ref(false)
const popupMessage = ref('')

const form = ref({
  name: '',
  nip: '',
  email: '',
  password: '',
  num_telp: '',
})

const handleRegister = async () => {
  // Validasi sederhana
  if (
    !form.value.name ||
    !form.value.nip ||
    !form.value.email ||
    !form.value.password ||
    !form.value.num_telp
  ) {
    popupMessage.value = 'Harap isi semua kolom terlebih dahulu.'
    showPopup.value = true
    return
  }
  try {
    const response = await axios.post('http://localhost:8000/api/teachers', form.value)
    popupMessage.value = response.data.message || 'Registrasi berhasil.'
    showPopup.value = true
    // Reset form jika ingin
    form.value = { name: '', nip: '', email: '', password: '', num_telp: '' }
  } catch (err) {
    popupMessage.value = err.response?.data?.message || 'Registrasi gagal.'
    showPopup.value = true
  }
}
</script>

<style scoped>
.container-auth {
  display: flex;
  height: 100vh;
  background-color: #fff;
}

.panel-left {
  display: none;
}

.panel {
  width: 100%;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  padding: 15px;
}

.panel h2 {
  font-size: 1.3rem;
  font-weight: 900;
  text-align: center;
  color: #000;
  margin-bottom: 15px;
}

.input-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 5px;
  margin-left: 1.5rem;
}

.input-label {
  color: #000;
  font-size: 12px;
  margin-bottom: 2px;
}

.input-box {
  width: 90%;
  padding: 10px;
  margin-bottom: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.input-box:focus::placeholder {
  color: transparent;
}

.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 90%;
}

.password-wrapper input {
  flex: 1;
}

.toggle-password {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.toggle-password img {
  width: 12px;
  height: 12px;
  margin-bottom: 0.4rem;
}

.login-wrapper {
  display: flex;
  justify-content: center;
}

.login-button {
  background-color: #2c3930;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  width: 50%;
  font-weight: bold;
  margin-top: 1rem;
}

.login-button:hover {
  background-color: #1f2922;
}

.login-redirect {
  margin-top: 1.2rem;
  text-align: center;
  font-size: 14px;
  color: #000;
}

.login-link {
  color: #2c3930;
  font-weight: bold;
  text-decoration: none;
}

.login-link:hover {
  text-decoration: underline;
}

@media (min-width: 768px) {
  .panel-left {
    flex: 1;
    width: 80%;
    background: #2c3930;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    color: #fff;
  }

  .panel-image {
    max-width: 100%;
    height: 100vh;
    object-fit: cover;
  }

  .panel {
    flex: 2;
    width: 100%;
    max-width: 750px;
    height: 100%;
    padding-top: 1rem;
    background-color: #fff;
    backdrop-filter: blur(10px);
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }
  .panel h2 {
    margin-top: 1rem;
  }
  .input-container {
    margin-left: 2rem;
  }
  .input-box {
    width: 90%;
  }
  .password-wrapper {
    width: 90%;
  }
  .login-redirect {
    margin-top: 0.5rem;
  }
  .login-button {
    width: 40%;
  }
}
</style>
