url: /guide/manual/extending-neos-with-php-flow/creating-afx-based-applications-backend-modules
# Creating AFX-based Applications / Backend Modules

Using Atomic Fusion in Flow Applications and Backend Modules

As Neos is built upon the Flow framework, you can write PHP applications based on the MVC architecture alongside your Neos instance. To do this, there are generally three architecture options:

![](/_Resources/Persistent/637695ff3ff0d2189c83ddf8967a00eaabde9be4/diagram.svg)

Each of these options have **the same core principles, i.e. your application is structured as MVC application.** This means all knowledge on how you write plugins can equally be applied to writing custom applications or backend modules.

However, these different options vary a bit in the way they are embedded in Neos, which means **there are some differences in the View layer**:

*   **In custom applications**, the application is fully responsible for rendering all output, so for example it needs to render _<html_\> and _<head>_\-Tags as well.
*   **In custom backend modules**, you only **render the main part of the <body>**, the wrapping is provided by the Neos backend module APIs (as explained in the [Custom Backend Modules](/guide/manual/extending-neos-with-php-flow/custom-backend-modules) chapter).
*   **In custom plugins**, the plugins are embedded as part of the frontend website output (as a content element). Thus, you only **render a HTML snippet**. This is explained in [Creating a Plugin](/guide/manual/extending-neos-with-php-flow/creating-a-plugin).

## Using Atomic Fusion to structure the View

We'll now zoom in specifically **into the View layer** of our custom applications. Historically, the View has been mostly implemented with Fluid, which is a classical templating engine similar to Smarty or Twig. 

As we've made great experiences in using [AFX and Atomic Fusion for the frontend output](/guide/manual/rendering/afx), we now recommend to use the same patterns for custom applications as well. **This allows you to compose the view by putting different components together, instead of having one huge template per-action.**

> **ℹ️ Recommended since Neos 5.0**
> 
> With Neos 5.0, [we have updated the standalone FusionView](https://github.com/neos/neos-development-collection/pull/2569) quite a bit, making it easier to use. The principles explained here are also usable with older Neos versions, though the loading of Fusion files was more complicated in this case.

## Set Up

The following steps need to be taken to set up AFX.

#### 1\. require AFX

Through composer, you need to add **neos/fusion** and **neos/fusion-afx** as dependencies.

#### 2\. In your controller, use FusionView for rendering

set the _$defaultViewObjectName_ to the **FusionView** for rendering.

YourController.php:
```php
use Neos\Flow\Mvc\Controller\ActionController;
use Neos\Fusion\View\FusionView;

class YourController extends ActionController
{
    protected $defaultViewObjectName = FusionView::class;

    // ...
}
```

> **ℹ️ pick FusionView of Neos.Fusion**
> 
> If being in a Neos based projects, one FusionView resides in the Neos.Fusion package, and the other one in Neos.Neos.  The FusionView inside Neos.Neos is not meant to be used outside of the Neos core.  
>   
> **Make sure to choose the FusionView inside Neos.Fusion!**

## Suggestions for Fusion structure

Following and adapting the [Neos best practices](/guide/manual/best-practices), we suggest to use the following file structure:

```directory
Resources/Private/Fusion
├── Root.fusion
│
├── Integration
│   └── Controller
│       ├── [ControllerName]
│       │   └── [ControllerName][ActionName].fusion
│       └── ...
│
└── Presentation
    ├── Atom
    │   ├── ...
    │   └── ...
    │
    ├── Molecule
    │   └── ...
    │
    ├── Page
    │   ├── AbstractPage.fusion
    │   └── DefaultPage.fusion
    │
    └──BodyLayout
        └── Default.fusion
 
```

##### Root.fusion

In your package, add a _Root.fusion_ with the following contents:

Resources/Private/Fusion/Root.fusion:
```neosfusion
# you need to include ALL packages you want to use here, there is no AutoInclude!
include: resource://Neos.Fusion/Private/Fusion/Root.fusion

# include all files in here
include: **/*.fusion

```

As there is no AutoInclude of Fusion files through Settings like in Neos currently, **you need to include the Fusion for all packages you want to activate manually.**

##### Integration/Controller/\[Controller+Action\].fusion

For each controller action of your package, add a corresponding file with  contents like this:

Resources/Private/Fusion/Integration/Controller/BlogPost/BlogPostIndex.fusion:
```neosfusion
Your.Package.BlogPostController.index = Your.Package:Page.DefaultPage {
    body.content = afx`
        this should be the main body content.
    `
}
```

FusionView always maps your current controller/action to a path, which is then used for rendering.

We recommend to create a _DefaultPage_ which contains the normal rendering (see below).

##### Presentation/Atom/...  
Presentation/Molecule/...

For bigger projects, it might be helpful to structure your components according to atomic design into Atoms, Molecules and Organisms.

##### Presentation/Page/AbstractPage.fusion

Neos ships a default _Neos.Neos:Page_ Fusion object, which is however not usable for standalone applications. The following Fusion object contains a stripped-down version of this, ready for inclusion into your project.

**Currently, we recommend that you copy this file into your project, as the standard might still evolve further.**

Resources/Private/Fusion/Presentation/Page/AbstractPage.fusion:
```neosfusion
# This is a trimmed-down version of Neos.Neos:Page, usable for standalone usage in Flow applications.
#
# The "public API", like "head.titleTag.content", "body", or "body.javascripts" is exactly the same as
# in Neos.Neos:Page.
prototype(Your.Package:Page.AbstractPage) < prototype(Neos.Fusion:Component) {
    # add the DocType as processor; because it will break AFX.
    @process.addDocType = ${'<!DOCTYPE html>' + value}

    head = Neos.Fusion:Join {
        titleTag = Neos.Fusion:Tag {
            tagName = 'title'
        }
        # Script and CSS includes in the head should go here
        stylesheets = Neos.Fusion:Join
        javascripts = Neos.Fusion:Join
    }

    body {
        # Script includes before the closing body tag should go here
        javascripts = Neos.Fusion:Join
        # This processor appends the rendered javascripts Array to the rendered template
        @process.appendJavaScripts = ${value + this.javascripts}
    }

    renderer = afx`
        <html>
        <head>
            <meta charset="UTF-8" />
            {props.head}
        </head>
        <body>
            {props.body}
        </body>
        </html>
    `

    # enable Neos.Fusion:Debug helper
    @process.debugDump = Neos.Fusion:DebugDump
}

```

The Public API like _head.titleTag.content_ or _body_ or _body.javascripts_ still works as in _Neos.Neos:Page_, so that means you can also load Neos packages which hook into these places and **expect foreign Neos packages to work properly**.

##### Presentation/Page/DefaultPage.fusion

This is the main page template for your project.

**Adjust it as needed, and you can also create new variants if you need them.**

Resources/Private/Fusion/Presentation/Page/DefaultPage.fusion:
```neosfusion
prototype(Your.Package:Page.DefaultPage) < prototype(Your.Package:Page.AbstractPage) {
    head {
        headTags = Neos.Fusion:Component {
            renderer = afx`
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/>
                <meta http-equiv="x-ua-compatible" content="ie=edge"/>
            `
        }
        stylesheets {
            app = afx`
                <link rel="stylesheet" type="text/css" href="..."/>
            `
        }

    }
    body = Your.Package:BodyLayout.Default {
        javascripts.app = afx`
            <script src="..."></script>
        `
    }
}

```

This prototype contains the application-specific page template. **It connects JS and CSS with the BodyLayout.**

We delegate rendering of the body HTML to the **BodyLayout.Default** prototype (shown below), as this is a **Fusion Component** which is fully testable (e.g. using Monocle).

##### Presentation/BodyLayout/Default.fusion

We recommend to separate the body layout away from the _DefaultPage_, as we can then use a Fusion Component for this. With this separation, the body layout becomes renderable standalone, and can also be rendered in a style guide.

Resources/Private/Fusion/Presentation/BodyLayout/Default.fusion:
```neosfusion
prototype(Your.Package:BodyLayout.Default) < prototype(Neos.Fusion:Component) {
    content = ''
    teaserTitle = ''
    teaserText = ''

    renderer = afx`
        <main>
            <h1>{props.teaserTitle}</h1>
            <p>{props.teaserText}</p>
            {props.content}
        </main>
    `
}

```

## Summary: The Big Picture

How do all the different Fusion files fit together? The following sketch sums this up:

![](/_Resources/Persistent/5f997a3a7b22c0f51371ed6012389fddcf59bfea/diagram.svg)

**Summary:**

*   _**Page.AbstractPage**_ is a lighweight, api-compatible version of _Neos.Neos:Page_
*   **Page.DefaultPage** is the prototype for a full page. This is instanciated for each Controller action, with placeholders like _body.content_ filled individually.
*   **BodyLayout.Default** renders the general layout of the page body, implemented as _Neos.Fusion:Component_. Thus, it is possible to use Monocle as style guide for the page layout as well.