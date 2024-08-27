url: /guide/manual/extending-neos-with-php-flow
# Extending Neos with PHP & Flow

You can extend Neos with Plugins and PHP code. This chapter explains the different possibilities.

Neos allows you to do a lot with YAML configuration and Fusion rendering. However, if you are building a complex site, you might want to integrate into external APIs or you want to add custom behavior. This is where PHP comes into the play.

In the following chapters we will dive into some common ways to extend the Neos core features by writing custom PHP implementations.

#### Extending Page Rendering

**To extend the Neos page rendering**, you can do the following:

*   [**Create custom Eel helpers**](/guide/manual/extending-neos-with-php-flow/custom-eel-helpers) to extend the Fusion rendering.  
    You'll most often need this for **little bits of PHP scripting throughout the rendering process**.
*   [**Create custom FlowQuery operations**](/guide/manual/extending-neos-with-php-flow/custom-flowquery-operations) to navigate differently in the Node tree.  
    **You'll rarely need this** - [Eel helpers](/guide/manual/extending-neos-with-php-flow/custom-eel-helpers) are often simpler to reach this goal.
*   [**Create custom Fusion objects**](/guide/manual/extending-neos-with-php-flow/custom-fusion-objects) for more advanced rendering with many different configuration options.  
    You'll often need this **when Eel Helpers are not expressive enough**.
*   [**Create a Plugin**](/guide/manual/extending-neos-with-php-flow/creating-a-plugin), which is a content element in Neos, implemented by a Flow MVC application (thus, having its individual Model, Controller and View).  
    You'll most often need this for **bigger, interactive applications reacting to user input** as part of your site.

#### Custom MVC Applications or Backend modules

**To write custom backend modules or separate applications not tied to the Neos content**, you can do the following:

*   [**Create an AFX-based application**](/guide/manual/extending-neos-with-php-flow/creating-afx-based-applications-backend-modules) with the Flow MVC framework.  
    **This allows you to write the view layer using a component-oriented style.**
*   Create a Fluid-based application with the Flow MVC framework.  
    **We recommend to do AFX-based applications instead, if you start from scatch.**
*   Add an MVC application as a backend module

#### Extend the Neos Editing User Interface

**To extend the Neos Editing Interface,** you can:

*   [**Create a custom Data Source**](/guide/manual/extending-neos-with-php-flow/custom-data-sources) to dynamically load the options of a select box in the inspector.
*   **Configure different Preview Modes** to show different renderings of the website.
*   Adjust the [**Node Creation Dialog**](/guide/manual/content-repository/node-creation-dialog)
*   create [**custom inspector editors with JavaScript**](/guide/manual/extending-the-user-interface/custom-inspector-editors)
*   [**Extend CKEditor with JavaScript**](/guide/manual/extending-the-user-interface/ckeditor-extensibility)

#### Extend the core data model

_The options below are not officially supported and may need major work on upgrades_ - the team sometimes uses these possibilities to try out new features.

**To extend the core data model of Neos,** you can do the following:

*   Create your own Node Implementation.
*   Use Slots to hook into points of the core, i.e. when a node is published.
*   Use [Aspect-Oriented Programming (AOP)](https://flowframework.readthedocs.io/en/stable/TheDefinitiveGuide/PartIII/AspectOrientedProgramming.html) to override arbitrary method implementations.

### Table of contents

*   [Custom Eel Helpers](/guide/manual/extending-neos-with-php-flow/custom-eel-helpers)
*   [Custom FlowQuery Operations](/guide/manual/extending-neos-with-php-flow/custom-flowquery-operations)
*   [Custom Fusion Objects](/guide/manual/extending-neos-with-php-flow/custom-fusion-objects)
*   [Creating a plugin](/guide/manual/extending-neos-with-php-flow/creating-a-plugin)
*   [Custom Backend Modules](/guide/manual/extending-neos-with-php-flow/custom-backend-modules)
*   [Custom Data Sources](/guide/manual/extending-neos-with-php-flow/custom-data-sources)
*   [Creating AFX-based Applications / Backend Modules](/guide/manual/extending-neos-with-php-flow/creating-afx-based-applications-backend-modules)