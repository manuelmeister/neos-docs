url: /guide/manual/extending-neos-with-php-flow/custom-eel-helpers
# Custom Eel Helpers

Eel Helpers provide methods that can be used inside of [Eel expressions](/api/eel/syntax). That is mostly used to extend the capabilities for data-aquisition and processing of Fusion.

#### Define the class

The first step is to create the EelHelper class. Every Helper has to implement the interface _Neos\\Eel\\ProtectedContextAwareInterface_.

Classes/Eel/Helper/ExampleHelper.php:
```php
<?php
declare(strict_types=1);

namespace Vendor\Site\Eel\Helper;

use Neos\Flow\Annotations as Flow;
use Neos\Eel\ProtectedContextAwareInterface;

class ExampleHelper implements ProtectedContextAwareInterface {

    /**
     * Wrap the incoming string in curly brackets
     *
     * @param $text string
     * @return string
     */
    public function wrapInCurlyBrackets(string $text) {
        return '{' . $text . '}';
    }

    /**
     * All methods are considered safe, i.e. can be executed from within Eel
     *
     * @param string $methodName
     * @return boolean
     */
    public function allowsCallOfMethod(string $methodName) {
        return true;
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

#### Register the helper

Afterwards the name of the Helper has to be registered for usage in Fusion in the _Settings.yaml_ of the package:

Configuration/Settings.yaml:
```yaml
Neos:
  Fusion:
    defaultContext:
      'Vendor.Site.Example': 'Vendor\Site\Eel\Helper\ExampleHelper'
```

#### Usage

In Fusion you can call the methods of the helper inside of EelExpressions:

```neosfusion
exampleEelValue = ${Vendor.Site.Example.wrapInCurlyBrackets('Hello World')}
```

## Learn more about Eel

*   [**Neos & Fusion Eel Helpers**  
    References on Read the Docs](https://neos.readthedocs.io/en/8.3/References/EelHelpersReference.html)
*   [**Eel Syntax**  
    API Reference](/api/eel/syntax)