url: /guide/manual/best-practices
# Neos Best-Practices

Version 1.0.0

This is a technical document focused on advanced users. For beginners and intermediate developers, just read the manuals and guide which are following these best practises.

The recommendation we are giving here does not mean that things are wrong if done differently, there are valid reasons to deviate from those guidelines. However with no specific reasons speaking against we strongly recommend to obey to the following rules.

If you rather want to watch a video about the best practices, check Maya's talk of Neos Conference 2019:

[![Neos Con 2019 | Maya Bornschein: How to build a state of the art Neos project in 2019](/_Resources/Persistent/10b8f8c3e4573989358a1d6f8ad944de3b332c21/Youtube-zxd1yc2wlL4-maxresdefault.jpg)](https://www.youtube.com/watch?v=zxd1yc2wlL4)

## Introduction

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED",  "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC 2119.](https://www.ietf.org/rfc/rfc2119.txt)

Note: We will use semantic versioning for these best practises.

## NodeTypes

1.  Each NodeType SHOULD be defined in a dedicated yaml-file and the file-name MUST represent the namespace of the contained NodeType/s. This helps finding the definition of a NodeType and get an understanding of the existing NodeTypes by looking at the configuration folder.
2.  The namespace of the your own NodeTypes SHOULD be structured and nested. It is RECOMMEND to start with one of the prefixes "Document", "Content", "Mixin", "Collection" or "Constraint".
3.  NodeType-files that modify NodeTypes from other Packages MUST have “Override” in the filename.
4.  Sub-NodeTypes that are bound to a specific parent NodeType SHOULD have a name matching the parent, e.g. "Vendor:Content.Slider" and "Vendor:Content.Slider.Item"
5.  Properties SHOULD only be editable by a single editor – either inline or in the inspector. Editing the same property with different editors like inspector and inline easily causes problems when settings are only slightly off.
6.  Each NodeType property MUST be valid after creating a new node. This can be done by defining the defaultValue or by allowing the property being empty. Especially SelectBoxEditors caused trouble in the past if they neither allowed being empty nor had good defaults.
7.  The Neos.Neos.NodeTypes package SHOULD NOT be used directly. We RECOMMEND to create NodeTypes in the project namespace. You MAY use the Mixins from [Neos.Neos.NodeTypes.BaseMixins](https://www.neos.io/download-and-extend/packages/neos/neos-nodetypes-basemixins.html) instead.
8.  A NodeType SHOULD only inherit from a single non-abstract superType. All other superTypes SHOULD be Mixins, or Constraints. This helps keeping the inheritance chain understandable.

## Fusion

1.  The Root.Fusion in a project MUST not contain anything but includes.
2.  Fusion files SHOULD only contain a single prototype. The folder and filenames MUST reflect the names of the contained prototypes.
3.  The Fusion prototype-namespace SHOULD be structured and nested. It is RECOMMENDED to start with one of the prefixes “Content”, “Document”, “Component”,  “Helper” “Presentation” and “Integration”.
4.  Each non-abstract NodeType SHOULD have a matching Fusion prototype. This is the default way of Neos to find a matching Renderer and makes the code easy to understand. We RECOMMEND to abstract code into Fusion prototypes that are not bound to NodeTypes and reuse them across the project.
5.  Fusion prototypes with the prefixes “Content” and “Document” SHOULD implement the rendering of a Content or Document NodeType.
6.  Fusion prototypes with the “Component” Prefix SHOULD implement reusable rendering aspects.
7.  The rendering of content SHOULD be defined in Fusion-AFX. Fluid-Templates are still supported but no longer considered best-practice.
8.  Fusion-files that modify prototypes from other packages MUST have “Override” in the file- or folder name.
9.  For larger projects the presentational prototypes SHOULD be separated from Integration. This can be done with separate packages or folders “Presentation”, “Integration”. Those presentational Fusion prototypes MUST implement rendering aspects only without fetching data from the ContentRepository. 
10.  Visual differentiations between Documents SHOULD be implemented via separate Document-NodeTypes. Especially the layout property from Neos.Neos:NodeTypes.Page layout property SHOULD NOT be used.

## Distributions

1.  Neos projects SHOULD be managed as a single git repository that contains all packages that are specific to this project. This gives you a shared git history for all project-specific code.
2.  The “Packages” folder SHOULD only be controlled by composer. All your own project-specific packages MUST be be stored in special directory like “DistributionPackages” that is referenced as a repository of type path in the main composer file.

## Public Packages

1.  We RECOMMEND to separate reusable Mixins, Helpers and Prototypes from concrete NodeTypes, Configurations and Rendering. This makes it easy to only use specific parts of your package.
2.  You MAY provide presentational components without a direct coupling to the NodeTypes. This makes your package even more flexible other developers.

_Written by_ **Roland Schütz** & **Martin Ficzel**