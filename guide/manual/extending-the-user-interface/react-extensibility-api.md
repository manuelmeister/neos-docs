url: /guide/manual/extending-the-user-interface/react-extensibility-api
# Neos User Interface Exten­sibility API

For the React UI

> **ℹ️ Draft**
> 
> This page is not yet fully completed - we are still working on the content here. Expect some rough edges 🙃

At the heart of the Neos UI lies the system of registries – key-value stores that contain system components. The registries are populated through the _manifest_ API command that is exposed through the neos-ui-extensibility package.

## Getting started ...

You don't need to recompile the Neos UI to integrate your own Plugins. Many Core functionalities are accessible through the [@neos-project/neos-ui-extensibility](https://github.com/neos/neos-ui/blob/8.3/packages/neos-ui-extensibility) API. 

### Accessing `react` and co from the Neos UI Host:

A Neos UI plugin must get access to certain important objects and methods like react, CKEditor, and also the bootstrap function.

To access the same instance f.e. of React that the Neos UI Host is using, we technically want to do something like: `const {React} = window.NeosUiPluginApi`. The problem being: when we use 3rd party NPM packages in our plugin, they will import react as usual `import React from "react"` which will fail.

To solve this issue and also make creating plugins a bit more fancy ✨ we make use of your bundlers import alias feature.

All aliases are listed here: [@neos-project/neos-ui-extensibility/extensibilityMap.json](https://github.com/neos/neos-ui/blob/8.3/packages/neos-ui-extensibility/extensibilityMap.json). You only need to import the modules, and they will work as if you installed those packages. So `import React from "react"` will import react at runtime from the Neos UI host and you don't need to install it. (Also the same instance is used, which is important)

### Setting up your Plugin:

There are two different ways to create your plugin build stack:

1\. Visit the instructions at [@neos-project/neos-ui-extensibility](https://github.com/neos/neos-ui/blob/8.3/packages/neos-ui-extensibility) for a flexible build stack with the bundler of your choice (like esbuild)

2\. Visit the instructions at [@neos-project/neos-ui-extensibility-webpack-adapter](https://github.com/neos/neos-ui/tree/8.3/packages/neos-ui-extensibility-webpack-adapter) for a highly opinionated Webpack 4 + Babel build stack

(You can also find more Examples here: [neos/neos-ui-extensibility-examples: Neos UI Extensibility Examples (github.com)](https://github.com/neos/neos-ui-extensibility-examples))  
  
Once you have the bundler setup and the JavaScript registered, you can read up on the concepts of the registries below.

## Inspector-specific Registries

### Editors

Way to retrieve:

```javascript
globalRegistry.get('inspector').get('editors')
```

Contains all inspector editors. The key is an editor name (such as Neos.Neos/Inspector/Editors/SelectBoxEditor), and the values are objects of the following form:

```javascript
{
  component: TextInput // the React editor component to use. Required
  hasOwnLabel: true|false // whether the component renders the label internally or not
}
```

#### Component Wiring

Every component gets the following properties (see EditorEnvelope/index.js)

*   _identifier_: an identifier which can be used for HTML ID generation
*   _label_: the label
*   _value_: the value to display
*   _propertyName_: name of the node property to edit
*   _options_: additional editor options
*   _commit_: a callback function when the content changes.
    *   1st argument: the new value
    *   2nd argument (optional): an object whose keys are _saveHooks_ to be triggered, the values are hook-specific options. Example: `{'Neos.UI:Hook.BeforeSave.CreateImageVariant': nextImage}`
*   _renderSecondaryInspector_:
    *   1st argument: a string identifier of the second inspector; used to implement toggling of the inspector when calling this method twice.
    *   2nd argument: a callback function which can be used to render the secondary inspector. The callback function should return the secondary inspector content itself; or “undefined/null” to close the secondary inspector. Example usage: `props.renderSecondaryInspector('IMAGE_CROPPING', () => <MySecondaryInspectorContent />)`

### Secondary Editors

Way to retrieve:

```javascript
globalRegistry.get('inspector').get('editors')
```

Contains all secondary inspector editors, which can be used to provide additional, more complex functionality that needs more space in the UI than the inspector panel can provide itself.

Use it like the registry for editors.

### Views

Way to retrieve:

```javascript
globalRegistry.get('inspector').get('views')
```

Contains all inspector views.

Use it like the registry for editors.

### Save Hooks

Way to retrieve:

```javascript
globalRegistry.get('inspector').get('saveHooks')
```

Sometimes, it is needed to run code when the user presses “Apply” inside the Inspector.

Example: When the user cropped a new image, on “Apply”, a new imageVariant must be created on the server, and then the identity of the new imageVariant must be stored inside the value of the image.

The process is as follows:

*   When an editor wants its value to be post-processed, it calls props.commit(newValue, {hookName: hookOptions})
*   Then, when pressing “Apply” in the UI, the hookNames are resolved inside this saveHooks registry.

#### Hook Definitions

Every entry inside this registry is a function of the following signature:

```javascript
(valueSoFar, hookOptions) => {
  return new value; // can also return a new Promise.
}
```

## Validators

Way to retrieve:

```javascript
globalRegistry.get('validators')
```

Contains all server feedback handlers.

The key is the server-feedback-handler-type, and the value is a function with the following signature:

```javascript
(feedback, store) => {
  // do whatever you like here
}
```

## Frontend Configuration

Any settings under _Neos.Neos.Ui.frontendConfiguration_ would be available here.

Might also be used for third-party packages to deliver their own settings to the UI, but this is still experimental.

Settings from each package should be prefixed to avoid collisions (unprefixed settings are reserved for the core UI itself), e.g.:

```yaml
Neos:
  Neos:
    Ui:
      frontendConfiguration:
        'Your.Own:Package':
          someKey: someValue
```

Then it may be accessed as:

```javascript
globalRegistry.get('frontendConfiguration').get('Your.Own:Package').someKey
```

## Inline Editors

Way to retrieve:

```javascript
globalRegistry.get('inlineEditors')
```

Each key in this registry should be a unique identifier for an inline editor, that can be referenced in a node type configuration.

Each entry in this registry is supposed to consist of an object with the following structure:

```javascript
{
  bootstrap: myBootstrapFunction,
  createInlineEditor: myInlineEditorFactoryFunction
}
```

Bootstrap is called only once during the global initialization of the guest frame. It is not required to do anything in this function, but it is possible to prepare the guest frame environment, if any global variables must be defined or other initialization routines must be run in order for the inline editor to work.

Bootstrap will receive an API Object as its first parameter, with the following methods:

*   `setFormattingUnderCursor`: Will dispatch the respective action from the _@neos-project/neos-ui-redux-store_ package (actions.UI.ContentCanvas.setFormattingUnderCursor)
*   `setCurrentlyEditedPropertyName`: Will dispatch the respective action from the _@neos-project/neos-ui-redux-store_ package (_actions.UI.ContentCanvas.setCurrentlyEditedPropertyName_)

`createInlineEditor` is called on every DOM node in the guest frame that represents an editable property. It is supposed to handle the initialization and display of an inline editor.

createInlineEditor will receive an object as its first parameter, with the following properties:

*   _propertyDomNode_: The DOM node associated with the editable property
*   _propertyName_: The name of the editable property
*   _contextPath_: The contextPath of the associated node
*   _nodeType_: The nodeType of the associated node
*   _editorOptions_: The configuration for this inline editor
*   _globalRegistry_: The global registry
*   _persistChange_: Will dispatch the respective action from _@neos-project/neos-ui-redux-store_ package (_actions.Changes.persistChanges_)

## CKEditor5-specific registries

The integration of CKeditor5 is dead simple and tries to introduce a minimal amount of abstractions on top of CKeditor5. There are only two registries involved in configuring it: `config` and `richtextToolbar`

### Configuration of CKeditor5

Way to retrieve:

```javascript
globalRegistry.get('ckEditor5').get('config')
```

In CKE all things are configured via a single configuration object: plugins, custom configs, etc (see [https://docs.ckeditor.com/ckeditor5/latest/builds/guides/integration/configuration.html)](https://docs.ckeditor.com/ckeditor5/latest/builds/guides/integration/configuration.html)

This registry allows registering a custom configuration processor that takes a configuration object, modifies it and returns a new one. Example:

```javascript
config.set('doSomethingWithConfig' (ckeConfig, editorOptions) => {
  ckeConfig.mySetting = true;
  return ckeConfig;
})
```

That is all you need to know about configuring CKE in Neos, Refer to CKeditor5 documentation for more details on what you can do with it: [https://docs.ckeditor.com/ckeditor5/latest/index.html](https://docs.ckeditor.com/ckeditor5/latest/index.html)

#### Richtext Toolbar

Way to retrieve:

```javascript
globalRegistry.get('ckEditor5').get('richtextToolbar')
```

Contains the Rich Text Editing Toolbar components.

Buttons in the Rich Text Editing Toolbar are just plain React components.

The only way for these components to communicate with CKE is via its commands mechanism (see [https://docs.ckeditor.com/ckeditor5/latest/framework/guides/architecture/core-editor-architecture.html#commands](https://docs.ckeditor.com/ckeditor5/latest/framework/guides/architecture/core-editor-architecture.html#commands))

Some commands may take arguments. Commands also contain state that is serialized into _formattingUnderCursor_ redux state. Commands are provided and handled by CKE plugins, which may be registered via the configuration registry explained above.

The values are objects of the following form:

```javascript
{
    commandName: 'bold' // A CKE command that gets dispatched
    commandArgs: [arg1, arg2] // Additional arguments passed together with a command
    component: Button // the React component being used for rendering
    isVisible: (editorOptions, formattingUnderCursor) => true // A function that decides is the button should be visible or not
    isActive: (formattingUnderCursor, editorOptions) => true // A function that decides is the button should be active or not
    callbackPropName: 'onClick' // Name of the callback prop of the Component which is
                                fired when the component's value changes.

    // all other properties are directly passed on to the component.
}
```

## CKEditor4-specific registries

### Formatting rules

Way to retrieve:

```javascript
globalRegistry.get('ckEditor').get('formattingRules')

```

Contains the possible styles for CKEditor.

#### Enabled Styles

The actual _enabled_ styles are determined by the NodeTypes configuration of the property. 

This means, that if the node is configured in _NodeTypes.yaml_ using:

```yaml
properties:
  [propertyName]:
    ui:
      inline:
        editorOptions:
          formatting:
            strong: true
```

Then the “strong” key inside this registry is actually enabled for the editor.

For backwards compatibility reasons, the formatting-and-styling-registry _KEYS_ must match the “pre-React” UI if they existed beforehand.

#### Configuration of CKEditor

With this config, CKEditor itself is controlled:

*   the Advanced Content Filter (ACF) is configured, thus determining which markup is allowed in the editors
*   which effect a button action actually has.

Currently, there exist three possible effects:

*   triggering a command
*   setting a style
*   executing arbitrary code

#### Configuration Format

> **ℹ️ Note**
> 
> One of “command” or “style” must be specified in all cases.

*   _command_ (string, optional). If specified, this CKEditor command is triggered; so the command string is known by CKEditor in the “commands” section: [http://docs.ckeditor.com/#!/api/CKEDITOR.editor-method-getCommand](http://docs.ckeditor.com/#!/api/CKEDITOR.editor-method-getCommand)
*   _style_ (object, optional). If specified, this CKEditor style is applied. Expects a style description adhering to `CKEDITOR.style(…)`, so for example: `{ style: {element: ‘h1’} }`
*   _config_ (function, optional): This function needs to adjust the CKEditor config to e.g. configure ACF correctly. The function gets passed in the config so-far, AND the configuration from the node type underneath `ui.inline.editorOptions.formatting.[formatingRuleName]` and needs to return the modified config. See “CKEditor Configuration Helpers” below for helper functions.
*   _extractCurrentFormatFn_ (function, optional): If specified, this function will extract the current format. The function gets past the current “editor” and “CKEDITOR”.
*   _applyStyleFn_ (function, optional): This function applies a style to CKEditor. Arguments: formattingOptions, editor, CKEDITOR.

#### CKEditor Configuration Helpers

*   `config: registry.ckEditor.formattingRules.config.addToFormatTags(‘h1’)`: adds the passed-in tag to theformat\_tags configuration option of CKEditor.
*   `registry.ckEditor.formattingRules.config.add(‘Strong’)`: adds the passed-in _Button Definition Name_ to the ACF configuration (automatic mode). This means the button names are standard CKEditor config buttons, like _“Cut,Copy,Paste,Undo,Redo,Anchor”_.

### Richtext Toolbar

Contains the Rich Text Editing Toolbar components.

The values are objects of the following form:

```javascript
{
  formattingRule: 'h1' // References a key inside "formattingRules"
  component: Button // the React component being used for rendering
  callbackPropName: 'onClick' // Name of the callback prop of the Component which is fired when the component's value changes.

  // all other properties are directly passed on to the component.
}

```

#### Component wiring

*   Each toolbar component receives all properties except “formattingRule” and “component” directly as props.
*   Furthermore, the “isActive” property is bound, which is a boolean flag defining whether the text style referenced by “formatting” is currently active or not.
*   Furthermore, the callback specified in “callbackPropName” is wired, which toggles the value.

For advanced use-cases; also, the “formattingRule” is bound to the component; containing a formatting-rule identifier (string). If you need this, you’ll most likely need to listen to `selectors.UI.ContentCanvas.formattingUnderCursor` and extract your relevant information manually.

### Plugins

Way to retrieve:

```javascript
globalRegistry.get('ckEditor').get('plugins')
```

Contains custom plugins for CkEditor.

```javascript
plugins.set('plugin_key', {
    initFn: pluginInitFunction
});
```

`pluginInitFunction` is passed from CKEDITOR as the first argument. In that function you may register your plugin with CKEditor via its API (`CKEDITOR.plugins.add`). Take custom plugins as examples.

## Data Loaders

Way to retrieve:

```javascript
globalRegistry.get('dataLoaders')
```

A “Data Loader” controls asynchronous loading of secondary data, which is used in all kinds of Select / List boxes in the backend.

Example of data which is loaded through a data loader:

*   Link Labels (in the inline link editor)
*   Reference / References editor
*   Data Sources in the Select Editor

Each Data Loader can have a slightly different API, so check the “description” field of each data loader when using it. It is up to the data loaders to implement caching internally.

Normally, each data loader exposes the following methods:

```javascript
resolveValue(options, identifier) {
  // "options" is a DataLoader-specific object.
  // returns Promise with [{identifier, label}, ...] list; where "identifier" was resolved to the actual object represented by "identifier".
}

search(options, searchTerm) {
  // "options" is a DataLoader-specific object.
  // returns Promise with [{identifier, label}, ...] list; these are the objects displayed in the selection dropdown.
}
```

## Containers

Way to retrieve:

```javascript
globalRegistry.get('containers')
```

The whole user interface is built around container components. They are registered through the containers registry. Below you will find an example on how to replace the PageTree container with your custom container:

```javascript
manifest('Example', {}, globalRegistry => {
  const containerRegistry = globalRegistry.get('containers');
  containerRegistry.set('LeftSideBar/Top/PageTreeToolbar', () => null);
  containerRegistry.set('LeftSideBar/Top/PageTreeSearchbar', () => null);
  containerRegistry.set('LeftSideBar/Top/PageTree', FlatNavContainer);
});
```

## Server Feedback Handlers

Way to retrieve:

```javascript
globalRegistry.get('serverFeedbackHandlers')
```

Contains all server feedback handlers.

The key is the server-feedback-handler-type, and the value is a function with the following signature:

```javascript
(feedback, store) => {
  // do whatever you like here :-)
}

```

## Reducers

Way to retrieve:

```javascript
globalRegistry.get('reducers')
```

Allows to register custom reducers for your plugin. It is probably a bad idea to override any of the existing reducers.

## Sagas

Way to retrieve:

```javascript
globalRegistry.get('sagas')
```

Allows to register custom sagas for your plugin. It is probably a bad idea to override any of the existing reducers.

Example:

manifest.js:
```javascript
import manifest from '@neos-project/neos-ui-extensibility';
import {put, takeLatest} from 'redux-saga/effects';
import {actions, actionTypes} from '@neos-project/neos-ui-redux-store';

function* watchNodeFocus() {
  yield takeLatest(actionTypes.CR.Nodes.FOCUS, function* (action) {
    yield put(actions.UI.FlashMessages.add(
      'testMessage',
      'Focused: ' + action.payload.contextPath,
      'success'
    ));
  });
}
manifest('The.Demo:Focus', {}, globalRegistry => {
  const sagasRegistry = globalRegistry.get('sagas');
  sagasRegistry.set('The.Demo/watchNodeFocus', {saga: watchNodeFocus});
});

```