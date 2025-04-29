<template>
  <div class="popup-overlay">
    <div class="popup-container">
      <h2>{{ title }}</h2>
      <button class="popup-button" @click="$emit('close')">OKE</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SuccessPopup',
  props: {
    showPopup: Boolean,
    title: String,
  },
};
</script>

<style scoped>
.popup-overlay {
  color: #000;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.popup-container {
  background-color: white;
  padding: 20px 50px 20px 50px;
  border-radius: 10px;
  text-align: center;
}

.popup-container h2 {
  margin-bottom: 15px;
  font-weight: bold;
}

.popup-button {
  display: block;
  margin: 10px auto;
  padding: 10px 20px;
  width: 80%;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #dea67a;
  color: black;
}

.popup-button:hover {
  background-color: #C48863;
}
</style>
