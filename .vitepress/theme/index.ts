import DefaultTheme from 'vitepress/theme'
import Layout from './components/Layout.vue'
import Example from './components/Example.vue'
import Tutorial from './components/Tutorial.vue'
import YoutubeEmbed from './components/YoutubeEmbed.vue'
import './custom.css'

export default {
    ...DefaultTheme,
    Layout,
    enhanceApp({ app }) {
        app.component('Example', Example)
        app.component('Tutorial', Tutorial)
        app.component('YoutubeEmbed', YoutubeEmbed)
    }
};
