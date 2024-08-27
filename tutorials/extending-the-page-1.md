url: /tutorials/extending-the-page-1
# Extending the Page

In Neos each page is a simple NodeType. So you can create your own document NodeTypes based on _Neos.Neos:Document_.

To create a page type which allows a background, let's create a new NodeType:

DistributionPackages/Vendor.Site/Configuration/NodeTypes.Document.PageWithBackground.yaml:
```yaml
'Vendor.Site:Document.PageWithBackground':
  superType:
    - 'Neos.Neos:Document'
  ui:
    inspector:
      groups:
        background:
          label: 'Background'
          position: 900
  properties:
    backgroundImage:
      type: Neos\Media\Domain\Model\ImageInterface
      ui:
        label: 'Image'
        reloadPageIfChanged: TRUE
        inspector:
          group: 'background'
```

With this configuration, when you create a new page, you will see the Image editor in the Inspector.

To access the backgroundImage in your page template you can also modify the rendering.

> **ℹ️ Fluid rendering only**
> 
> Below you can see how this would be rendered in Fluid. In AFX you would be able to use it as a prop, for more read the [AFX documentation](/guide/manual/rendering/afx).

DistributionPackages/Vendor.Site/Resources/Private/Fusion/Document/PageWithBackground/PageWithBackground.fusion:
```neosfusion
prototype(Vendor.Site:Document.PageWithBackground) < prototype(Neos.Neos:Page) {
    body.backgroundImage = ${q(node).property('backgroundImage')}
}
```

With Neos.Media ViewHelper you can display the Image with the follwing HTML snippet:

Fluid:
```markup
{namespace media=Neos\Media\ViewHelpers}
<style>
html {
        margin:0;
        padding:0;
        background: url({media:uri.image(image:backgroundImage)}) no-repeat center fixed;
        -webkit-background-size: cover;
        -moz-background-size: cover;
        -o-background-size: cover;
        background-size: cover;
}
</style>
```