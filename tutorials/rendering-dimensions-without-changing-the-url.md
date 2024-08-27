url: /tutorials/rendering-dimensions-without-changing-the-url
# Creating dynamic personalized content with Neos

Serve your customer's needs directly. Improve your conversion rates.

> **🚨 Attention**
> 
> Using this method causes you not being able to switch Dimensions in Backend! This is related to following [issue](https://github.com/neos/neos-ui/issues/2542). Backend Segment Selection requires respective uriSegment. 

It is possible to create different versions of a certain page in Neos using dimensions. This is particularly useful for different languages. It is also possible to use dimensions for showing different content to different visitors.

First, we need to create dimensions. This can be achieved by writing some code in `Settings.yaml` of the site package.

```yaml
Neos:
  ContentRepository:
    contentDimensions:
      mySegment:
        label: 'My Segment'
        icon: 'icon-globe'
        default: defaultUser
        defaultPreset: defaultUser
        presets:
          all: null
          defaultUser:
            label: 'Default User'
            values:
              - defaultUser
            uriSegment: ''
          specialUser:
            label: Special User Segment
            values:
              - specialUser
            uriSegment: ''
```

Please pay attention, that we just said, `uriSegment: ''`  for both presets. That way, different dimensions don't create their own URL. This is especially important, as you don't want your visitors to know that content shown is personalized. Now you have created dimensions, you can go to your Neos backend and change any page content for particular dimension. 

For Frontend purposes, Neos uses the URI to distinguish between different Dimensions. You can however manipulate the Node before rendering. For that, you will need a HTTP Component. You can define HTTP Components by writing them up in `Settings.yaml`.

```yaml
Neos:
  Flow:
    http:
      chain:
        'process':
          chain:
            'chooseCorrectDimension':
              position: 'after routing'
              component: Your\Package\Components\ShowCorrectDimensionComponent
```

## Showing another dimension without changing URL

Now create under `Your.Package/Classes/Components` the PHP Class `ShowCorrectDimensionComponent` . I can only recommend you to read the documentation of HTTP Components. But basicaly, you are going to need a component like this one.

```php
class ShowCorrectDimensionComponent implements ComponentInterface
{
    public function handle(ComponentContext $componentContext): void
    {
		...
	}
}
```

Your component must implement ComponentInterface. This interface requires the implementation for the function `handle`. This will be called, whenever the component is called, in our case: `after routing` — check the yaml configuration before.

In this function, you can implement your business process model and decide, which dimension should be shown. This can be achieved by manipulating the `node` property of `routingComponent`. To achieve this, you will need these three lines of code.

```php
$value = $componentContext->getParameter('Neos\Flow\Mvc\Routing\RoutingComponent', 'matchResults');
$value['node'] = '/sites/website@live;language=de&mySegment=specialUser';
$componentContext->setParameter('Neos\Flow\Mvc\Routing\RoutingComponent', 'matchResults', $value);
```

`$value` is an array. You have to manipulate `$value['node']`. You can change it by using Regex or splitting the string to array using explode & implodes. `$value['node']` will look like this:

```
/sites/website@live;language=de&mySegment=defaultUser
```

You have to change it to something like this: 

```
/sites/website@live;language=de&mySegment=specialUser
```

Just change the string `mySegment=defaultUser` to `mySegment=specialUser` the way it fits your requirements and code style.