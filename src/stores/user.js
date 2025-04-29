// src/stores/user.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    name: '',
    nip: '',
    email: '',
    entryDate: '',
    photoUrl: '',
  }),
  actions: {
    setUser(userData) {
      this.name = userData.name;
      this.nip = userData.nip;
      this.email = userData.email;
      this.entryDate = userData.entryDate;
      this.photoUrl = userData.photoUrl;
    },
    setPhotoUrl(photoUrl) {
      this.photoUrl = photoUrl;
    },
  },
});
