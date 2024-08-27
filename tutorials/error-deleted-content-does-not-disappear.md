url: /tutorials/error-deleted-content-does-not-disappear
# FAQ: Deleted Content only disappears after full page reload

Neos.Fusion:Component vs Neos.Neos:ContentComponent

## Problem

**Problem:** You delete some content, e.g. via the content tree.

**Expectation:** You expect your content to be removed to from the page automatically.

**Actual Behavior:** Content is not removed, but page does not change at all. When reloading the page completely, the content is gone.

### Possible Solution

Instead of inheriting from `Neos.Fusion:Component` , you need to inherit from `Neos.Neos:ContentComponent` for your custom component which renders your Node, to have the Content Element Wrapping enabled. Content Element Wrapping needs to be activated for all Nodes which are editable in the Neos backend..

##### Background

See the documentation page about [Component Fusion Objects](/guide/manual/rendering/component-fusion-objects) for further information.

[Manual: Component Fusion Objects](/guide/manual/rendering/component-fusion-objects)