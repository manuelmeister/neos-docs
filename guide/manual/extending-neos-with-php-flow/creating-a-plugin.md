url: /guide/manual/extending-neos-with-php-flow/creating-a-plugin
# Creating a plugin

> **ℹ️ Do you really need a plugin?**
> 
> In most cases not.  
>   
> For most cases modeling your data as NodeTypes works better defining a custom model in PHP. NodeTypes can also be created programatically.  
>   
> If you want to get data from an external API for rendering content, we recommend you to implement a [custom Eel Helper.](/guide/manual/extending-neos-with-php-flow/custom-eel-helpers)  
>   
> If you want to implement your own logic to find nodes, please implement a [custom FlowQuery Operation](/guide/manual/extending-neos-with-php-flow/custom-flowquery-operations).  
>   
> Creating a plugin is a good fit if you want to implement a custom model in PHP and want to interact with that model.

Any Flow package can be used as a plugin with a little effort. This section will guide you through a simple example. First, we will create a really basic Flow package. Second, we’ll expose this Flow package as a Neos plugin.

## Creating a Flow package

First we will create a very simple Flow package to use for integrating it as a plugin.

> **💡 Note**
> 
> When developing sites the need for simple plugins will often arise. And those small plugins will be very site-specific most of the time. In these cases it makes sense to create the needed code inside the site package, instead of in a separate package. For the sake of simplicity we will create a separate package now.

If you do not have the Kickstart package installed, you must do this now:

```bash
composer require neos/kickstarter \*
```

Now create a package with a model, so we have something to show in the plugin:

```bash
./flow kickstart:package Sarkosh.CdCollection
./flow kickstart:model Sarkosh.CdCollection Album title:string year:integer description:string rating:integer
./flow kickstart:repository Sarkosh.CdCollection Album
```

Then generate a migration to create the needed DB schema:

```bash
./flow doctrine:migrationgenerate
```

The command will ask in which directory the migration should be stored. Select the package Sarkosh.CdCollection. Afterwards the migration can be applied:

```bash
./flow doctrine:migrate
```

You should now have a package with a default controller and templates created.

### Configure Access Rights

To be able to call the actions of the controller you have to configure a matching set of rights. Create a _Policy.yaml_ file in _Packages/Application/Sarkosh.CdCollection/Configuration/Policy.yaml_ containing:

```yaml
privilegeTargets:
  Neos\Flow\Security\Authorization\Privilege\Method\MethodPrivilege:
    'Sarkosh.CdCollection:StandardControllerActions':
      matcher: 'method(Sarkosh\CdCollection\Controller\StandardController->(index)Action())'

roles:
  'Neos.Flow:Everybody':
    privileges:
      -
        privilegeTarget: 'Sarkosh.CdCollection:StandardControllerActions'
        permission: GRANT

```

> **ℹ️ Note**
> 
> If you add new actions later on you will have to extend the matcher rule to look like (index|other|third).

### Configure Routes

To actually call the plugin via HTTP request you have to include the Flow default-routes into the _Configuration/Routes.yaml_ of your whole setup (before the Neos routes):

Configuration/Routes.yaml:
```yaml
##
# Flow subroutes
-
  name: 'Flow'
  uriPattern: 'flow/<FlowSubroutes>'
  defaults:
    '@format': 'html'
  subRoutes:
    FlowSubroutes:
      package: Neos.Flow
```

The frontend of your plugin can now be called via http://neos.demo/flow/sarkosh.cdcollection. We specifically use the flow prefix here to ensure that the routes of Flow do not interfere with Neos.

> **ℹ️ Note**
> 
> The routing configuration will become obsolete as soon as you use the package as as Neos-Plugin as described in the following steps.

### Add data

Now you can add some entries for your CD collection in the database:

SQL:
```sql
INSERT INTO sarkosh_cdcollection_domain_model_album (
  persistence_object_identifier, title, year, description, rating
) VALUES (
  uuid(), 'Jesus Christ Superstar', '1970',
  'Jesus Christ Superstar is a rock opera by Andrew Lloyd Webber, with lyrics by Tim Rice.',
  '5'
);

```

(or using your database tool of choice) and adjust the templates so a list of CDs is shown. When you are done with that, you can make a plugin out of that.

As an optional step you can move the generated package from its default location _Packages/Application/_ to _Packages/Plugins_. This is purely a convention and at times it might be hard to tell an “application package” from a “plugin”, but it helps to keep things organized. Technically it has no relevance.

```bash
mkdir Packages/Plugins
mv Packages/Application/Sarkosh.CdCollection Packages/Plugins/Sarkosh.CdCollection
```

If you do this, it is important to rescan the available packages:

```bash
./flow flow:package:rescan
```

After this, you can use the Plugin with the same url http://neos.demo/flow/sarkosh.cdcollection

## Converting a Flow Package Into a Neos Plugin

To activate a Flow package as a Neos plugin, you only need to provide two configuration blocks.

##### Add a NodeType

First, you need to add a new _node type_ for the plugin, such that the user can choose the plugin from the list of content elements:

Add the following file _Configuration/NodeTypes.Plugin.yaml_ to your package:

Configuration/NodeTypes.Plugin.yaml:
```yaml
'Sarkosh.CdCollection:Plugin':
  superTypes:
    'Neos.Neos:Plugin': TRUE
  ui:
    label: 'CD Collection'
    group: 'plugins'
```

This will add a new entry labeled “CD Collection” to the “Plugins” group in the content element selector (existing groups are _General_, _Structure_ and _Plugins_).

##### Configure Fusion

Second, the rendering of the plugin needs to be specified using Fusion, so the following Fusion needs to be added to your package.

Resources/Private/Fusion/Plugin.fusion:
```neosfusion
prototype(Sarkosh.CdCollection:Plugin) < prototype(Neos.Neos:Plugin)
prototype(Sarkosh.CdCollection:Plugin) {
      package = 'Sarkosh.CdCollection'
      controller = 'Standard'
      action = 'index'
}
```

Finally tweak your site package’s _Root.fusion_ and include the newly created Fusion file:

```neosfusion
include: Plugin.fusion
```

Now log in to your Neos backend (you must remove the Flow routes again), and you will be able to add your plugin just like any other content element.

To automatically include the Root.fusion in Neos you have to add the following lines to the _Configuration/Settings.yaml_ of your Package:

Configuration/Settings.yaml:
```yaml
Neos:
  Neos:
    fusion:
      autoInclude:
        'Sarkosh.CdCollection': TRUE
```

##### Use Fusion to configure the Plugin

To hand over configuration to your plugin you can add arbitrary Fusion values to

Resources/Private/Fusion/Plugin.fusion:
```neosfusion
prototype(Sarkosh.CdCollection:Plugin) {
      ...
      myNodeName = ${q(node).property('name')}
}
```

In the controller of your plugin you can access the value from Fusion like this.

```php
$myNodeName = $this->request->getInternalArgument('__myNodeName');
```

## "Flow application" Neos plugin

### Creating a plugin

#### Linking to a Plugin

Inside of your Plugin you can use the usual f:link.action and f:uri.action ViewHelpers from fluid to link to other ControllerActions:

Fluid:
```markup
<f:link.action package="sarkosh.cdcollection" controller="standard" action="show" arguments="{collection: collection}" />
```

If you want to create links to your plugin from outside the plugin context you have to use one of the following methods.

To create a link to a ControllerAction of your Plugin in Fusion you can use the following code:

Fusion:
```neosfusion
link = Neos.Neos:NodeUri {
      # you have to identify the document that contains your plugin somehow
      node = ${q(site).find('[instanceof Sarkosh.CdCollection:Plugin]').first().closest('[instanceof Neos.Neos:Document]').get(0)}
      absolute = true
      additionalParams = ${{'--sarkosh_cdcollection-plugin': {'@package': 'sarkosh.cdcollection', '@controller':'standard', '@action': 'show', 'collection': collection}}}
}
```

The same code in a fluid template looks like this:

Fluid:
```markup
{namespace neos=Neos\Neos\ViewHelpers}
<neos:uri.node node="{targetNode}" arguments="{'--sarkosh_cdcollection-plugin': {'@package': 'sarkosh.cdcollection', '@controller':'standard', '@action': 'show', 'collection': collection}}" />
```

#### Configuring a plugin to show specific actions on different pages

With the simple plugin you created above, all of the actions of that plugin are executed on one specific page node. But sometimes you might want to break that up onto different pages. For this use case there is a node type called Plugin View. A plugin view is basically a view of a specific set of actions configured in your NodeTypes.yaml.

The steps to have one plugin which is rendered at multiple pages of your website is as follows:

1.  Create your plugin as usual; e.g. like in the above example.
2.  Insert your plugin at a specific page, just as you would do normally. This is later called the _Master View_ of your plugin.
3.  You need to define the parts of your plugin you lateron want to have separated in a different page. This is done in the options.pluginViews setting inside NodeTypes.yaml (see below).
4.  Then, in Neos, insert a _Plugin View_ instance on the other page where you want a part of the plugin to be rendered. In the inspector, you can then select the Plugin instance inside the _Master View_ option, and afterwards choose the specific Plugin View you want to use.

You can update your _Configuration/NodeTypes..pluginyaml_ like this to configure which actions will be available for the Plugin View:

Configuration/NodeTypes.Plugin.yaml:
```yaml
'Sarkosh.CdCollection:Plugin':
  superTypes:
    'Neos.Neos:Plugin': TRUE
  ui:
    label: 'CD Collection'
    group: 'plugins'
  options:
    pluginViews:
      'CollectionShow':
        label: 'Show Collection'
        controllerActions:
          'Sarkosh\CdCollection\Controller\CollectionController': ['show']
      'CollectionOverview':
        label: 'Collection Overview'
        controllerActions:
          'Sarkosh\CdCollection\Controller\CollectionController': ['overview']
```

When you insert a plugin view for a node the links in both of the nodes get rewritten automatically to link to the view or plugin, depending on the action the link points to. Insert a “Plugin View” node in your page, and then, in the inspector, configure the “Master View” (the master plugin instance) and the “Plugin View”.

##### Fixing Plugin Output

If you reuse an existing flow-package a plugin in Neos and check the HTML of a page that includes your plugin, you will clearly see that things are not as they should be. The plugin is included using its complete HTML, including head and body tags. This of course results in an invalid document.

To improve that you can add a _Configration/Views.yaml_ file to your Package that can be used to alter the used template and views based on certain conditions. The documentation for that can be found in the Flow Framework Documentation.

##### Optimizing the URLs

By default Neos will create pretty verbose urls for your plugin. To avoid that you have to configure a proper routing for your Package.

##### Plugin Request and Response

The plugin controller action is called as a child request within the parent request. Alike that, the response is also a child response of the parent and will be handed up to the parent.

> **⚠️ Warning**
> 
> The documentation is not covering all aspects yet. Please have a Look at the [Cookbooks](https://neos.readthedocs.io/en/stable/HowTos/index.html#how-to) as well.