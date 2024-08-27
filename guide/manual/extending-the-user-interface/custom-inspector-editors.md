url: /guide/manual/extending-the-user-interface/custom-inspector-editors
# Custom inspector editors

Extending the inspector with custom React editors

It is possible to extend the inspector for adding new editors to edit the properties of your NodeTypes. You can find [all existing editors in our references](https://neos.readthedocs.io/en/stable/References/PropertyEditorReference.html).  
 

> **ℹ️ Note**
> 
> For documentation on how to create inspector editors for the legacy Ember version of the user interface, refer to the [older versions of the documentation](https://neos.readthedocs.io/en/2.3/ExtendingNeos/CustomEditors.html).

Every dataType has its default editor set, which can have options applied like:

```yaml
Neos:
  Neos:
    userInterface:
      inspector:
        dataTypes:
          'string':
            editor: 'Neos.Neos/Inspector/Editors/TextFieldEditor'
            editorOptions:
              placeholder: 'This is a placeholder'
```

On a property level this can be overridden like:

```yaml
Neos:
  Neos:
    userInterface:
      inspector:
        properties:
          'string':
            editor: 'My.Package/Inspector/Editors/TextFieldEditor'
            editorOptions:
              placeholder: 'This is my custom placeholder'
```

In order to implement a custom inspector editor one has to use the UI extensibility layer exposed through the @neos-project/neos-ui-extensibility package. See [Neos User Interface Extensibility API](/guide/manual/extending-the-user-interface/react-extensibility-api) for the detailed information on the topic.

Let’s create a simple color picker editor. For this, create a folder structure in your package to look like this:

```directory
AcmeCom.Neos.Colorpicker
├── Configuration
│   └── Settings.yaml
├── Resources
│   ├── Private
│   │   └── Scripts
│   │       └── ColorPickerEditor
│   │           ├── package.json
│   │           ├── src
│   │           │   ├── ColorPickerEditor.js
│   │           │   ├── index.js
│   │           │   └── manifest.js
│   └── Public
└── composer.json
```

You need to have a Composer manifest (composer.json) in place, otherwise the package will not be picked up by Flow and loading the editor will fail:

composer.json:
```json
{
  "name": "acmecom/neos-colorpicker",
  "type": "neos-package",
  "require": {
      "neos/neos-ui": "^5.2"
  },
  "extra": {
      "neos": {
          "package-key": "AcmeCom.Neos.Colorpicker"
      }
  }
}
```

Use the following package.json file:

package.json:
```json
{
  "scripts": {
    "build": "neos-react-scripts build",
    "watch": "neos-react-scripts watch"
  },
  "neos": {
    "buildTargetDirectory": "../../../Public/ColorPickerEditor"
  },
  "devDependencies": {
    "@neos-project/neos-ui-extensibility": "^5.2.1"
  },
  "dependencies": {
    "react-color": "^2.11.1"
  }
}
```

This will put the compiled Plugin.js asset into the Public/ColorPickerEditor folder. This file has to be loaded into the host UI to be useable. Put the following configuration into Settings.yaml to do it:

Settings.yaml :
```yaml
Neos:
  Neos:
    Ui:
      resources:
        javascript:
          'AcmeCom.Neos.ColorPicker:ColorPickerEditor':
            resource: resource://AcmeCom.Neos.ColorPicker/Public/ColorPickerEditor/Plugin.js
```

The key below javascript has no significance, but it is best practice to use the full package key and editor name, to avoid name clashes.

Now it is time to write the actual source code of the editor. From index.js we just require the manifest.js file:

```javascript
require('./manifest');
```

In manifest.js we use the manifest API to get access to the globalRegistry, then we get the editors registry out of it and register our custom editor into it:

manifest.js:
```javascript
import manifest from '@neos-project/neos-ui-extensibility';
import ColorPickerEditor from './ColorPickerEditor';

manifest('AcmeCom.Neos.ColorPicker:ColorPickerEditor', {}, globalRegistry => {
  const editorsRegistry = globalRegistry.get('inspector').get('editors');
  editorsRegistry.set('AcmeCom.Neos.ColorPicker/ColorPickerEditor', {
    component: ColorPickerEditor
  });
});
```

  
And finally the editor component itself in ColorPickerEditor.js:

ColorPickerEditor.js:
```javascript
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {SketchPicker} from 'react-color';

export default class ColorPickerEditor extends PureComponent {
  static propTypes = {
    value: PropTypes.string,
    commit: PropTypes.func.isRequired,
  };
  handleChangeColor = newColor => {
    this.props.commit(newColor.hex);
  };
  render() {
    return <SketchPicker color={this.props.value} onChange={this.handleChangeColor}/>;
  }
}

```

Each editor component gets a few API props passed, including the current value of the editor and the commit callback which the editor should use to commit the new value.

That is it! Now it is time to build and use our brand new editor! To build the editor you need to run the following commands:

```bash
cd Resources/Private/Scripts/ColorPickerEditor
yarn
yarn build # or yarn watch
```

The first call to yarn will install the needed dependencies, the second call to yarn build actually builds the editor. During development you can use yarn watch to run the build process whenever the code changes.

Then include the editor for some property in a NodeType:

```yaml
'Neos.NodeTypes:TextMixin':
  properties:
    color:
      ui:
        label: 'Color picker'
        inspector:
          editor: 'AcmeCom.Neos.ColorPicker/ColorPickerEditor'
```

> **ℹ️ Note**
> 
> You should exclude `Resources/Private/Scripts/YamlEditor/node_modules` from version control…

The _ColorPickerEditor_ is available at [github.com/neos/neos-ui-extensibility-examples](https://github.com/neos/neos-ui-extensibility-examples/tree/master/Resources/Private) along with more advanced examples. If you seek a missing example or want to add one, please contact us via [Slack](https://neos-project.slack.com/) and create a [pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).