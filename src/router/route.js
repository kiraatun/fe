import { createRouter, createWebHistory } from 'vue-router'
import loginPage from '@/views/loginPage.vue'
import FormPswd from '@/views/FormPswd.vue'
import ProfilView from '@/views/ProfilView.vue'
import DasboardGuru from '@/views/DasboardGuru.vue'
import ReportForm from '@/components/ReportForm.vue'
import UpNews from '@/components/UpNews.vue'
import AddAct from '@/components/AddAct.vue'
import EditAct from '@/components/EditAct.vue'
import RemoveAct from '@/components/RemoveAct.vue'
import ManageAct from '@/components/ManageAct.vue'
import MainHome from '@/components/MainHome.vue'
import CommentTeach from '@/components/CommentTeach.vue'
import DashboardOrtu from '@/views/DashboardOrtu.vue'
import CommentOrtu from '@/components/CommentOrtu.vue'
import LaporanOrtu from '@/components/LaporanOrtu.vue'
import WelcomePage from '@/views/WelcomePage.vue'
import ProfilOrtu from '@/components/ProfilOrtu.vue'
import RegisterTeacher from '@/views/RegisterTeacher.vue'
import RegisterParent from '@/views/RegisterParent.vue'
import LaporanView from '@/components/LaporanView.vue'
import KelolaKegiatan from '@/components/KelolaKegiatan.vue'
import ViewKegiatan from '@/components/ViewKegiatan.vue'
import TabelKelas from '@/components/TabelKelas.vue'
import InformasiSiswa from '@/components/InformasiSiswa.vue'
import InformasiGuru from '@/components/InformasiGuru.vue'

const routes = [
  { path: '/', component: WelcomePage },
  { path: '/auth', name: 'auth', component: loginPage },
  //{ path: '/berita', name: 'home', component: MainHome }, // Home di dashboard
  { path: '/login', name: 'login', component: FormPswd },
  { path: '/profil', name: 'profil', component: ProfilView },
  { path: '/laporan', name: 'laporan', component: ReportForm },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DasboardGuru,
    children: [
      { path: '', name: 'dashboardRoot', component: null },
      { path: 'home', name: 'home', component: MainHome },
      { path: 'upload', name: 'upload', component: LaporanView },
      { path: 'ulpoadNews', name: 'uploadNews', component: UpNews },
      { path: 'manage', name: 'manage', component: KelolaKegiatan },
      { path: 'kelas', name: 'kelas', component: TabelKelas },
      { path: 'infosiswa', name: 'infosiswa', component: InformasiSiswa },
      { path: 'infoguru', name: 'infoguru', component: InformasiGuru },
    ],
  },
  //{ path: '/kelola/:submenu?', name: 'manage', component: ManageAct }, // Kelola Kegiatan
  //{ path: '/unggah', name: 'uploadNews', component: UpNews }, // Unggah Berita
  //{ path: '/kelola/add', name: 'upload', component: AddAct }, // Tambah Kegiatan
  { path: '/kelola/edit', name: 'edit', component: EditAct },
  { path: '/kelola/remove', name: 'remove', component: RemoveAct },
  { path: '/comment', name: 'comment', component: CommentTeach },
  { path: '/dashboardortu', component: DashboardOrtu },
  { path: '/commentp', component: CommentOrtu },
  { path: '/rapor', component: LaporanOrtu },
  { path: '/profilp', component: ProfilOrtu },
  { path: '/registerteach', component: RegisterTeacher },
  { path: '/registerparent', component: RegisterParent },
  { path: '/viewkegiatan', component: ViewKegiatan },
  //{ path: '/laporanview', name: 'laporanview', component: LaporanView },
  //{ path: '/manage', component: KelolaKegiatan },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
