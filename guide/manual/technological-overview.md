url: /guide/manual/technological-overview
# Tech­no­logi­cal Overview

We have quite a few technologies involved here. Take your time to understand them before you build your site. 

Neos is a PHP application which runs on a web server like apache/nginx and an SQL database. It is based on top of the PHP framework [Flow](https://flow.neos.io/), which is developed by the Neos team as a basis for Neos as well.

The two main areas which integrators are working with are configuring _structured content storage_ and defining _rendering_. For those you will mostly not need PHP – Neos provides very powerful abstractions.

Though we do not exactly use a classic [MVC pattern](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller), it might help you as a concept to get started with Neos. When compared to an MVC pattern, the _structured content storage_ mostly defines the model, the view part is handled in _rendering_, and the controllers are optional via the framework Flow.

#### Structured Content Storage

Neos stores all content in a hierarchical and structured way in a so-called [Content Repository](/guide/manual/content-repository), which can be imagined as a big tree of data. We call these data elements _Nodes_. The structure of this data can be defined via [NodeTypes](/guide/manual/content-repository/nodetype-definition). The NodeTypes also define how editing works in the Neos backend.

Because the content is stored in a structured way, this allows to re-use content easily, and adjust it as needed during rendering.

#### Flexible Rendering

Rendering is based on the [Fusion configuration language](/guide/manual/rendering/fusion), which helps to configure the rendering by assembling individual parts.

Inside Fusion, there are two templating languages available. Both allow you to write HTML, JSON of whatever output format you need:

*   [AFX](/guide/manual/rendering/afx) (Atomic Fusion) is a modern templating language directly integrated into Fusion. It has been heavily inspired by React's JSX, and it allows you to combine rendering logic of a component and the corresponding markup into a single file.
*   [Fluid](/guide/manual/rendering/fluid) is a classic templating engine (like Twig) which works with separate template HTML files, which contain special tags for loops, conditions and placeholders.

Fluid has been around in Neos since the first version, while AFX is rather new.

In the long run, we expect that AFX will be the recommended choice for all projects, though today, it is still a bit rough around some edges. Fluid will nevertheless be supported in the long run; there are no plans to deprecate its usage.

#### Configurations

Neos allows you to configure most aspects in YAML setting files. The great advantage of this compared to saving the configuration in the database is, that you can easily commit, merge and manage your configurations in git. They are update-save and can be configured differently for each application context.