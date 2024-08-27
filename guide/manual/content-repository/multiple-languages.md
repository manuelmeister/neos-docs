url: /guide/manual/content-repository/multiple-languages
# Multiple Languages

Multi-Language Support - including Fallbacks

> **⚠️ Neos <=8.x content**
> 
> This is content for **Neos <= 8.x releases.**
> 
> This content is obsolete with Neos 9.0 and the event sourced Content Repository.

Neos supports content in multiple languages through a concept called **content dimensions**. On this page, we'll focus on the common case of having a single _language_ dimension to achieve a multi-lingual website. Later on, we'll generalize this for arbitrary dimensions.

## Concepts

Here, we'll explain the concept of **node variants** and **fallbacks**.

#### Introducing Node Variants

So far, we have explained the Content Repository as a big tree of nodes. It turns out that this is not 100% correct: At each tree node, there might be multiple so-called _node variants_, so one node variant for _German_ and one for _English_.

When running Neos with just a single language, every node has exactly one node variant.

Using node variants, you can easily find all other variants of a given node, i.e. from the German version of a page, link to the English version of the same page. This allows to build good language menus.

Furthermore, the concept of Node Variants allows arbitrary translation directions: It is common that some pages might exist only in German, others only in English, while the majority of pages exists in both languages.

#### Introducing Language Fallbacks

Aside from disjunct languages (i.e. languages which have nothing in common), Neos also supports languages which are pretty similar to each other, like British English and American English. In this case, you probably do not want to maintain your full content in both languages, but on the other hand, certain teaser and introduction texts should be customized to each individual audience.

Using _language fallbacks_, you can define e.g. that _British English_ falls back to _American English_. In practice, this means if content is available in British English, it will be shown; whereas all other content is shown from _American English_.

We usually visualize this like _layers_ in a photo editing application: The final rendering is a combination of the base layer (i.e. _American English_ in our example), plus the _British English_ layer on top.

> **ℹ️ Make sure to remove the Neos.Demo Site**
> 
> Before you start, make sure to remove the Neos.Demo site from your distribution, as it contains numerous language definitions which might interfere with the definitions we're doing below.

## Configuring a monolingual site

We first start with a monolingual site, and later extend it with a second language and fallbacks.

First, we'll have a look at the _Configuration/Settings.yaml_ of your Site package and configure an _English_ dimension:

Configuration/Settings.yaml:
```yaml
Neos:
  Neos:
    routing:
      supportEmptySegmentForDimensions: true
  ContentRepository:
    contentDimensions:
      language:                      # (1)
        label: 'Language'
		# The default dimension that is applied when creating nodes without specifying a dimension
        default: en_US               # (2)
		 # The default preset to use if no URI segment was given when resolving languages in the router
        defaultPreset: en            # (3)
        presets:
          en:                        # (4)
            label: 'English (US)'
            values:                  # (5)
              - en_US
            uriSegment: ''           # (6)
```

*   We define a content dimension called _language_ at (1).
*   The _language_ dimension consists of one preset: _en_ (4). A preset is what users can select in the Neos User Interface to switch between languages/dimensions.
*   Each preset configures a _label_ which is used in the User Interface and (optionally) in the Dimension Menu, a list of _values_ (5) (more on that a few lines down), and an _uriSegment_ (6) with which URIs will be prefixed with.
*   If your site has only one language, you can leave the _uriSegment blank. This_ will remove the language snippet from the uris.
    *   Also, please be sure to set _supportEmptySegmentForDimensions_ to **true**
*   **Crucially important are the** _**default**_ **and** _**defaultPreset**_ **keys**: They define what language you get when visiting the root of the website; and when logging into the backend. So the _default_ (2) must reference the value _en\_US_, while the _defaultPreset_ (3) must reference the preset _en_.

So what's the matter with the _values_ key? This is what is stored inside the node variant in the database. Below, we will use multiple _values_ to configure language fallbacks.

> **ℹ️ Clear your cache after changing the dimension configuration**
> 
> You may have to clear your cache using _./flow flow:cache:flush_ after adjustments to the content dimensions, because e.g. URLs have to be regenerated after modifications.

#### Migrate existing content

With the above configuration, when we refresh our website, our complete website has no visible content anymore, as the content in the system is not yet moved to the _language_ dimension.

This can be done with a node migration which is included in the _Neos.ContentRepository_ package:

```bash
./flow node:migrate 20150716212459
```

Now, every content in the system is moved to _language en\_US_, because this is the dimension's _default_ in the configuration above.

Basically, your content is visible again in _en\_US._

## Configuring a bilingual site

Next up, we're looking at the setup of a bilingual site, and later extend it with fallbacks.

To add/remove/change dimensions, open the _Configuration/Settings.yaml_ of your Site package and configure your dimension. In the example we're using English and German:

Configuration/Settings.yaml:
```yaml
Neos:
  ContentRepository:
    contentDimensions:
      language:                      # (1)
        label: 'Language'
        default: en_US               # (2)
        defaultPreset: en            # (3)
        presets:
          en:                        # (4)
            label: 'English (US)'
            values:                  # (5)
              - en_US
            uriSegment: ''           # (6)
          de:                        # (7)
            label: German
            values:
              - de
            uriSegment: de
```

*   We define a content dimension called _language_ at (1).
*   The _language_ dimension consists of two presets _en_ (4) and _de_ (7). A preset is what you select in the Neos User Interface to choose which content you want to see.
*   Each preset configures a _label_ which is used in the User Interface and (optionally) in the Dimension Menu, a list of _values_ (5) (more on that a few lines down), and an _uriSegment_ (6) with which URIs will be prefixed with.
*   An empty _uriSegment_ is allowed (6); so in the example above, the English website is available directly at _/_, while the German website starts with URLs at _/de_.
*   **Crucially important are the** _**default**_ **and** _**defaultPreset**_ **keys**: They define what language you get when visiting the root of the website; and when logging into the backend. So the _default_ (2) must reference the value _en\_US_, while the _defaultPreset_ (3) must reference the preset _en_.

So what's the matter with the _values_ key? This is what is stored inside the node variant in the database. Below, we will use multiple _values_ to configure language fallbacks.

> **⚠️ uriSegment is not allowed to contain underscore (\_)**
> 
> The property _uriSegment_ is not allowed to contain any underscores. As an example, a valid identifier is _de-DE,_ but **not** _**de\_DE**_.  
>   
> There's an [open bug report](https://github.com/neos/neos-development-collection/issues/2417) which explains the background of that.

> **ℹ️ Clear your cache after changing the dimension configuration**
> 
> You may have to clear your cache using _./flow flow:cache:flush_ after adjustments to the content dimensions, because e.g. URLs have to be regenerated after modifications.

#### Migrate existing content

With the above configuration, when we refresh our website, our complete website has no visible content anymore, as the content in the system is not yet moved to the _language_ dimension.

This can be done with a node migration which is included in the _Neos.ContentRepository_ package:

```bash
./flow node:migrate 20150716212459
```

Now, every content in the system is moved to _language en\_US_, because this is the dimension's _default_ in the configuration above.

This means your content is visible again in _en\_US_, and you can start translating from _en\_US_ to _de_.

## Configuring a Fallback Language

We will now take the example from above and extend it with _British English_, which should fall back to _American English_:

Configuration/Settings.yaml:
```yaml
Neos:
  ContentRepository:
    contentDimensions:
      language:
        label: 'Language'
        default: en_US
        defaultPreset: en
        presets:
          en:
            label: 'English (US)'
            values:
              - en_US
            uriSegment: ''
          de:
            label: German
            values:
              - de
            uriSegment: de

          ##### modification starts here
          en_UK:                    # (1)
            label: 'English (UK)'   # (2)
            values:                 # (3)
              - en_UK
              - en_US
            uriSegment: uk          # (4)

```

*   We define a new preset _en\_UK_ (1), and give it a human readable _label_ for the User Interface (2).
*   The _values_ now contain **two elements (3) meaning: "Please use the content from** _**en\_UK**_**, falling back to content from** _**en\_US**_**".**
*   We also need to configure an _uriSegment_ (4).

That's it :) By configuring multiple _values_, we specify the fallback order.

#### Behind the Scenes

The language fallbacks are applied while **reading** the content from the CR. This means in the database, if you check for _British English_ content, you'll see the _language: en\_UK_ value.

## Translating Content

When you switch to a language in the Neos User Interface, there are two things which can happen:

*   If the page already exists in the target language, it is shown.
*   If the page does not exist yet, a popup appears where you can create this node variant.

![](/_Resources/Persistent/e81cd3b5ff3c2006f8f757023f0ab0d8721354ee/Lanugage%20variation%20creation%20dialog.png)

Language variation creation dialog

For translating with language fallbacks, you simply switch to the _British English_ version of the website. At first, the default (_American English_) content will shine through. As soon as a shine-through node is updated, it will be automatically copied to the _British English_ variant.

## Language Menu

So not that you created content in multiple languages you probably want to allow your users to select the language. So let's create a language menu.

You can use the [_Neos.Neos:DimensionsMenu_](https://neos.readthedocs.io/en/stable/References/NeosFusionReference.html#neos-neos-dimensionsmenu) to generate links to other variants of the current page by using this Fusion object:

```neosfusion
languageMenu = Neos.Neos:DimensionsMenu {
    dimension = 'language'
}
```

[DimensionsMenu Reference](https://neos.readthedocs.io/en/stable/References/NeosFusionReference.html#neos-neos-dimensionsmenu)

## Additional Resources

*   [How to remove a language dimension](https://discuss.neos.io/t/remove-language/3485)
*   [Multilingual websites article (In German, by Daniel Lienert)](https://punkt.de/de/blog/2016/neos-workshop/neos-workshop-teil-5-mehrsprachige-seiten-mit-neos.html)
*   [Internationalization & Localization in the Flow Framework](https://flowframework.readthedocs.io/en/stable/TheDefinitiveGuide/PartIII/Internationalization.html)
*   [Enforce a main language as basis for translation (Community package)](https://github.com/flownative/neos-hostbaseddefaultpreset)
*   [Node Migrations](/guide/manual/content-repository/node-migrations)

In case you need to support more advanced cases like combinations of language and country, continue reading the chapter about _content dimensions_ next.