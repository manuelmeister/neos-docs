url: /api/upgrade-instructions/3/upgrade-instructions-3-3-4-0
# Upgrade Instructions 3.3 → 4.0

By using composer, you can update an existing installation to a specific version, without having to create a new project.

For further information on what changed please take a look at the [release notes](https://neos.readthedocs.io/en/4.0/Appendixes/ReleaseNotes/400.html) and the [changelog](https://neos.readthedocs.io/en/4.0/Appendixes/ChangeLogs/400.html).

## New Requirements

For running Neos 4.0 you need to satisfy all of the following new Requirements.

*   Your system must run PHP **7.1.x** or higher
*   If you are using an MySQL based database you must use at least **MySQL 5.7.x** or **MariaDB 10.2.x**

## Instructions

Before doing substantial changes, **make sure you create a backup of the database and files**!

```bash
cd /installation-root/
# Update the core package dependencies
composer require --no-update "neos/neos:~4.0.0"
composer require --no-update "neos/nodetypes:~4.0.0"

# Update optional package dependencies (if installed)
composer require --no-update "neos/demo:~4.0.0"
composer require --no-update "neos/site-kickstarter:~4.0.0"
```

If you have development packages in your composer manifest, update them to match as well:

```bash
# Update development packages (if installed)
composer require --no-update --dev "neos/buildessentials:5.0.x-dev"
```

## Getting the new UI

To upgrade an existing project to the new React UI have add the following dependencies.

```bash
# Change into your Neos directory
cd /installation-root/

# Flush the caches 
./flow flow:cache:flush --force

# Update the core package dependencies
composer require --no-update "neos/neos-ui:~1.3.0"
composer require --no-update "neos/neos-ui-compiled:~1.3.0"
```

> **ℹ️ Custom Inspector Editors**
> 
> If your project uses custom inspector-editors you will have to rewrite them for the new UI. We prepared the package [neos-ui-extensibility-examples](https://github.com/neos/neos-ui-extensibility-examples) to help you doing so.

## Breaking Changes

Some breaking changes did happen so in case you used the following mentioned things in your code, you will have to replace this:

1.  Fluid Form Validation Viewhelper: If you used this Viewhelper **<f:form.validationResults>** you will have to replace it with this one **<f:validation.results>**.
2.  Fluid Base Viewhelper: If you used this Viewhelper **<f:base>** you will have to remove it, because it is not longer supported
3.  In case you've implemented your own backend modules and are using Font Awesome icons, you may run into compatibility issues due to the upgrade to Font Awesome 5. For a detailed description of how to substitute older icons for their updated versions, see their [documentation](https://fontawesome.com/how-to-use/upgrading-from-4).
4.  There is a potentially breaking change - if you have Fusion prototypes which have the same name as your document node types. Make sure to double-check that everything is rendered correctly. The [documentation on page rendering](http://neos.readthedocs.io/en/stable/CreatingASite/RenderingCustomMarkup/PageRendering.html) has been updated to reflect the new best practice.
5.  The current used Symfony Yaml Component version 4.0 is stricter in some places than the older one. For example don't use keys more than once in your NodeTypes Configuration. For more Information have a look at the [documentation](https://symfony.com/doc/current/components/yaml.html)
6.  By default, all proxies were trusted beforehand, but this is an usafe setting in most setups. This is breaking if you use a CDN or reverse proxy on your server and relied on the previous unsafe default setting. In that case you should instead provide a list of the IP ranges of your proxy/CDN servers, either directly or through the FLOW\_HTTP\_TRUSTED\_PROXIES environment variable or explicitly switch back to trust all proxy servers by setting the value to ‘\*’.

### Finish the update

```bash
# Update the packages
composer update

# Flush the caches
./flow flow:cache:flush --force

# Run code migrations (as needed for any packages that need to be migrated)
./flow flow:core:migrate <Vendor.PackageName>

# Set database charset and update to the new default given character set and collation (defaults to utf8mb4 and utf8mb4_unicode_ci).
./flow database:setcharset

# Run database migrations
./flow doctrine:migrate

# Publish resources
./flow resource:publish
```

## Troubleshooting

If you run into trouble with Neos content or resources, the following may help: 

```bash
# If you get error messages when running Flow CLI commands:
rm -rf Data/Temporary

# If you experience issues with pages not working, try 
./flow node:repair

# If you experience issues with resources, thumbnail or assets, try
./flow resource:clean
./flow media:clearthumbnails
```