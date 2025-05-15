<template>
  <div class="container-auth">
    <div class="bawah-wrapper">
      <div class="panel">
        <h2>Daftar Sebagai Orang Tua</h2>

        <!-- Form Parent -->
        <div v-if="step === 1">
          <div class="input-container">
            <label class="input-label">Nama</label>
            <input v-model="parent.name" type="text" class="input-box" required />
            <label class="input-label">Email</label>
            <input v-model="parent.email" type="email" class="input-box" required />
            <label class="input-label">Password</label>
            <input v-model="parent.password" type="password" class="input-box" required />
            <label class="input-label">No Telepon</label>
            <input v-model="parent.phone" type="text" class="input-box" required />
          </div>
          <div class="login-wrapper">
            <button @click="validateParent" class="login-button">Lanjut</button>
          </div>
          <div class="login-redirect">
            <span
              >Sudah punya akun?
              <router-link to="/login" class="login-link">Masuk di sini</router-link></span
            >
          </div>
        </div>

        <!-- Form Anak -->
        <div v-else>
          <h3 style="margin-top: 10px; font-size: 1rem">Data Anak</h3>
          <div class="input-container">
            <label class="input-label">Nama Anak</label>
            <input v-model="student.name" type="text" class="input-box" required />
            <label class="input-label">Kelas</label>
            <input v-model="student.class" type="text" class="input-box" required />
          </div>
          <div class="login-wrapper">
            <button @click="validateStudent" class="login-button">Daftar</button>
          </div>
        </div>
      </div>
    </div>
    <Popup v-if="showPopup" :title="popupMessage" @close="showPopup = false" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Popup from '@/components/MessagePopup.vue'

const isMobile = ref(true)
const step = ref(1)
const showPopup = ref(false)
const popupMessage = ref('')

const parent = ref({
  name: '',
  email: '',
  password: '',
  phone: '',
})

const student = ref({
  name: '',
  class: '',
})

const validateParent = () => {
  const { name, email, password, phone } = parent.value
  if (!name || !email || !password || !phone) {
    popupMessage.value = 'Harap isi semua kolom data orang tua.'
    showPopup.value = true
    return
  }
  step.value = 2
}

const validateStudent = () => {
  const { name, class: studentClass } = student.value
  if (!name || !studentClass) {
    popupMessage.value = 'Harap isi semua kolom data anak.'
    showPopup.value = true
    return
  }
  handleRegister()
}

const handleRegister = async () => {
  try {
    const payload = {
      parent: parent.value,
      student: student.value,
    }
    const response = await axios.post('http://localhost:8000/api/register-parent', payload)
    popupMessage.value = response.data.message
    showPopup.value = true
  } catch (err) {
    popupMessage.value = 'Registrasi gagal.'
    showPopup.value = true
  }
}

onMounted(() => {
  isMobile.value = window.innerWidth < 768
})
</script>

<style scoped>
.container-auth {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: none;
}

.bawah-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.panel {
  width: 100%;
  max-width: 400px;
  background-color: white;
  padding: 30px 20px;
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
}

.input-label {
  color: #000;
  font-size: 12px;
  margin-bottom: 2px;
}

.input-box {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
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
  margin-top: 1.5rem;
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
  .container-auth {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }

  .atas {
    display: none;
  }

  .bawah-wrapper {
    padding: 40px;
  }

  .panel {
    width: 100%;
    max-width: 800px;
  }
  .login-button {
    width: 40%;
  }
}
</style>
