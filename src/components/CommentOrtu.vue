<template>
  <div class="chat-page">
    <!-- Header -->
    <div class="chat-header" :style="{ backgroundColor: headerBg }">
      <button class="back-button" @click="goBack">
        <img src="@/assets/arrow-left.png" alt="Back" />
      </button>
      <h1 class="parent-name">{{ parentName }}</h1>
    </div>

    <!-- Chat Content -->
    <div class="chat-content" ref="chatContent">
      <div v-for="(message, index) in messages" :key="index" class="message-wrapper">
        <div v-if="shouldShowDate(index)" class="chat-date">{{ formatDate(message.date) }}</div>

        <div :class="['chat-bubble-wrapper', isSenderMe(message.sender) ? 'right' : 'left']">
          <div :class="['sender-label', isSenderMe(message.sender) ? 'right' : 'left']">
            {{ getSenderLabel(message.sender) }}
          </div>
          <div class="chat-bubble" :class="isSenderMe(message.sender) ? 'right' : 'left'">
            {{ message.text }}
          </div>
        </div>
      </div>
    </div>

    <!-- Input Message -->
    <div class="chat-input" :style="{ backgroundColor: inputBg }">
      <input
        v-model="newMessage"
        type="text"
        placeholder="Ketik sesuatu..."
        @keyup.enter="sendMessage"
      />
      <button @click="sendMessage">
        <img src="@/assets/message.png" alt="Send" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// MODE: 'parent'
const mode = 'parent' // Menetapkan mode ke 'parent'

const parentName = 'Ananda Andi' // Nama siswa
const teacherName = 'Bu Rina' // Nama guru

const messages = ref([
  { sender: 'Bu Rina', text: 'Hari ini ananda aktif di kelas.', date: '2025-01-20' },
  { sender: 'Anda', text: 'Alhamdulillah, terima kasih bu.', date: '2025-01-20' },
])

const newMessage = ref('')
const chatContent = ref(null)

const headerBg = computed(() => (mode === 'parent' ? '#A27B5C' : '#2c3930'))
const inputBg = computed(() => (mode === 'parent' ? '#A27B5C' : '#2c3930'))

function sendMessage() {
  if (newMessage.value.trim() !== '') {
    messages.value.push({
      sender: 'Anda',
      text: newMessage.value,
      date: new Date().toISOString().split('T')[0],
    })
    newMessage.value = ''
    nextTick(() => {
      scrollToBottom()
    })
  }
}

function goBack() {
  router.back()
}

function shouldShowDate(index) {
  if (index === 0) return true
  return messages.value[index].date !== messages.value[index - 1].date
}

function formatDate(dateStr) {
  const options = { day: 'numeric', month: 'long' }
  return new Date(dateStr).toLocaleDateString('id-ID', options)
}

function scrollToBottom() {
  if (chatContent.value) {
    chatContent.value.scrollTop = chatContent.value.scrollHeight
  }
}

function getSenderLabel(sender) {
  if (sender === 'Anda') return 'Saya'
  return mode === 'parent' ? teacherName : parentName
}

function isSenderMe(sender) {
  return sender === 'Anda'
}
</script>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  color: white;
  padding: 12px;
  background-color: #a27b5c;
}

.back-button {
  position: absolute;
  left: 12px;
  background: none;
  border: none;
  cursor: pointer;
}

.back-button img {
  width: 24px;
  height: 24px;
  filter: brightness(0) invert(1);
}

.parent-name {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}

.chat-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background-color: #f5f5f5;
}

.message-wrapper {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
}

.chat-date {
  text-align: center;
  font-size: 12px;
  color: white;
  background-color: #898989;
  padding: 6px 0;
  margin: 16px 0;
  border-radius: 12px;
  width: 100%;
}

.chat-bubble-wrapper {
  display: flex;
  flex-direction: column;
  max-width: 70%;
}

.left {
  align-self: flex-start;
}

.right {
  align-self: flex-end;
}

.sender-label {
  font-size: 11px;
  margin-bottom: 4px;
  color: #777;
  padding: 0 8px;
}

.sender-label.left {
  text-align: left;
}

.sender-label.right {
  text-align: right;
}

.chat-bubble {
  display: inline-block;
  padding: 10px 16px;
  border-radius: 16px;
  word-wrap: break-word;
}

.chat-bubble.left {
  background-color: #d3d3d3;
  color: #333;
  text-align: left;
}

.chat-bubble.right {
  background-color: #2c3930;
  color: white;
  text-align: left;
}

.chat-input {
  display: flex;
  padding: 1.5rem;
  background-color: #a27b5c;
  border-top: 1px solid #ccc;
}

.chat-input input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #ccc;
  border-radius: 20px;
  outline: none;
}

.chat-input button {
  background: #fff;
  border: none;
  margin-left: 8px;
  padding: 8px 12px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-input button img {
  width: 20px;
  height: 20px;
}

@media (min-width: 768px) {
  .chat-content {
    padding: 24px 80px;
  }

  .chat-bubble-wrapper {
    max-width: 50%;
  }
}
</style>
