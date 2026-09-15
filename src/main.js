import { createApp } from 'vue'
import App from './app/App.vue' // เช็ก Path ให้ตรงกับตำแหน่ง App.vue จริงของคุณ
import router from './router'
import '../styles/style.css'

const app = createApp(App)

app.use(router)
app.mount('#app')