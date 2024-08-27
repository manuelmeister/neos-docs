url: /tutorials/editing-a-shared-footer-across-all-pages
# Editing a shared footer across all pages

> **ℹ️ Might not be the best approach**
> 
> While stil approach still works, we would recommend you to use properties on the Homepage NodeType in most cases, instead of a content collection.

To create a shared footer you probably want to have a ContentCollection of arbitrary content, that is then shown on all pages.

In Neos nodes must have a proper parent. So to implement this we will:

1.  Create a document NodeType Homepage and define the footer there
2.  Render the footer always with data from the Homepage node

This enables you to edit the footer on all pages.

To add the footer to the page you use the ContentCollection with a static node path.

### 1\. Define the NodeType

To have the collection on the homepage you need to configure the childNodes structure of the homepage. For this you create a Homepage NodeType with for example the following configuration

NodeTypes.Document.Homepage.yaml:
```yaml
'Vendor.Site:HomePage':
  superTypes:
    'Neos.Neos:Document': true
  ui:
    label: 'Homepage'
  childNodes:
    footer:
      type: 'Neos.Neos:ContentCollection'
```

> **💡 Tip**
> 
> If you run into the situation that the child nodes for your page are missing (for example if you manually updated the NodeType in the database) you might have to create the missing child nodes using:
> 
>   
> ./flow node:repair --node-type Neos.NodeTypes:Page

### 2\. Define the Fusion rendering

We expect that the root node of the website is the _Vendor.Site:HomePage_, so we can just get the footer property of the root node _site_.

**Neos 4-7**

```neosfusion
// A shared footer which can be edited from all pages
// You need to define this for every page type
prototype(Vendor.Site:Document.Page) {
	body {
		# we define a new property where we render the footer
		footer = Neos.Neos:ContentCollection {
			# set the correct node for inline editing on subpages
			@context.node = ${site}

			# get all items from the root node footer
			collection = ${q(site).children('footer').children()}
		}

		# we append the footer as part of the body content
		# this might change depending on what/how you render the body content
		body.@process.appendFooter = ${value + this.footer}
	}
}
```

Of course you have to update the selection in the example if your footer is not stored on the site root, but for example on a page named ‘my-page’. The selection would then be:

```neosfusion
${q(site).find('my-page').children('footer').children()}
```

**Neos 3**

```neosfusion
// A shared footer which can be edited from all pages
page.body.footer = Neos.Neos:ContentCollection {
	nodePath = ${q(site).children('footer').property('_path')}
	collection = ${q(site).children('footer').children()}
}
```

Of course you have to update the selection in the example if your footer is not stored on the site root, but for example on a page named ‘my-page’. The selection would then be:

```neosfusion
${q(site).find('my-page').children('footer').children()}
```