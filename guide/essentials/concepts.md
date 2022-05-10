# Core Concepts

::: info Content
Foundation, Database, Rendering, Configuration, Packages
:::

::: info Content
Diagrams, Lifecycle  
What has Flow to do with this?
:::

## Structured Content Storage
Neos stores all content in a hierarchical and structured way in a so-called Content Repository,
which can be imagined as a big tree of data. We call these data elements Nodes.
The structure of this data can be defined via NodeTypes.
The NodeTypes also define how editing works in the Neos backend.

Because the content is stored in a structured way, this allows to re-use content easily,
and adjust it as needed during rendering.

## Flexible Rendering
Rendering is based on the [Fusion templating language](/guide/rendering/fusion).
which helps to configure the rendering by assembling individual parts.

On top of Fusion, the modern templating language AFX has been developed.
[AFX&nbsp;(Atomic&nbsp;Fusion)](/guide/rendering/afx) is heavily inspired by React's JSX
and allows you to write rendering logic in a way that resembles HTML.

Additionally, it also supports [Fluid](/guide/rendering/fluid), Flow Framework's default template language.

## Configurations
Neos allows you to configure most aspects in YAML setting files.
The great advantage of this compared to saving the configuration in the database is,
that you can easily commit, merge and manage your configurations in git.
They are update-save and can be configured differently for each application context.

## Packages
Neos and Flow Projects are a bit differently structured, than other frameworks.

