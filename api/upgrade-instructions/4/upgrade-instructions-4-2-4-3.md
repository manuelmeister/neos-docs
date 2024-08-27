url: /api/upgrade-instructions/4/upgrade-instructions-4-2-4-3
# Upgrade Instructions 4.2 → 4.3

By using composer, you can update an existing installation to a specific version, without having to create a new project.

For further information on what changed please take a look at the release notes ([Neos](https://neos.readthedocs.io/en/4.3/Appendixes/ReleaseNotes/430.html), [Flow](https://flowframework.readthedocs.io/en/5.3/TheDefinitiveGuide/PartV/ReleaseNotes/530.html)) and the changelogs ([Neos](https://neos.readthedocs.io/en/4.3/Appendixes/ChangeLogs/430.html), [Flow](https://flowframework.readthedocs.io/en/5.3/TheDefinitiveGuide/PartV/ChangeLogs/530.html))

## Instructions

Before doing substantial changes, **make sure you create a backup of the database and files**!

```bash
cd /installation-root/
# Update the core package dependencies
composer require --no-update "neos/neos:~4.3.0"
composer require --no-update "neos/nodetypes:~4.3.0"

# Update optional package dependencies (if installed)
composer require --no-update "neos/demo:~4.3.0"
composer require --no-update "neos/site-kickstarter:~4.3.0"
```

If you have development packages in your composer manifest, update them to match as well:

```bash
# Update development packages (if installed)
composer require --no-update --dev "neos/buildessentials:5.3.x-dev"
```

## Breaking changes

This is a minor release so no breaking changes to public APIs were introduced.   
However the following changes may hit you if you used private apis in your project. 

##### **Neos**

1.  New NodeInterface and TraversableNodeInterface:  
    The new interfaces _NodeInterface_ and _TraversableNodeInterface are introduced to replace the classic NodeInterface which is now deprecated_. This change is necessary to ensure a smooth upgrade later on to the Event Sourced CR so people working with _NodeInterface_ in their custom code can already start using _TraversableNodeInterface_ today.
2.  Altered implementations of Fusion Menu:  
    The old _MenuImplementation classes_ (which were not part of the public API) are removed and new implementations for MenuItems were added. White the Fusion-api is the same, if you extended the implementation classes, you will have to adapt your code.

##### Flow

Introduce ActionResponse in preparation for clean PSR-7  
This is the continuation to a clear separation between MVC and HTTP stacks.   
The introduced ActionResponse offers a very limited interface to work with on the MVC level.

##### Neos & Flow 

We upgraded our internal testing suite to latest neos/behat version.  
In case you have behat tests in place, but did not set your own behat version in the dev dependencies consider it doing now.

##### Neos Demo 5.0

In case you are using Neos.Demo in your project as site-package or dependency (which we strongly advise against) you will have to check your code and run the included node-migrations since this is a major update with breaking changes. See the release notes for further information: [https://github.com/neos/Neos.Demo/releases/tag/5.0.0](https://github.com/neos/Neos.Demo/releases/tag/5.0.0)

##### Neos SEO Package 3.0

New installations come with the newest major release for the Neos SEO package. If you want to upgrade (which you have to do manually), be aware of the breaking changes within this major release. For details see:  
[https://github.com/neos/neos-seo/releases/tag/3.0.0](https://github.com/neos/neos-seo/releases/tag/3.0.0)

## Finish the update

```bash
# Update the packages
composer update

# Flush the caches
./flow flow:cache:flush --force
./flow flow:session:destroyAll

# Run code migrations, as needed for any packages that need to be
# migrated. Rule of thumb:
#
# - any 3rd party packages that still install fine at least claim
#   to work, and should be updated by their maintainer(s).
# - your own packages should always be treated with a migration,
#   at least it marks that as done.
#
./flow flow:core:migrate <Vendor.PackageName>

# If never done since 4.0 or 4.1, set database charset and update
# to the current default given character set and collation
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