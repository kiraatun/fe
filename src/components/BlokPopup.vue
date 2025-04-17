<template>
  <div class="popup-container">
    <div class="popup">
      <h2>{{ title }}</h2>
      <p>{{ message }}</p>
      <button @click="confirm" class="confirm-button">{{ konfirmasi }}</button>
      <button @click="cancel" class="cancel-button">{{ batalkan }}</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showPopup: Boolean,
    title: String,
    message: String,
    konfirmasi: String,
    batalkan: String,
  },
  methods: {
    confirm() {
      this.$emit('confirm'); // Emit event untuk confirm
    },
    cancel() {
      this.$emit('cancel'); // Emit event untuk membatalkan confirm
    },
  },
};
</script>

<style scoped>
.popup-container {
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

.popup {
  background-color: white;
  padding: 20px 50px 20px 50px;
  border-radius: 10px;
  text-align: center;
}

.popup h2{
  margin-bottom: 15px;
}

.popup p {
  margin-bottom: 30px;
}

.confirm-button, .cancel-button {
  display: block;
  margin: 10px auto;
  padding: 10px 20px;
  width: 80%;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.confirm-button {
  background-color: #dea67a;
  color: black;
}

.confirm-button:hover {
  background-color: #C48863;
}

.cancel-button {
  background-color: #7e7e7e;
  color: black;
}

.cancel-button:hover {
  background-color: #5c5c5c;
}
</style>
