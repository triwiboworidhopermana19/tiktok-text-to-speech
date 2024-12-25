import { createApp } from 'vue'

import App from './App.vue'

import './style.css'

import './demos/ipc'
import router from './routes'

// If you want use Node.js, the`nodeIntegration` needs to be enabled in the Main process.
// import './demos/node'


createApp(App)
  .use(router)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
