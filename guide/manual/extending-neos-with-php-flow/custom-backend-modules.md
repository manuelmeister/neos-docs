url: /guide/manual/extending-neos-with-php-flow/custom-backend-modules
# Custom Backend Modules

Add custom functionality to the Administration area

If you want to integrate custom backend functionality, you can add your own submodule to the administration. 

You can either add it in the main menu to the existing section Administration or Management or define a new top level section by adding an overview module like the the existing ones or a normal module.

Some possible use cases would be the integrating of external web services, triggering of import or export actions or creating of editing interfaces for domain models from other packages.

> **⚠️ Warning**
> 
> This is not a Public API yet due to it’s unpolished state and is subject to change in the future.

> **ℹ️ Setup a custom Neos Flow package for a backend module**
> 
> If you need more information on how to setup a fully Neos Flow package, you can check out this tutorial here: [Creating Neos Flow app with Fusion, AFX and DDEV tooling.](/tutorials/creating-neos-flow-application-with-fusion-afx-and-ddev)

## Action­Contro­ller

Implementing a Backend Module starts by creating an action controller class derived from _\\Neos\\Flow\\Mvc\\Controller\\ActionController._

Classes/Controller/BackendController:
```php
namespace Vendor\Site\Controller;

use Neos\Flow\Annotations as Flow;

class BackendController extends \Neos\Flow\Mvc\Controller\ActionController {
    public function indexAction() {
        $this->view->assign('exampleValue', 'Hello World');
    }
}
```

To make sure that the class is found, you need to define the composer autoloading in the packages _composer.json_. We recommend to use [PSR-4](https://getcomposer.org/doc/04-schema.md#psr-4), like this:

composer.json:
```javascript
{
    "name": "vendor/site",
    "type": "neos-site",
    "require": {
        ...
    }
    "autoload": {
        "psr-4": {
            "Vendor\\Site\\": "Classes"
        }
    },
    ...
}
```

## Fluid Temp­late

> **💡 Backround**
> 
> Currently you can only use Fluid for rendering, in Neos 5 we will add support for AFX rendering.

The user interface of the module is defined in a Fluid template.

Resources/Private/Templates/Backend/Index.html:
```markup
{namespace neos=Neos\Neos\ViewHelpers}
<div class="neos-content neos-container-fluid">
    <h1>My Backend Area</h1>
    <p>{exampleValue}</p>
</div>
```

> **ℹ️ Note**
> 
> Neos comes with some ViewHelpers for easing backend tasks. Have a look at the _neos:backend_ ViewHelpers from the [Neos ViewHelper Reference](https://neos.readthedocs.io/en/stable/References/ViewHelpers/Neos.html#neos-viewhelper-reference)

## Configu­ra­tion

To show up in the management or administration section the module needs to be defined in the package settings.

Configuration/Settings.yaml:
```yaml
Neos:
  Neos:
    modules:
      'management':
        submodules:
          'exampleModule':
            label: 'Example Module'
            controller: 'Vendor\Site\Controller\BackendController'
            description: 'An Example for implementing Backend Modules'
            icon: 'icon-star'
```

## Access Rights

To use the module the editors have to be granted access to the controller actions of the module.

Configuration/Policy.yaml:
```yaml
privilegeTargets:
  'Neos\Neos\Security\Authorization\Privilege\ModulePrivilege':
    'Vendor.Site:BackendModule':
      matcher: 'management/exampleModule'

roles:
  'Neos.Neos:Editor':
    privileges:
      -
        privilegeTarget: 'Vendor.Site:BackendModule'
        permission: GRANT
```

> **💡 Tip**
> 
> Neos contains several backend modules built with this API. You can take a look around for inspiration. For example the [Neos Media Browser](https://github.com/neos/neos-development-collection/tree/master/Neos.Media.Browser).