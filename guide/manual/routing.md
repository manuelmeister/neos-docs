url: /guide/manual/routing
# 9.x: Routing

> **⚠️ Neos 9.x Content**
> 
> This is content for the upcoming Neos 9.0 release with the **rewritten Content Repository** based on Event Sourcing.
> 
> **We heavily work on these docs right now, so expect rough edges.**

## What is Routing?

[Routing](/guide/features/routing) is responsible for two parts of the system:

*   when the user opens a URL like [docs.neos.io/guide/getting-started/introduction](https://docs.neos.io/guide/getting-started/introduction), **figuring out what content to show or what action to take** for this URL.
*   when the user wants to **create a link**, f.e. to a certain node, how to generate the URL for this.

As Neos is built upon the [Flow PHP framework](https://flowframework.readthedocs.io/), the routing is also built upon Flow's routing. Neos builds additional layers on top of this, which we'll explain in this chapter.

> **ℹ️ Excourse: Intro to Flow Framework PHP Routing**
> 
> We want to give a short intro into Flow's routing to give the full picture. For working with Neos and with content, this is usually not needed - except if you want to extend the Neos Backend or want to create e.g. new API endpoints for your frontend.
> 
> Flow's routing is built around the following concepts:
> 
> #### Routes.yaml - Configuration file
> 
> This file contains all the configured routes in the system. Each route maps a URL path to an MVC Controller + Action, so to a method in a PHP class.
> 
> #### UriBuilder - Creating links
> 
> On the PHP side, the [UriBuilder](https://github.com/neos/flow/blob/-/Classes/Mvc/Routing/UriBuilder.php) PHP class is responsible for creating new links to certain controllers/actions with certain arguments.
> 
> #### Extensibility via RoutePartHandlers
> 
> You can create custom implementations of [DynamicRoutePartInterface](https://github.com/neos/flow/blob/-/Classes/Mvc/Routing/DynamicRoutePartInterface.php), usually extending [AbstractRoutePart](https://github.com/neos/flow/blob/-/Classes/Mvc/Routing/AbstractRoutePart.php) or [DynamicRoutePart](https://github.com/neos/flow/blob/-/Classes/Mvc/Routing/DynamicRoutePart.php). You connect such a RoutePartHandler by referencing it in a `Routes.yaml` configuration.
> 
> [Flow Framework Reference: Routing](https://flowframework.readthedocs.io/en/stable/TheDefinitiveGuide/PartIII/Routing.html)

## Hierarchical URLs

In Neos, we do not expose Nodes in the URL via their internal IDs, as it is often done in legacy systems. Instead, out of the box, Neos provides a **semantic URL structure,** which reflects the structure of the site.

Every Document node in the system (=every page) has a property called **URL Path Segment** which can be found in the Inspector for the Page. When mapping a page to its URL, we traverse up to the site node and connect all the URL Path Segments of all parent pages together. By default, the URL Path Segment is generated from the page title on page creation, but it can also be updated standalone.

Thus, by building up your Node structure, you also set up your URL structure. This automatically leads to well usable URLs:

![](/_Resources/Persistent/7424880359adcaf8dc91aadfdbc88c2fa47eba8e/SCR-20230303-qsm-4.png)

Inspector showing the URL Path Segment property

## Shortcuts

Often, not every page in your page tree has a direct representation when rendering. for example, the **Getting Started** Node in the Neos Documentation is only used for structuring and rendering the menu - it does not have content of its own.

For these nodes, you'll usually create **Shortcut** nodes which **link to the first subpage.** This way, people will be automatically directed to proper pages, even if they start to remove segments in the URL.

![](/_Resources/Persistent/deb25bc26482674c9912a4c826cde27a95f6ca9b/SCR-20230303-qyxg-1920x970.png)

Shortcuts help structuring documents in the node tree

## Automatic and Manual Redirects

You might wonder what happens if you change URL path segments - does this break URLs for your users? Don't worry, we got you covered:

*   Every time you move a page, or change its URL slug, **redirects are automatically created** from the old to the new URL.
*   The system automatically keeps redirect chains short, so instead of a redirect /a -> /b -> /c, the system will automatically redirect /a -> /c.
*   You can also **create manual redirects** or change the automatically-created redirects via the Backend Module **Management -> Redirects**.
*   **Excel Export/Import** of redirects is also supported, which is helpful for planning bigger migrations.

Read on for details!

Automatic and Manual Redirects

## Multilanguage and Multi-Dimension Support

In multilingual (or generally multi-dimensional) installations of Neos, you can **translate the URL Path Segments** like any other property in the system. Neos will still know that the pages belong together across the different dimensions, so by adding a [DimensionMenu](/guide/manual/rendering/menu-fusion-objects#neos-neos-dimensionsmenuitems) on the page, the user can jump from the corresponding page in e.g. English to the same page in German, even if the URL is totally different:

Translated URL Slugs

On top, you can very flexibly configure how to map **the current language (=dimension)** to the URL (and vice versa). By default, the language slug is mapped to the first part of the URL; but you can also map it to the host name, or create your own custom PHP classes for doing the mapping.

[Configuring Dimension Resolving](/guide/manual/routing/configuring-dimension-resolving)

Custom DimensionResolvers

## All Subpages

*   [Architecture](/guide/manual/routing/architecture)
*   [Configuring Dimension Resolving](/guide/manual/routing/configuring-dimension-resolving)
*   [Reference: DimensionResolvers](/guide/manual/routing/reference-dimensionresolvers)