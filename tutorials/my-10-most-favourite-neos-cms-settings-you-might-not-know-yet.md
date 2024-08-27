url: /tutorials/my-10-most-favourite-neos-cms-settings-you-might-not-know-yet
# My 10 most favourite Neos CMS settings you might not know yet

Inspiration for tuning your live Neos instance to your liking.

**Editor's note: This article was first published by Sebastian Helzle on his** [**personal blog**](https://mind-the-seb.de/blog/my-10-most-favourite-neos-cms-settings)**.**

Very often I copy & paste settings from existing projects as I need them for most new projects. Or I help other people when they wonder how to achieve certain things in Neos.

To make things easier, here is a list of my top 10 settings in Flow & Neos CMS.

You can add them to your main Settings.yaml of your site package or create additional `Settings.XYZ.yaml` files where XYZ matches the topic of the settings it contains.

## 1\. Disable session timeout during development

```yaml
Neos:
  Flow:
    session:
      inactivityTimeout: 0
```

Annoyed when the Neos backend bothers you with a login popup when just wanted to test your new content element?  
This will make sure that your backend session is still alive while you've been busy implementing your changes.

You can put this setting into `Development/Settings.yaml` in your Configuration folder, so it's only loaded during development.

## 2\. Change default languages and fallbacks

```yaml
Neos:
  Flow:
    i18n:
      defaultLocale: de
      fallbackRule:
        order: ['fr', 'en']
  Neos:
    userInterface:
      defaultLanguage: de
```

Changes on the one hand the order in which translations and their fallbacks are loaded for plugins and other frontend code. But also the default backend interface language for new users.  
Don't forget the `fallbackRule` or you might even get errors when your language has missing translations in some package.

## 3\. Define global image quality

```yaml
Neos:
  Media:
    image:
      defaultOptions:
        quality: 95
        webp_quality: 95
        jpeg_quality: 95
        png_compression_level: 95
```

Defines the default image quality that the configured image library in Neos will use.

## 4\. Remove application version from HTTP header

```yaml
Neos:
  Flow:
    http:
      applicationToken: ApplicationName
```

By default the version of Flow & Neos is contained in the HTTP header. With this setting it will just say "_Flow Neos_".

## 5\. Define initial tree loading depth

```yaml
Neos:
  Neos:
    userInterface:
      navigateComponent:
        nodeTree:
          loadingDepth: 1
        structureTree:
          loadingDepth: 2
```

This setting decreases the initial loading depth which can help with large or complex trees and long loading times.

If you have long loading times. Maybe you want to look into using ElasticSearch for querying the page tree.

## 6\. Define responsive previews for the backend

```yaml
Neos:
  Neos:
	userInterface:
	  editPreviewModes:
		iphone:
		  isEditingMode: false
		  isPreviewMode: true
		  fusionRenderingPath: ''
		  title: 'iPhone'
		  position: 100
		  width: 375px
		  height: 667px
		  backgroundColor: 'black'
		ipad:
		  isEditingMode: false
		  isPreviewMode: true
		  fusionRenderingPath: ''
		  title: 'iPad - landscape'
		  position: 100
		  width: 1024px
		  height: 768px
		  backgroundColor: 'black'
```

These settings allow you to add additional preview modes in the backend to see how the selected page will look on small to large devices.

## 7\. Additional groups for the creation dialog

```yaml
Neos:
  Neos:
	nodeTypes:
	  groups:
		myAdditionalTypes:
		  position: 'end'
		  label: 'My additional rarely used types'
		  collapsed: true
```

You have a lot of node types? Group them in a smart way and initially collapse groups with rarely needed types.

## 8\. Disable html suffix in URL generation

```yaml
Neos:
  Flow:
	mvc:
	  routes:
		'Neos.Neos':
		  variables:
			defaultUriSuffix: ''
```

Bored of ".html" at the end of your urls? Disable it!  
But don't do it in production without a redirect mechanism ;)

## 9\. Spot untranslated labels in the backend

```yaml
Neos:
  Neos:
	userInterface:
	  scrambleTranslatedLabels: true
```

Only do this during development!  
It will scramble all labels that are using the translation mechanism in Flow / Neos.  
Everything that can still be read is either your data or untranslated labels.

## 10\. Customize your login screen

```yaml
Neos:
  Neos:
	backendLoginForm:
	  backgroundImage: 'resource://My.Site/Public/Images/Login/MyLoginScreen.jpg'
	  stylesheets:
		'My.Site:LoginStyles': 'resource://My.Site/Public/Styles/Login.css'
```

You don't like our beautiful login background in each Neos version? Or you want to keep the one you like the most? Or you want to have your customer see something related to their company?  
Simply change the background image to your liking.  
You can even add your own stylesheet to override the Neos logo or make other changes.

## Summary

There are a lot of settings in the Flow & Neos core packages. But the ones I mentioned should solve the most common issues.

But it's always a good idea to go into the `Settings.yaml` files of the packages you use and have a look around. Maybe you spot a helpful setting too!

_Written by_ **Sebastian Helzle**