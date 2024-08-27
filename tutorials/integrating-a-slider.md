url: /tutorials/integrating-a-slider
# Integrating a JavaScript-based slider

> **⚠️ Partly Outdated**
> 
> This documentation is still correct, but we would write Fusion now differently and use AFX rendering. Please read our manual to understand how you would build modern NodeTypes.   
>   
> Especially instead of reusing the `Neos.NodeTypes:Image` NodeType, we would strongly recommend to create your own `Vendor.Site:Content.Carousel.Item`

If you want to integrate a Slider into your page as content element or as part of your template and want edit it in the backend you have do some simple steps.

First you have to use a slider javscript plugin which initializes itself when added to the page after page load. Or you write your own initialization code into a javascript function which you then add as callback for the neos backend events.

For this example the carousel plugin and styling from bootstrap 3.0 has been used:[http://getbootstrap.com/javascript/#carousel](http://getbootstrap.com/javascript/#carousel)

To create the basic content element you have to add it to your node types.

DistributionPackages/Vendor.Site/Configuration/NodeTypes.Content.Carousel.yaml:
```yaml
'Vendor.Site:Carousel':
  superTypes:
    'Neos.Neos:Content': true
  childNodes:
    carouselItems:
      type: 'Neos.Neos:ContentCollection'
  ui:
    label: 'Carousel'
    group: 'plugins'
    icon: 'icon-picture'
    inlineEditable: true
```

Next you need to define the prototype for the slider in Fusion.

> **ℹ️ Fluid rendering only**
> 
> Below you can see how this would be rendered in Fluid. In AFX you would be able to use it as a prop, for more read the [AFX documentation](/guide/manual/rendering/afx).

DistributionPackages/Vendor.Site/Resources/Private/Fusion/Content/Carousel/Carousel.fusion:
```neosfusion
prototype(Vendor.Site:Content.Carousel) {
        carouselItems = Neos.Neos:ContentCollection {
                nodePath = 'carouselItems'
                content.iterationName = 'carouselItemsIteration'
                attributes.class = 'carousel-inner'
        }

        // Collect the carousels children but only images
        carouselItemArray = ${q(node).children('carouselItems').children('[instanceof Neos.NodeTypes:Image]')}

        // Enhance image prototype when inside the carousel
        prototype(Neos.NodeTypes:Image) {
                // Render images in the carousel with a special template.
                templatePath = 'resource://Vendor.Site/Private/Templates/FusionObjects/CarouselItem.html'

                // The first item should later be marked as active
                attributes.class = ${'item' + (carouselItemsIteration.isFirst ? ' active' : '')}

                // We want to use the item iterator in fluid so we have to store it as variable.
                iteration = ${carouselItemsIteration}
        }
}
```

For rendering in the old Fluid template language, you need the fluid templates for the slider.

DistributionPackages/Vendor.Site/Resources/Private/Templates /FusionObjects/Carousel.html:
```markup
{namespace neos=Neos\Neos\ViewHelpers}
{namespace fusion=Neos\Fusion\ViewHelpers}
<div{attributes -> f:format.raw()}>
        <div class="carousel slide" id="{node.identifier}">
                <!-- Indicators -->
                <ol class="carousel-indicators">
                        <f:for each="{carouselItemArray}" as="item" iteration="itemIterator">
                                <li data-target="#{node.identifier}" data-slide-to="{itemIterator.index}" class="{f:if(condition: itemIterator.isFirst, then: 'active')}"></li>
                        </f:for>
                </ol>

                <!-- Wrapper for slides -->
                {carouselItems -> f:format.raw()}

                <!-- Controls -->
                <a class="left carousel-control" href="#{node.identifier}" data-slide="prev">
                        <span class="icon-prev"></span>
                </a>
                <a class="right carousel-control" href="#{node.identifier}" data-slide="next">
                        <span class="icon-next"></span>
                </a>
        </div>
</div>
```

And now the fluid template for the slider items.

DistributionPackages/Vendor.Site/Resources/Private/Templates /FusionObjects/CarouselItem.html:
```markup
{namespace neos=Neos\Neos\ViewHelpers}
{namespace media=Neos\Media\ViewHelpers}
<div{attributes -> f:format.raw()}>
        <f:if condition="{image}">
                <f:then>
                        <media:image image="{image}" alt="{alternativeText}" title="{title}" maximumWidth="{maximumWidth}" maximumHeight="{maximumHeight}" />
                </f:then>
                <f:else>
                        <img src="{f:uri.resource(package: 'Neos.Neos', path: 'Images/dummy-image.svg')}" title="Dummy image" alt="Dummy image" />
                </f:else>
        </f:if>
        <div class="carousel-caption">
                <f:if condition="{hasCaption}">
                        {neos:contentElement.editable(property: 'caption')}
                </f:if>
        </div>
</div>
```

For styling you can simply include the styles provided in bootstrap into your page template.

```markup
<link rel="stylesheet" href="{f:uri.resource(path: '3/css/bootstrap.min.css', package: 'Neos.Twitter.Bootstrap')}" media="all" />
```

If you want to hide specific parts of a plugin while in backend you can use the provided neos-backend class.

```css
.neos-backend .carousel-control {
        display: none;
}
```

Don’t forget to include the javascript for the plugin from the bootstrap package into your page template.

```markup
<script src="{f:uri.resource(path: '3/js/bootstrap.min.js', package: 'Neos.Twitter.Bootstrap')}"></script>

```

Now, you should be able to add the new ‘Carousel’ node type as content element.