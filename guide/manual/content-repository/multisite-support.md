url: /guide/manual/content-repository/multisite-support
# Multisite Support

Neos has multi-site capabilities. This means you can run multiple independent websites in one installed Neos instance.

Check out Sebastians talk for how to setup multi-sites Neos instances:

[![One Neos - Many Websites](/_Resources/Persistent/aa1084bd19e420e481526d4cc8c7b521ca4276bf/One%20Neos%20-%20Many%20Websites%20talk-2588x1456-1920x1080.jpg)](https://www.youtube.com/watch?v=9X6Ufr8OzV0)

### Separating Assets Between Sites

In multi-site setups it can become a use case to having to separate assets to a between sites. For this Neos supports creating asset collections. An asset collection can contain multiple assets, and an asset can belong to multiple collections. Additionally tags can belong to one or multiple collections.

Every site can (in the site management module) be configured to have a default asset collection. This means that when assets are uploaded in the inspector they will automatically be added to the sites collection if one is configured. When the editor opens the media browser/module it will automatically select the current sites collection.

The media browser/module allows administrators to create/edit/delete collections and also select which tags are included in a collection.

## Further readings

*   [Multi-site access restriction with Neos CMS (Blog Article)](https://blog.ertmann.me/multi-site-access-restriction-with-neos-cms-9d5624126d5b)
*   [Multisite Kickstarter for Neos (Community Package)](https://github.com/flownative/neos-multisitekickstarter)
*   [Multisite Helper (Community Package)](https://github.com/flownative/neos-multisitehelper)
*   [Host-based Content Dimension Default Presets for Neos (Community Package)](https://github.com/flownative/neos-hostbaseddefaultpreset)