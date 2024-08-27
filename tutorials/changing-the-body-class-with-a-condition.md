url: /tutorials/changing-the-body-class-with-a-condition
# Changing the Body Class with a condition

Most of the time you will render content inside the body tag. In some cases there is the need to define different body classes based on a certain condition.

It can for example be that if a page has sub pages then we want to add a body class tag for this.

This can be achieved by adding the attributes of the body tag in Fusion.

**Neos 4+**

First of all we add the part called _bodyTag_ to the currents page rendering for your document NodeType . Then inside we add the _attributes.class_.

Then we add a FlowQuery that checks if the current node has any children. If the condition is true then the class “has-subpages” is added to the body tag on all pages that have any children.

```neosfusion
prototype(Vendor.Site:Page) {
    bodyTag {
        attributes.class = ${q(node).children().count() > 1 ? 'has-subpages' : ''}
    }
}
```

If you want to just add a body class for all pages of one document type, that's of course even simpler:

```neosfusion
prototype(Vendor.Site:Page) {
    bodyTag {
        attributes.class = 'my-custom-class'
    }
}
```

**Neos 3**

First of all we add the part called _bodyTag_ to the Fusion _page_ object. Then inside we add the _attributes.class_.

Then we add a FlowQuery that checks if the current node has any children. If the condition is true then the class “has-subpages” is added to the body tag on all pages that have any children.

```neosfusion
page {
    bodyTag {
        attributes.class = ${q(node).children().count() > 1 ? 'has-subpages' : ''}
    }
}
```

An other example could be that we want to check if the current page is of type _Vendor.Site:SomePage_.

Fusion code:

```neosfusion
page {
    bodyTag {
        attributes.class = ${q(node).filter('[instanceof Vendor.Site:SomePage]') != '' ? 'is-page' : ''}
    }
}
```