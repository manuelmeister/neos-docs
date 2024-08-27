url: /guide/manual/backend-permissions/asset-privileges
# List of Asset Privileges

These asset privileges are offered by the Neos core.

Asset privileges define what can be restricted in relation to accessing Assets (images, documents, videos, …), AssetCollections and Tags.

> **💡 Tip**
> 
> Like Node Privileges this is a denylist by default, so the privilege won’t match if one of the conditions don’t match.

### ReadAssetPrivilege

A privilege that prevents reading assets depending on the following Privilege Matchers:

#### Asset Title

This allows to match on the title of the asset.

**Signature:**

`titleStartsWith(title-prefix)`

**Parameters:**

*   `title-prefix` (string) Beginning of or complete title of the asset to match

**Signature:**

`titleEndsWith(title-suffix)`

**Parameters:**

*   `title-suffix` (string) End of title of the asset to match

**Signature:**

`titleContains(title-part)`

**Parameters:**

*   `title-part` (string) Part of title of the asset to match

#### Asset Media Type

This allows to match on the media type of the asset.

**Signature:**

`hasMediaType(media-type)`

**Parameters:**

*   `media-type` (string) Media Type of the asset to match (for example “application/json”)

#### Tag

This allows to match on a label the asset is tagged with.

**Signature:**

`isTagged(tag-label-or-id)`

**Parameters:**

*   `tag-label-or-id` (string) Label of the Tag to match (for example “confidential”) or its technical identifier (UUID)

#### Asset Collection

This allows to match on an Asset Collection the asset belongs to.

**Signature:**

`isInCollection(collection-title-or-id)`

**Parameters:**

*   `collection-title-or-id` (string) Title of the Asset Collection to match (for example “confidential-documents”) or its technical identifier (UUID)

Alternatively, the `isWithoutCollection` filter can be used to to match on assets that don’t belong to any Asset Collection.

**Signature:**

`isWithoutCollection()`

Usage example:

Policy.yaml:
```yaml
privilegeTargets:
  'Neos\Media\Security\Authorization\Privilege\ReadAssetPrivilege':
    'Some.Package:ReadAllPDFs':
      matcher: 'hasMediaType("application/pdf")'

    'Some.Package:ReadConfidentialPdfs':
      matcher: 'hasMediaType("application/pdf") && isTagged("confidential")'
```

### ReadAssetCollectionPrivilege

A privilege that prevents reading Asset Collections depending on the following Privilege Matchers:

#### Collection Title

This allows to match on the title of the Asset Collection.

**Signature:**

`isTitled(collection-title)`

**Parameters:**

*   `collection-title` (string) Complete title of the Asset Collection to match

Usage example:

Policy.yaml:
```yaml
privilegeTargets:
  'Neos\Media\Security\Authorization\Privilege\ReadAssetCollectionPrivilege':
    'Some.Package:ReadSpecialAssetCollection':
      matcher: 'isTitled("some-asset-collection")'
```

#### Collection Identifier

This allows to match on the technical identifier (UUID) of the Asset Collection.

**Signature:**

`hasId(collection-id)`

**Parameters:**

*   `collection-id` (string) Technical identifier (UUID) of the Asset Collection to match

Usage example:

Policy.yaml:
```yaml
privilegeTargets:
  'Neos\Media\Security\Authorization\Privilege\ReadAssetCollectionPrivilege':
    'Some.Package:ReadSpecialAssetCollection':
      matcher: 'hasId("9b13346d-960a-45e6-8e93-c2929373bc90")'
```

This defines a privilege target that intercepts reading any property of the specified node (and all of its child-nodes).

### ReadTagPrivilege

A privilege that prevents reading tags depending on the following Privilege Matchers:

#### Tag Label

This allows to match on the label of the tag.

**Signature:**

`isLabeled(tag-label)`

**Parameters:**

*   `tag-label` (string) Complete label of the tag to match

Usage example:

Policy.yaml:
```yaml
privilegeTargets:
  'Neos\Media\Security\Authorization\Privilege\ReadTagPrivilege':
    'Some.Package:ReadConfidentialTags':
      matcher: 'isLabeled("confidential")'
```

#### Tag Identifier

This allows to match on the technical identifier (UUID) of the Tag.

**Signature:**

`hasId(tag-id)`

**Parameters:**

*   `tag-id` (string) Technical identifier (UUID) of the Tag to match

Usage example:

Policy.yaml:
```yaml
privilegeTargets:
  'Neos\Media\Security\Authorization\Privilege\ReadTagPrivilege':
    'Some.Package:ReadConfidentialTags':
      matcher: 'hasId("961c3c03-da50-4a77-a5b4-11d2bbab7197")'
```

> **💡 More**
> 
> You can find out more about the Asset Privileges in the [Neos Media documentation](http://neos-media.readthedocs.io/en/stable/)