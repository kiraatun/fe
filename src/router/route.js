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
  { path: '/login', name: 'login', component: FormPswd },
  { path: '/laporan', name: 'laporan', component: ReportForm },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DasboardGuru,
    children: [
      { path: 'home', name: 'home', component: MainHome },
      { path: 'profil', name: 'profil', component: ProfilView },
      { path: 'upload', name: 'upload', component: LaporanView },
      { path: 'upberita', name: 'upberita', component: UpNews },
      { path: 'manage', name: 'manage', component: KelolaKegiatan },
      { path: 'kelas', name: 'kelas', component: TabelKelas },
      { path: 'infosiswa', name: 'infosiswa', component: InformasiSiswa },
      { path: 'infoguru', name: 'infoguru', component: InformasiGuru },
    ],
  },
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
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
