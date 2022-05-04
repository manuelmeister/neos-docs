import DefaultTheme from 'vitepress/theme'
import Layout from './components/Layout.vue'
import './custom.css'

export default {
    ...DefaultTheme,
    Layout,
    enhanceApp({ app }) {
        // register global components
        app.component('MyGlobalComponent' /* ... */)
    }
};
