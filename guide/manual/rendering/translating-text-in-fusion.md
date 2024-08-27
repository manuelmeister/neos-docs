url: /guide/manual/rendering/translating-text-in-fusion
# Translating Text in Fusion/Fluid

Non-editorial text is translated using message catalogs in the [XLIFF](https://en.wikipedia.org/wiki/XLIFF) format. These are files saved inside your package. It allows you to translate text in your YAML/Fusion/Fluid/AFX files. The XLIFF format facilitates collaboration with external translation programs and services. 

Before you start, you need to have content dimensions enabled for the languages you want to support. [Learn how to define languages here.](https://docs.neos.io/cms/manual/content-repository/multiple-languages)

In this chapter we will enable translation files, then we will create the source file and the translations. Last, we will use those translations.

## Load translation files

We can tell Neos to load the XLIFF file by defining an inclusion path in the Settings.yaml of your package.

In the following example we include will add all files within the packages `Resources/Private/Translations/_[DIMENSION_NAME]_/NodeTypes` folder.  
`[DIMENSION_NAME]` is the value of the content dimension "language", e.g. `en`, `fr` or `de`.

If the translation file is not available, the next possible file will be used according to the fallback rules.

Configuration/Settings.yaml:
```yaml
Neos:
  Neos:
    userInterface:
      translation:
        autoInclude:
          'Vendor.Site':
            - 'NodeTypes/*'
```

### Create a source file

Let's say we want to create a news teaser which has a "more" button, which should be translated. Let's create a source language file `Resources/Private/Translations/en/NodeTypes/Content/NewsTeaser.xlf`

Resources/Private/Translations/en/NodeTypes/Content/YourContentElementName.xlf:
```xml
<?xml version="1.0"?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
	<file original="" product-name="Vendor.Site" source-language="en" datatype="plaintext">
		<body>
			<trans-unit id="readMore">
				<source>Read more</source>
			</trans-unit>
		</body>
	</file>
</xliff>

```

### Create a translation file

To create a German version of this we create a translation file:

`Resources/Private/Translations/de/NodeTypes/Content/NewsTeaser.xlf`

Resources/Private/Translations/en/NodeTypes/Content/YourContentElementName.xlf:
```xml
<?xml version="1.0"?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
	<file original="" product-name="Vendor.Site" source-language="en" datatype="plaintext" target-language="de">
		<body>
			<trans-unit id="readMore">
				<source>Read more</source>
				<target xml:lang="de" state="translated">Mehr lesen</target>
			</trans-unit>
		</body>
	</file>
</xliff>

```

## Use the translations

Now we can use those translation in all rendering code:

**Fusion**

```neosfusion
readMore = ${I18n.translate('Vendor.Site:NodeTypes.NewsTeaser:readMore')}
```

[I18n.translate Reference](https://neos.readthedocs.io/en/stable/References/EelHelpersReference.html#translation-translate-id-originallabel-arguments-source-package-quantity-locale)

**AFX**

AFX:
```neosfusion
renderer = afx`
	<strong>{I18n.translate('Vendor.Site:NodeTypes.NewsTeaser:readMore')}</strong>
`
```

[I18n.translate Reference](https://neos.readthedocs.io/en/stable/References/EelHelpersReference.html#translation-translate-id-originallabel-arguments-source-package-quantity-locale)

**Fluid**

```markup
{f:translate(id: 'Vendor.Site:NodeTypes.NewsTeaser:readMore')}
```

[f:translate Reference](https://neos.readthedocs.io/en/stable/References/ViewHelpers/FluidAdaptor.html#f-translate)

To give you a full example, this is how the whole teaser could look like. In our example the NewsTeaser finds the latest News and shows a teaser for that.

Resources/Private/Fusion/Content/NewsTeaser/NewsTeaser.fusion:
```neosfusion
prototype(Vendor.Site:Content.NewsTeaser) < prototype(Neos.Neos:ContentComponent) {
	latestNews = ${q(documentNode).find('[instanceof Vendor.Site:Document.NewsPage]').sort('createdAt', 'DESC').get(0)}
	title = ${q(this.latestNews).property('title')}
	teaser = ${q(this.latestNews).property('text')}
	teaser.@process.crop = ${String.cropAtWord(String.stripTags(value), 250, ' ...')}
	readMore = ${I18n.translate('Vendor.Site:NodeTypes.NewsTeaser:readMore')}
	nodeLink = Neos.Neos:NodeUri {
		node = ${latestNews}
	}

	renderer = afx`
		<div class="news-teaser">
			<h2>{props.title}</h2>
			<p>{props.teaser}</p>
			<a href={props.nodeLink}>{props.readMore}</a>
		</div>
	`

	@cache {
		mode = 'cached'
		entryIdentifier.node = ${node}
		entryTags {
			1 = ${Neos.Caching.nodeTag(node)}
			2 = ${Neos.Caching.nodeTypeTag('Vendor.Site:Document.NewsPage', documentNode)}
		}
	}
}

```

## Improving the translation workflow

XLIFF files are supported by many third-party tools.

While XLIFF–being based on XML–can be edited by hand, this is not really the best way to work on actually translating a lot of text. 

Here are some recommendations:

*   [Weblate is a online translation platform   
    (we use it for Neos itself)](https://hosted.weblate.org/projects/neos/)
*   [Crowdin is another online translation platform](https://crowdin.com/)
*   [Import & Export for "Trados"](https://www.neos.io/download-and-extend/packages/flownative/flownative-neos-trados.html)

[Translate the Administration Area for editors](/guide/manual/content-repository/nodetype-translations)

## Further reading

*   [The translation helper in Neos CMS (Blog)](https://mind-the-seb.de/blog/the-translation-helper-in-neos-cms)