import { generateSitemap } from "sitemap-ts-advanced";

generateSitemap({
    exclude: ["/README"],
    hostname: "https://manuelmeister.github.io/",
    pathPrefix: "docs-neos",
    outDir: "./.vitepress/dist",
    changefreq: "weekly",
    priority: (route) => {
        switch (route) {
            case "/":
                return 1.0;

            case "/guide/introduction":
            case "/guide/essentials/concepts":
            case "/guide/essentials/rendering":
            case "/guide/rendering/fusion":
            case "/api/fusion/objects":
                return 0.8;

            default:
                return 0.5;
        }
    },
});
