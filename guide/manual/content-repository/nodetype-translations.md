url: /guide/manual/content-repository/nodetype-translations
# NodeType Translations

Translating the user interface

### Backend Default Language

The backend default language for editors can be defined in your settings yaml file.

Configuration/Settings.yaml:
```yaml
Neos:
  Neos:
    userInterface:
      defaultLanguage: 'en'
```

### Define Translations

To use the translations for NodeType labels or help messages you have to enable it for each label or message by setting the value to the predefined value _'i18n'_ instead of using normal text.

Example:

Configuration/NodeTypes.Content.YourContentNodeTypeName.yaml:
```yaml
'Vendor.Site:Content.YourContentElementName':
  ui:
    help:
      message: 'i18n'
    inspector:
      tabs:
        yourTab:
          label: 'i18n'
      groups:
        yourGroup:
          label: 'i18n'
  properties:
    yourProperty:
      type: string
      ui:
        label: 'i18n'
        help:
          message: 'i18n'

```

That will instruct Neos to look for translations of these labels. 

To register an XML Localization Interchange File Format (xliff) file for these NodeTypes you have to add the following configuration to the Settings.yaml of your package:

Configuration/Settings.yaml:
```yaml
Neos:
  Neos:
    userInterface:
      translation:
        autoInclude:
          'Vendor.Site': ['NodeTypes/*']
```

Neos will now look for a file **Resources/Private/Translations/en/NodeTypes/Content/YourContentElementName.xlf**

The translated labels for _help_, _properties_, _groups_, _tabs_ and _views_ are defined in the xliff as follows:

Resources/Private/Translations/en/NodeTypes/Content/YourContentElementName.xlf:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
    <file original="" product-name="Vendor.Site" source-language="en" datatype="plaintext">
        <body>
            <trans-unit id="ui.help.message" xml:space="preserve">
                <source>Your help message here</source>
            </trans-unit>
            <trans-unit id="ui.inspector.tabs.yourTab.label" xml:space="preserve">
                <source>Your Tab Title</source>
            </trans-unit>
            <trans-unit id="ui.inspector.groups.yourGroup.label" xml:space="preserve">
                <source>Your Group Title</source>
            </trans-unit>
            <trans-unit id="properties.yourProperty.ui.label" xml:space="preserve">
                <source>Your Property Title</source>
            </trans-unit>
            <trans-unit id="properties.yourProperty.ui.help.message" xml:space="preserve">
                <source>Your help message here</source>
            </trans-unit>
        </body>
    </file>
</xliff>
```

If you want to learn more in details, how this works and how the workflow can be improved read [Translating Text in Fusion](/guide/manual/rendering/translating-text-in-fusion).

### Overriding Translations

Instead of '18n' translatable content can also be defined by a path to a translation string in the format:  
_Vendor.Package:Xliff.Path.And.Filename:labelType.identifier_

The string consists of three parts delimited by a colon:

*   First, the _Package Key_
*   Second, the path towards the xliff file, replacing slashes by dots (relative to Resources/Private/Translations/<language>).
*   Third, the key inside the xliff file.

For the example above that would be _Vendor.Site:NodeTypes.Content.YourContentElementName:properties.title_:

```yaml
properties:
  title:
    type: string
      ui:
        label: 'Vendor.Site:NodeTypes.Content.YourContentElementName:properties.title'
```

If you e.g. want to _relabel_ an existing node property of a different package, you always have to specify the full translation key (pointing to your package’s XLIFF files then).

> **💡 Tip**
> 
> In most cases you do not want to change an existing package, instead set the NodeType of the third-party package to _abstract: true_ and build you own NodeType.

## Validate Translations

To help you find labels in the Neos editor interface that you still need to translate, you can use the language label scrambling setting in your yaml file. This will replace all translations by a string consisting of only # characters with the same length as the actual translated label. With this setting enabled every still readable string in the backend is either content or non-translated.

Configuration/Settings.yaml:
```yaml
Neos:
  Neos:
    userInterface:
      scrambleTranslatedLabels: true
```

> **ℹ️ Note**
> 
> The translation labels used in the javascript ui are parsed to a big json file. While changing xliff files this cached should be flushed, but still it can turn out useful to disable this cache. You can do so by using the following snippet in your Caches.yaml

Configuration/Caches.yaml:
```yaml
Neos_Neos_XliffToJsonTranslations:
  backend: Neos\Cache\Backend\NullBackend
```

## Further reading

*   [Full localization in Neos](/guide/features/localization)
*   [XLIFF translation tools](https://docs.neos.io/cms/manual/rendering/translating-text-in-fusion#improving-the-translation-workflow)