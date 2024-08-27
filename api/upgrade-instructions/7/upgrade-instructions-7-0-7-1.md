url: /api/upgrade-instructions/7/upgrade-instructions-7-0-7-1
# Upgrade Instructions 7.0 → 7.1

By using composer, you can update an existing installation to a specific version, without having to create a new project.

For further information on what changed, please take a look at the changelogs ([Neos](https://neos.readthedocs.io/en/7.1/Appendixes/ChangeLogs/710.html), [Flow](https://flowframework.readthedocs.io/en/7.1/TheDefinitiveGuide/PartV/ChangeLogs/710.html))

## Update Instructions

Before making substantial changes, **make sure you create a backup of the database and files**!

```bash
cd /installation-root/
# Update the core package dependencies
composer require --no-update "neos/neos:~7.1.0"
composer require --no-update "neos/neos-ui:~7.1.0"
composer require --no-update "neos/site-kickstarter:~7.1.0"

# Update optional package dependencies (if installed)
composer require --no-update "neos/demo:~7.1.0"
```

If you still require `neos/neos-ui-compiled` in your composer.json, please remove the dependency since it's not needed anymore.

If you have development packages in your composer manifest, update them to match as well:

```bash
# Update development packages (if installed)
composer require --no-update --dev "neos/buildessentials:~7.1.0"
```

## Breaking changes

With this minor release no breaking changes have been added apart from a slight return type change in Flow ActionResponse and switching the default behaviour for enabling URL rewriting.

### Flow

Flow 7.1 contains a slightly breaking change if you used the **ActionResponse->getContentType()** method and checked for **null** specifically.  
Also, if you depended on the default behaviour to be URL rewriting disabled (only non-apache webservers), you need to adjust your web server and set the **FLOW\_REWRITEURLS=0** environment variable.  
All information you need to know for the upgrade can be found in the [release notes' upgrade instructions](https://flowframework.readthedocs.io/en/7.1/TheDefinitiveGuide/PartV/ReleaseNotes/710.html#upgrade-instructions) section.

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