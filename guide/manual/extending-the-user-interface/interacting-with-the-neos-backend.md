url: /guide/manual/extending-the-user-interface/interacting-with-the-neos-backend
# Legacy JavaScript events

for interacting with the Neos Backend

> **⚠️ Legacy support**
> 
> This documentation aims at the legacy Ember administration area.   
> The events documented here exist mostly for backwards-compatibility reasons, as the current React UI provides a much more powerful extensibility layer. See [Neos User Interface Extensibility API](/guide/manual/extending-the-user-interface/react-extensibility-api) for the detailed information on the topic. 

## JavaScript events

Some sites will rely on JavaScript initialization when the page is rendered, typically on DocumentReady. The Neos backend will however often reload the page via Ajax whenever a node property is changed, and this might break functionality on sites relying on custom JavaScript being executed on DocumentReady.

To fix this, the Neos backend will dispatch an event when the node is added or removed from the page via ajax, and site specific JavaScript can listen on this event to trigger whatever code is needed to render the content correctly.

```javascript
document.addEventListener('Neos.NodeCreated', function(event) {
      // Do stuff
}, false);
```

The event object given, will always have the message and time set on event.detail. Some events might have more attributes set.

The Neos backend will dispatch events that can be listened on when the following events occur:

*   `**Neos.NodeCreated**` When a new node was added to the document. The event has a reference to the DOM element in `event.detail.element`. Additional information can be fetched through the element’s attributes.
*   `**Neos.NodeRemoved**` When a new node was removed from the document. The event has a reference to the DOM element in `event.detail.element`. Additional information can be fetched through the element’s attributes.
*   `**Neos.NodeSelected**` When a node existing on the page is selected. The event has a reference to the DOM element in event.detail.element and the node model object in `event.detail.node`. Additional information can be fetched through the node model.

Example of interacting with the selected node element using the `NodeSelected` event.

```javascript
document.addEventListener('Neos.NodeSelected', function (event) {
  const node = event.detail.node;
  if (node.get('nodeType') === 'Acme:Demo') {
      console.log(node.get('properties.title'));
  }
}, false);

```

Example of listening for the `LayoutChanged` event.