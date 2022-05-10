import DefaultTheme from 'vitepress/theme'
import Layout from './components/Layout.vue'
import Example from './components/Example.vue'
import './custom.css'

export default {
    ...DefaultTheme,
    Layout,
    enhanceApp({ app }) {
        app.component('Example', Example)
    }
};
