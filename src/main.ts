import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import mermaid from 'mermaid'

createApp(App).mount('#app')
mermaid.initialize({ startOnLoad: false, fontFamily: 'Fira Code', theme: 'neutral' })
Object.defineProperty(document, 'mermaid', { value: mermaid })
