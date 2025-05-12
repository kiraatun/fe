<template>
  <div class="container">
    <!-- Versi Mobile -->
    <div class="mobile-panel">
      <div class="atas"></div>
      <div class="bawah">
        <h2>Masuk Ke Smartkartika</h2>
        <div class="input-container">
          <label for="username-input" class="input-label">Username</label>
          <input id="username-input" v-model="username" type="username" class="input-box" />
          <label for="password-input" class="input-label">Kode</label>
          <input id="password-input" v-model="password" type="password" class="input-box" />
          <!-- <a href="#" class="forgot-password">Lupa kode role?</a> -->
        </div>

        <button @click="handleLogin" class="login-button">Masuk</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const router = useRouter()
    const username = ref('')
    const password = ref('')

    const handleLogin = async () => {
      try {
        const response = await axios.post('http://localhost:8000/api/login', {
          username: username.value,
          password: password.value,
        })

        if (response.data.status === 'success') {
          alert(response.data.message)

          localStorage.setItem('isLoggedIn', 'true')
          localStorage.setItem('role', response.data.role)

          // Cek role untuk menentukan ke mana diarahkan
          if (response.data.role === 'guru') {
            router.push('/dashboard-guru')
          } else if (response.data.role === 'ortu') {
            router.push('/profil') // ke ProfilView.vue
          }
          localStorage.setItem('userName', response.data.name)
        }
      } catch (error) {
        alert('Login gagal. Periksa username dan password.')
      }
    }

    return {
      username,
      password,
      handleLogin,
    }
  },
}
</script>

<style scoped>
/* Layout Dasar */
.container {
  display: flex;
  height: 100vh;
}

.mobile-panel {
  flex-direction: column;
  height: 100vh;
}

.mobile-panel .atas {
  flex: 1;
  background-size: cover;
  background-position: center;
}

.mobile-panel .bawah {
  flex: 1;
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
  color: #000;
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
  margin-bottom: 20px;
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
  bottom: -20px;
  right: 0;
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
    flex-direction: row;
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
