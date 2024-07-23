import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
// import './styles/main.css'  // Make sure this line is present
import './assets/index.css'

// Import shadcn-vue components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert } from '@/components/ui/alert'

function main() {
    const app = createApp(App)

    app.use(createPinia())
    app.use(router)

    // Register shadcn-vue components globally
    app.component('Button', Button)
    app.component('Input', Input)
    app.component('Alert', Alert)

    app.mount('#app')
    return app
}

// call the main entrance
main()
