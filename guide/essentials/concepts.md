# Core Concepts

The most important functions of a CMS are the database (structured content storage), the presentation (template rendering) of the content and the possibility to change the settings (configuration).

## Structured Content Storage
Neos stores all content in a hierarchical and structured way in a so-called Content Repository,
which can be imagined as a big tree of data. We call these data elements Nodes.
The structure of this data can be defined via NodeTypes.
The NodeTypes also define how editing works in the Neos backend.

## Template Rendering
Rendering is based on the [Fusion templating language](/guide/rendering/fusion){.secondary-link}.
which helps to configure the rendering by assembling individual parts.

On top of Fusion, the modern templating language AFX has been developed.
[AFX&nbsp;(Atomic&nbsp;Fusion)](/guide/rendering/afx){.secondary-link} is heavily inspired by React's JSX
and allows you to write rendering logic in a way that resembles HTML.

Additionally, it also supports [Fluid](/guide/rendering/fluid){.secondary-link}, the default template language of the Flow Framework.

::: info
Keep in mind that Neos is a backend application written in PHP and not JavaScript.
This means that JavaScript and CSS bundling is not intended,
and is not possible without additional community packages, bundlers and package managers like npm.
:::

## Configurations
From database connection setup to NodeTypes definitions, most aspects can be configured via YAML files.
This is similar to Symfony configuration files.

The big advantage compared to storing the configuration in the database
is that you can simply write the configurations in a text editor without having to connect to the database.
This way the configurations remain update-safe and can be configured differently for each application context.

## Packages
Neos and Flow Projects use Composer to manage their dependencies.
You define your packages inside the DistributionPackages folder.

