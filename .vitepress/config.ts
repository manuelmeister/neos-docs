import {defineConfigWithTheme} from 'vitepress'
import type {DefaultTheme} from 'vitepress'
import markdownItAttrs from 'markdown-it-attrs'
import markdownItAttrsSpans from 'markdown-it-bracketed-spans'

export default defineConfigWithTheme<DefaultTheme.Config>({
    lang: 'en-US',
    title: 'Neos Dev Docs',
    description: 'Neos CMS Developer Documentation',
    srcDir: '.',
    base: process.env.NODE_ENV === 'production' ? '/neos-docs' : '/',
    scrollOffset: 'header',
    markdown: {
        config: (md) => {
            // use more markdown-it plugins!
            md.use(markdownItAttrs)
            md.use(markdownItAttrsSpans)
        }
    },

    themeConfig: {
        logo: 'https://raw.githubusercontent.com/neos/brand/e52c18d3ace329133afdf0a2073f6cc672d0dcb0/logos/Avatars/neos_avatar_primary.svg',
        nav: [
            {
                text: 'Docs',
                items: [
                    {text: 'Guide', link: '/guide/introduction'},
                    {text: 'Tutorial', link: '/tutorial'},
                    {text: 'Examples', link: '/examples/hello-world'},
                    {text: 'Quick Start', link: '/guide/quickstart'},
                ]
            },
            {
                text: 'API',
                link: '/api'
            },
            {
                text: 'Help & Community',
                items: [
                    {text: 'GitHub', link: 'https://github.com/neos'},
                    {text: 'Forum', link: 'https://discuss.neos.io/'},
                    {text: 'Slack', link: 'https://slack.neos.io/'}
                ]
            },
            {
                text: 'About',
                items: [
                    {text: 'Neos', link: 'https://www.neos.io/community/about-neos/about.html'},
                    {text: 'Releases', link: 'https://www.neos.io/features/release-process.html'},
                    {text: 'Blog', link: 'https://www.neos.io/blog.html'}
                ]
            }
        ],
        sidebar: {
            '/guide': [
                {
                    text: '➡️ Getting Started',
                    children: [
                        {
                            text: 'Introduction', link: '/guide/introduction',
                        },
                        {
                            text: 'Quick Start', link: '/guide/quickstart'
                        }
                    ]
                },
                {
                    text: '🖥 Installation',
                    link: '/guide/install',
                    children: [
                        {
                            text: 'With Docker (recommended)',
                            link: '/guide/install/docker'
                        },
                        {
                            text: 'With DDev / Local Beach',
                            link: '/guide/install/ddev-localbeach'
                        },
                        {
                            text: 'Manual setup',
                            link: '/guide/install/manual'
                        }
                    ]
                },
                {
                    text: '🎒 Essentials',
                    link: '/guide/essentials',
                    children: [
                        {
                            text: 'Core Concepts', link: '/guide/essentials/concepts'
                        },
                        {
                            text: 'Database & NodeTypes', link: '/guide/essentials/database'
                        },
                        {
                            text: 'Rendering Basics', link: '/guide/essentials/rendering'
                        },
                        {
                            text: 'Backend Editor', link: '/guide/essentials/backend-ui'
                        },
                        {
                            text: 'Asset management', link: '/guide/essentials/assets'
                        }
                    ]
                },
                {
                    text: '🗄 Content Repository',
                    children: [
                        {
                            text: 'Data Structure', link: '#'
                        },
                        {
                            text: 'NodeTypes', link: '#'
                        },
                        {
                            text: 'Content Dimensions', link: '#'
                        }
                    ]
                },
                {
                    text: '🏗 Rendering In-Depth',
                    children: [
                        {
                            text: 'Fusion', link: '/guide/rendering/fusion'
                        },
                        {
                            text: 'Eel', link: '/guide/rendering/eel'
                        },
                        {
                            text: 'AFX', link: '/guide/rendering/afx'
                        },
                        {
                            text: 'Fluid', link: '/guide/rendering/fluid'
                        }
                    ]
                },
                {
                    text: '⚙️ Configuration',
                    children: [
                        {
                            text: 'Overview', link: '#'
                        },
                        {
                            text: 'Routing', link: '#'
                        },
                        {
                            text: 'Security', link: '#'
                        }
                    ]
                },
                {
                    text: '📖 Advanced',
                    children: [
                        {
                            text: 'Additional Features', link: '/guide/advanced/additional-features'
                        },
                        {
                            text: 'Best Practices & Limitations', link: '/guide/advanced/best-practices'
                        },
                        {
                            text: 'Extending Functionality', link: '/guide/advanced/extending-functionality'
                        },
                        {
                            text: 'Extending UI', link: '/guide/advanced/extending-ui'
                        }
                    ]
                },
                {
                    text: '🛠 Tooling',
                    children: [
                        {
                            text: 'IDE Support', link: '/guide/tooling/ide'
                        },
                        {
                            text: 'Dev Services', link: '/guide/tooling/services'
                        },
                        {
                            text: 'CLI', link: '/guide/tooling/cli'
                        }
                    ]
                }
            ],
            '/examples': [
                {
                    text: 'Examples',
                    children: [
                        {text: 'Hello World', link: '/examples/hello-world'},
                        {text: 'Bootstrap Card', link: '/examples/bootstrap-card'},
                        {text: 'Editable', link: '#'},
                        {text: 'Images', link: '#'},
                        {text: 'Custom NodeType', link: '#'}
                    ]
                }
            ],
            '/api': [
                {
                    text: 'Fusion',
                    children: [
                        {
                            text: 'Objects', link: '/api/fusion/objects'
                        },
                        {text: 'Neos specific Objects', link: '#'},
                    ]
                },
                {text: 'Flow', link: '#'},
                {text: 'Eel', link: '#'},
                {text: 'NodeType', link: '#'},
                {text: 'FlowQuery', link: '#'}
            ]
        },
        algolia: {
            apiKey: 'your_api_key',
            indexName: 'index_name'
        }
    },

    vite: {
        server: {
            host: true,
            fs: {
                // for when developing with locally linked theme
                allow: ['../..']
            }
        },
    }
})
