url: /tutorials/creating-neos-flow-application-with-fusion-afx-and-ddev
# Creating a Neos Flow application with Fusion, AFX and DDEV

A step-by-step tutorial to show the needed steps to setup a fresh Flow application with Fusion, AFX and the DDEV tooling.

In this tutorial, we'll look at how to set up easily a [Neos Flow](https://flowframework.readthedocs.io/en/stable/TheDefinitiveGuide/index.html) application using the Docker tooling [DDEV.](https://ddev.com/) In doing so, we also use the recommended view/templating technologies [Fusion](/guide/manual/rendering/fusion) and [AFX](/guide/manual/rendering/afx).

> **ℹ️ DDEV setup for a Neos installation**
> 
> If you are looking for a DDEV setup for Neos specifically, you can check this out here: [Setup Neos with DDEV](/guide/installation-development-setup/ddev-local-beach/all-platforms-using-ddev-and-docker)  
>   
> This tutorial can serve you as a base for your custom Flow application or also for your next custom Neos Backend module or plugin.

## 1\. Prepare your DDEV environment

To install and configure your DDEV environment follow steps 1) and 3) and **skip step 2)** documented in "[Setup Neos with DDEV](/guide/installation-development-setup/ddev-local-beach/all-platforms-using-ddev-and-docker)". You will setup your Flow project in the next step below.

## 2\. Create the Flow application and start it

Create now via the `ddev` and `composer` command (more about [DDEV and Composer](https://ddev.readthedocs.io/en/latest/users/usage/developer-tools/#ddev-and-composer)) a first folder structure for our Flow application based on the Flow base distribution repository.

```bash
ddev composer create neos/flow-base-distribution
# Confirm that any existing content in the project root will be removed
```

This command can take a few minutes, because initially the necessary _DDEV_ container images have to be downloaded. After that we get an empty framework to develop a Flow application later.

Start the application: `ddev start`

With `ddev describe` you can get all the info about your application, e.g. what the url for the webserver is, etc.

For our application this is: `https://demo-app.ddev.site`.

When opening our application in the browser, an error message still appears.

In order for our empty Flow application to work, we still need to provide a correct `Settings.yaml`.

## 3\. Configure the Flow application

Create a `Configuration/Settings.yaml` file with the following content:

```yaml
Neos:
  Imagine:
    driver: Imagick
  Flow:
    persistence:
      backendOptions:
        driver: 'pdo_mysql'  # use pdo_pgsql for PostgreSQL
        charset: 'utf8mb4'   # change to utf8 when using PostgreSQL
        dbname: db
        user: db
        password: db
        host: db

    # The following lines register the Flow default routes
    # For productive use you should move this setting to the main package of this
    # application and/or create custom routes.
    mvc:
      routes:
        'Neos.Flow': TRUE

    # The following is necessary to allow ddev to act as a proxy on your local machine
    http:
      trustedProxies:
        proxies: "*"

  # The following is optional, but will redirect all mails directly to ddev's MailHog
  SwiftMailer:
    transport:
      type: 'Swift_SmtpTransport'
      options:
        host: 'localhost'
        port: 1025
        encryption: ~
```

This configuration will be loaded directly on the next load and our Flow application should now work correctly: `https://demo-app.ddev.site`

## 4\. Create a first Flow application package

We will now create our Flow application package:

```bash
ddev exec ./flow kickstart:package Demo.App
```

This command creates for us the basic skeleton for a Flow package. We can find this in the directory: `DistributionPackages/Demo.App`.

Also we can already call a first _index_ page with: `https://demo-app.ddev.site/demo.app`.

## 5\. Setup controller with Fusion and AFX

To develop a Flow application with Fusion and AFX certain commands and configurations need to be done.

The next steps are based on the following Neos documentation:

*   [Flow Fusion template support](https://flowframework.readthedocs.io/en/stable/TheDefinitiveGuide/PartV/ReleaseNotes/710.html?highlight=fusion#feature-add-fusion-template-support)
*   [Creating AFX-based Applications / Backend Modules](/guide/manual/extending-neos-with-php-flow/creating-afx-based-applications-backend-modules)

We will now create a first controller for our application:

```bash
ddev exec ./flow kickstart:actioncontroller --generate-fusion --generate-actions --generate-related Demo.App BlogArticle
```

The `--generate-fusion` option creates some example with Fusion templates.

We can now call our controller as follows: `https://demo-app.ddev.site/demo.app/blogarticle`.

But we still get an error:

`"View class has to implement ViewInterface but "Neos\Fusion\View\FusionView" in action "index" of controller "Demo\App\Controller\BlogArticleController" does not."`

For Fusion and AFX to work, the required dependencies and Flow configurations still need to be installed and configured.

Install the needed dependencies:

`ddev composer **require** neos**/**fusion neos**/**fusion**-**afx neos**/**fusion**-**form`

After that we clear the Flow cache and reload the package list:

`ddev exec **./**flow flow:cache:flush **--**force`

`ddev exec **./**flow neos**.**flow:package:rescan`

Now when the application is called with `https://demo-app.ddev.site/demo.app/blogarticle`, a correct page should be displayed.

If the following error message appears:

```php
Call to a member function parse() on null
```

then the config under `Configuration/Views.yaml` must be entered correctly.

If necessary, create a file `Configuration/Views.yaml` with the following content:

```yaml
- requestFilter: 'isPackage("Demo.App")'
  viewObjectName: 'Neos\Fusion\View\FusionView'
  options:
    fusionPathPatterns:
      - 'resource://Neos.Fusion/Private/Fusion'
      - 'resource://Demo.App/Private/Fusion'
```

## 6\. Flow application ready

Our new Flow application with Fusion and AFX is now ready and can be developed further. If you plan to use this initial setup as a base for your Neos custom Backend module or plugin, checkout the links at the end of this tutorial.

Currently there is still an error message regarding database access when trying to access `https://demo-app.ddev.site/demo.app/blogarticle`.

The appropriate database initializations are still missing, that would be a next step to tackle :).

## 7\. Done - shutdown DDEV and the application

With the following command you can shutdown your Flow application completely:  
`ddev poweroff`

Or if you only want to stop your container use: `ddev stop`

More DDEV CLI commands can be found [here](https://ddev.readthedocs.io/en/latest/users/usage/cli/).

## Learn more about extending Neos using Fusion and AFX

*   [Custom Backend Modules](/guide/manual/extending-neos-with-php-flow/custom-backend-modules)
*   [Creating AFX-based applications/backend module](/guide/manual/extending-neos-with-php-flow/creating-afx-based-applications-backend-modules)
*   [Creating a backend module with Fusion and Fusion.Form](/tutorials/creating-a-backend-module-with-fusion-and-fusion-form)

_Written by_ **Oliver Burkhalter**