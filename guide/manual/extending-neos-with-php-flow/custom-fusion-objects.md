url: /guide/manual/extending-neos-with-php-flow/custom-fusion-objects
# Custom Fusion Objects

By adding custom Fusion Objects it is possible to extend the capabilities of Fusion in a powerful and configurable way. If you need to write a way to execute PHP code during rendering, for simple methods, Eel helpers should be used. For more complex functionality where custom classes with more configuration options are needed, Fusion objects should rather be created.

As an example, you might want to create your own Fusion objects if you are enriching the data that gets passed to the template with external information from an API or if you have to convert some entities from identifier to domain objects.

In the example below, a Gravatar image tag is generated.

## Create a Fusion object class

To create a custom Fusion object the `Neos\Fusion\FusionObjects\AbstractFusionObject` class is extended. The only method that needs to be implemented is `evaluate()`. To access values from Fusion the method `$this->fusionValue('__fusion_value_key__');` is used:

```php
namespace Vendor\Site\Fusion;

use Neos\Flow\Annotations as Flow;
use Neos\Fusion\FusionObjects\AbstractFusionObject;

class GravatarImplementation extends AbstractFusionObject {

	/**
	* @return string
	*/
	public function evaluate() {
		$emailAddress = $this->fusionValue('emailAddress');
		$size = $this->fusionValue('size') ?: 80;
		$gravatarImageSource = 'http://www.gravatar.com/avatar/' . md5(strtolower(trim($emailAddress))) . '?s=' . $size . '&d=mm&r=g';
		return '<img src="' . $gravatarImageSource . '" alt="" />';
	}
}
```

To use this implementation in Fusion, you have to define a Fusion-prototype first:

```neosfusion
prototype(Vendor.Site:Gravatar) {
	@class = 'Vendor\\Site\\Fusion\\GravatarImplementation'
	emailAddress = ''
	size = 80
}
```

## Use the Fusion object

The prototype can be used in Fusion like this:

```neosfusion
gravatarImage = Vendor.Site:Gravatar {
	emailAddress = 'hello@neos.io'
	size = 120
}
```