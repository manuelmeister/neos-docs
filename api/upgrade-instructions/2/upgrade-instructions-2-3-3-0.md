url: /api/upgrade-instructions/2/upgrade-instructions-2-3-3-0
# Upgrade Instructions 2.3 → 3.0

By using composer, you can update an existing installation to a specific version, without having to create a new project.

We have done our best do make the upgrade process as simple as possible. Due to all the refactoring, upgrading a site from 2.3 to 3.0 will probably not be as smooth as you have been used to during the 2.x releases. We have created a script to take some work off your shoulders, however we still recommend to have a look at things afterwards and check that everything is in order. For sites using more advanced features, you will need to perform a few steps manually. In case you have any problems with this guide, please get in touch with us via [discuss.neos.io](https://discuss.neos.io/) or on [Slack](https://neos-project.slack.com).

## Step by Step Guide

Upgrading your Neos project to 3.0 basically consists of the following steps:

*   Update the Composer dependencies of your projection distribution and your packages
*   Adjust your own PHP code and configuration files to match the changed API
*   Flush caches
*   Run database migrations

In order to keep your workload as small as possible, the Neos team created scripts which take care of almost all of the required changes. But as we can’t cover every special case, we advise you to review all the changes the migrations scripts committed and test your project carefully before deploying the changes to live.

#### Required Steps

1.  Make sure you have a backup of your Neos project files
2.  Download the Neos Distribution Upgrader script to your project directory and make it executable:  
    cd <your project directory>  
    wget [https://github.com/neos/distribution-upgrades/raw/master/build/DistributionUpgrader.phar](https://github.com/neos/distribution-upgrades/raw/master/build/DistributionUpgrader.phar) && chmod +x DistributionUpgrader.phar
3.  Run the Distribution Upgrader:  
    ./DistributionUpgrader.phar .
4.  Manually remove the file Web/index.php
5.  Review all the changes the Distribution Upgrader made: are the packages in composer.json looking okay? Are your Settings.yaml still valid?
6.  Update Composer dependencies:  
    composer -v update  
    or composer.phar -v update
7.  If there are any errors (unmet dependencies), identify the packages causing trouble and check if there are new releases / branches which support Neos 3.0 / Flow 4.0. You will have to require those versions or ask the package maintainer to provide a compatible version. After fixing the dependencies in your composer.json, continue with step 5 until all packages install correctly.
8.  Remove everything in Data/Temporary and the package states:  
    rm -rf Data/Temporary/\*  
    rm Configuration/PackageStates.php  
     
9.  Run the code migrations for packages you maintain:  
    ./flow flow:core:migrate Acme.MyWebsiteCom  
    Hint: if you migrate packages which are part of the project’s distribution (that is, they don’t reside in their own Git repository), you have to commit changes before you run core:migrate.
10.  Check if the Flow command line comes up without any errors:  
    ./flow  
     
11.  Migrate the database structure:  
    ./flow doctrine:migrate
12.  Test your website

If you haven’t adjusted your website for the changes of every Neos release, you might still need to modify some code referring to previously deprecated and now removed APIs.

#### Optional Steps

Adjust "type" in composer.json from "typo3-flow-\*" to "neos-\*".

## List of Changes

In order to check for yourself during the upgrade, and in order to get used to the new environment, here is a list of the most important changes and refactorings in Neos 3.0 and Flow 4.0. If you feel like anything is missing on this list, please get in touch with us via [discuss.neos.io](https://discuss.neos.io/) or on [Slack](https://neos-project.slack.com).

### Neos Only

*   New file ending for Fusion files
    *   .fusion replaces .ts2
    *   .ts2 is deprecated, but will still work until 4.0  
         
*   All Fusion code needs to change namespaces:
    *   TYPO3.TypoScript -> Neos.Fusion
    *   TYPO3.Neos -> Neos.Neos
*   Node type definitions that inherit from Neos node types need to change. TYPO3.Neos:SomeNodeType becomes Neos.Neos:SomeNodeType
*   The global Routes.yaml file is now deprecated and all Routes should be registered via settings for greater flexibility. The default Neos routes are included by default now. If you want to remove the default ".html" URL suffix, set the Neos.Flow.mvc.routes.'Neos.Neos'.variables:'defaultUriSuffix' setting to an empty string. Custom routes should be loaded via settings from the respective package ([more information in the documentation](http://flowframework.readthedocs.io/en/stable/TheDefinitiveGuide/PartIII/Routing.html#subroutes-from-settings)).
*   YAML config paths in packages:
    *   TYPO3 becomes Neos on the top level
    *   TYPO3.Neos.typoScript becomes Neos.Neos.fusion (on 3rd level; this is very important for all packages that use autoinclusion for TS, ([this is an example](https://github.com/Flowpack/Flowpack.Neos.FrontendLogin/pull/14/commits/31ce434c8be6f05e20517952b999d9c1fd942831))   
         

### Flow & Neos

*   PHP code
    *   All imports (“use” statements) need to be pointed to the new namespace
    *   Some domain objects and services have been renamed:
        *   Neos\\Flow\\Resource\\Resource -> Neos\\Flow\\ResourceManagement\\PersistentResource
        *   Neos\\Flow\\Resource\\Storage\\Object -> Neos\\Flow\\ResourceManagement\\Storage\\StorageObject
        *   Neos\\Neos\\Domain\\Service\\TypoScriptService -> Neos\\Neos\\Domain\\Service\\FusionService
        *   Neos\\Flow\\Error\\Message -> Neos\\Error\\Messages\\Message
    *   All places where AOP is used (custom aspects) need to be checked, annotations need to be pointed to the new namespace
    *   All classes from TYPO3\\Fluid are now in Neos\\FluidAdaptor
    *   File paths have changed, subfolders “Vendor/Package” are removed, because we are moving from PSR-0 to PSR-4 style autoloading. Do not forget to update the "autoload" section of your composer manifest to look [like this](https://github.com/neos/eel/blob/master/composer.json#L9-L13).
*   Configuration namespaces have changed:
    *   Settings.yaml
        *   TYPO3 Flow -> Neos Flow
        *   TYPO3 Neos -> Neos Neos
    *   Policy.yaml
        *   Roles change from TYPO3.Flow:Somebody to Neos.Flow:Somebody
        *   Privilege targets change from Neos\\Flow\\Security\\Authorization\\Privilege to Neos\\Flow\\Security\\Authorization\\Privilege namespace
    *   Objects.yaml
        *   Wherever a default Neos/Flow implementation was replaced this needs to be adapted to the new namespace
    *   Views.yaml
        *   If a default Neos or Flow view was replaced with Views.yaml, check that the request filter condition points to the correct (new) namespace
*   Fluid namespace imports need to change, e.g.   
    {namespace neos=Neos\\Neos\\ViewHelpers} -> {namespace neos=Neos\\Neos\\ViewHelpers}

### Fluid

*   Some [breaking changes](https://github.com/neos/flow-development-collection/issues?utf8=%E2%9C%93&q=is%3Aissue%20label%3A%22P%3A%20Fluid(Adaptor)%22%20) when implementing custom VHs
*   The "escapeOutput" core migration has been removed (see [PR on GitHub](https://github.com/neos/flow-development-collection/pull/788))

#### Breaking changes that might withstand smoke testing

Here is a list of changes that might not break your website immediately, but result in unwanted behaviour:

*   Make sure to update all your requirements in your custom composer.json files to the new namespace. E.g. “typo3/neos” is now “neos/neos” and “typo3/flow” is now “neos/flow”. Otherwise the package loading order will be incorrect and therefore settings for example won’t be merged in correct order.
*   The Fluid update changes the “AbstractConditionViewHelper” behaviour in a way that the expected outcome might flip after the second request. Make sure to obey the new way to implement it described [here](https://github.com/neos/flow-development-collection/blob/a4dec915c8c75d984e23831a8013503c8787fe2b/Neos.FluidAdaptor/Classes/Core/ViewHelper/AbstractConditionViewHelper.php#L26-L36) in case you have custom conditional view helpers.