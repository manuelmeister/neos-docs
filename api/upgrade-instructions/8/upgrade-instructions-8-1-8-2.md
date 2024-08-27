url: /api/upgrade-instructions/8/upgrade-instructions-8-1-8-2
# Upgrade Instructions 8.1 → 8.2

By using composer, you can update an existing installation to a specific version, without having to create a new project.

For further information on what changed, please take a look at the changelogs ([Neos](https://neos.readthedocs.io/en/8.2/Appendixes/ChangeLogs/820.html), [Flow](https://flowframework.readthedocs.io/en/8.2/TheDefinitiveGuide/PartV/ChangeLogs/820.html))

## Update Instructions

Before making substantial changes, **make sure you create a backup of the database and files**!

```bash
cd /installation-root/
# Update the core package dependencies
composer require --no-update "neos/neos:~8.2.0"
composer require --no-update "neos/neos-ui:~8.2.0"

# Update optional package dependencies (if installed)
composer require --no-update "neos/demo:~8.2.0"
```

If you have development packages in your composer manifest, update them to match as well:

```bash
# Update development packages (if installed)
composer require --no-update --dev "neos/buildessentials:~8.2.0"
```

After completing these steps, your package should be upgraded to the latest version of the Neos UI and ready to use. Thank you for using the Neos project!

## Rebuilding Neos Ui (CKEditor) Plugins to make them compatible with Neos Ui Host's >= 8.2

With this minor release, we accidentally introduced an incompatibility when using previously built Neos Ui Plugins with the 8.2 main Ui application.

This originated due to an unforeseen incompatibility between ES5 and ES6: Transpiled ES5 classes can't extend ES6/native classes. See this [Neos Ui Issue](https://github.com/neos/neos-ui/issues/3287) for more technical information.

The incompatibility leads to errors in the console, and the CKEditor might stop working: `Class constructor ... cannot be invoked without 'new'`

You're likely affected if your plugin extends the CKEditor, as you probably extended the classes \`Plugin\` and \`Command\` from the Neos Ui Host.  
But this problem might also affect other kinds of plugins.  
  
The simplest way around this problem is to rebuild your Neos Ui Plugins with a new version of `@neos-project/neos-ui-extensibility`, which doesn't transpile classes any more down to ES5.  
  
To update and rebuild, please follow these steps:

1.  Open your package's `package.json` file of your Neos Ui plugin.
2.  Update the version number for the dependency `@neos-project/neos-ui-extensibility` to  `~8.2.7`.
3.  Run `npm install` or `yarn` to install the updated dependencies.
4.  Rebuild the plugin as usual with `NODE_ENV=production neos-react-scripts build`

The rebuild plugins are still downward compatible with older Neos Ui Host.

## Breaking changes

With this minor release, no breaking changes were introduced.

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