url: /guide/manual/rendering/menu-fusion-objects
# Menu Fusion Objects

Neos.Neos:MenuItems, BreadcrumbMenuItems and DimensionsMenuItems

On this page, we show Fusion prototypes relevant for **rendering Menus** in Neos. This is useful inside your Page template.

The automatically generated API documentation for all Node Types can be found [in the reference](https://neos.readthedocs.io/en/stable/References/NeosFusionReference.html). There, all properties are specified, wherehas here, we try to focus on common use cases.

[Open the Fusion Reference](https://neos.readthedocs.io/en/stable/References/NeosFusionReference.html)

### Neos.Neos:MenuItems

For rendering a Menu through AFX and Fusion, this usually looks like this (we'll explain it after the example):

```neosfusion
prototype(YourVendor:Component.Organism.Menu) < prototype(Neos.Fusion:Component) {
    // 1
    menuItems = Neos.Neos:MenuItems
 
    renderer = afx`
        <nav>
            <YourVendor:Component.Molecule.MenuLevel menuItems={props.menuItems}/>
        </nav>
    `
}

// 2
prototype(YourVendor:Component.Molecule.MenuLevel) < prototype(Neos.Fusion:Component) {    
    # output from Neos.Neos:MenuItems
    menuItems = null
    renderer = afx`
        <ul>
            <Neos.Fusion:Loop items={props.menuItems}>
                <YourVendor:Component.Atom.MenuItem item={item} />
            </Neos.Fusion:Loop>
        </ul>
    `
}

// 3
prototype(YourVendor:Component.Atom.MenuItem) < prototype(Neos.Fusion:Component) {
    # item from Neos.Neos:MenuItems
    item = null

	// 4
    subMenu = YourVendor:Component.Molecule.MenuLevel {
        @if = ${item.subItems}
        menuItems = ${item.subItems}
    }

    // 5
    renderer = afx`
        <li class={props.liClass}>
            <Neos.Neos:NodeLink node={item.node}>{item.label}</Neos.Neos:NodeLink>
            {props.subMenu}
        </li>
    `
}

```

Let's go through the above code step by step:

*   The Menu is a `Neos.Fusion:Component` which fetches the menu structure through `Neos.Neos:MenuItems`.
*   (1) `Neos.Neos:MenuItems` returns a big recursive array (detailed below), which contains the menu structure. By passing parameters to `Neos.Neos:MenuItems`, you can customize e.g. how many levels are shown.  
    **Here, we see that Fusion objects do not have to return a string, but can return arbitrary data.**
*   (2) Rendering a single menu level is done using a `Neos.Fusion:Component`, which iterates through all menu items of this level (via `Neos.Fusion:Loop`) and renders each menu item.
*   (3) The menu item is rendering the Sub Menu (4), by again delegating to `MenuLevel` and passes on the nested subItems. **This is the recursive call to render the next menu level**.
*   (5) the actual menu item is rendered by passing `item.node` to `Neos.Neos:NodeLink`.

##### Returned Data Structure of Neos.Neos:MenuItems

The return value of Neos.Neos:MenuItems is a PHP array, looking like this:

```php
// Manual
//   - Neos Configuration
// Reference
//   - Fusion Reference <-- This is the currently open page

return [
	[
		"node" => (node of menu item - NodeInterface),
		"state" => "normal",
		"label" => "Manual",
		"menuLevel" => 1,
		"subItems" => [
			[
				"node" => (node of menu item - NodeInterface),
				"state" => "normal",
				"menuLevel" => 2,
				"label" => "Neos Configuration",
				"subItems" => []
			]
		]
	],
	[
		"node" => (node of menu item - NodeInterface),
		"state" => "active",
		"label" => "Reference",
		"menuLevel" => 1,
		"subItems" => [
			[
				"node" => (node of menu item - NodeInterface),
				"state" => "current",
				"menuLevel" => 2,
				"label" => "Fusion Reference",
				"subItems" => []
			]
		]
	]
];
```

Each menu Item has the following properties:

*   `node`: Reference to the NodeInterface of the currently rendered node
*   `state`: State of the menu item, in relation to the currently rendered page. Useful for CSS class rendering of menu items.
    *   `"current"`, if this is the currently rendered page
    *   `"active"`, if the currently rendered page is below this page.
    *   `"normal"` otherwise
*   `label`: The Node's label, as returned by `NodeInterface::getLabel()`
*   `menuLevel`: on which menu level is the currently rendered menu item? (starting from 1)
*   `subItems`: a list of child items, again with the same structure as shown here

By passing in options into `Neos.Neos:MenuItems` (as shown next), you can influence where the menu starts, how many levels it has, etc.

##### Configuration Options for Neos.Neos:MenuItems

The MenuItems configuration options, if explained in a reference-style, might appear a bit confusing. Their naming (like `startingPoint`) and parts of their semantics (f.e. for `entryLevel`) were taken from our TYPO3 legacy. Looking at the Git history, most parts of `MenuItemsImplementation.php` are from the years 2010-2015 - so it's certainly one of the oldest still-running code-areas.

Instead of showing all properties reference-style, we'll rather show the most common examples:

```neosfusion
# Example Structure:
// Manual
//   - Neos Configuration
//   - Node Types explained
// Reference
//   - Fusion Reference
//       - Neos.Fusion
//       - Neos.Neos
//   - Eel Reference

							
// Render the first two levels of the Menu, by default starting from the site.
// ... will output the first two levels from above, so:
// Manual
//   - Neos Configuration
//   - Node Types explained
// Reference
//   - Fusion Reference
//   - Eel Reference
menuItems = Neos.Neos:MenuItems {
	maximumLevels = 2
}


// Only render the second menu level, without children
// If you are on the homepage, will output nothing (root level)
// If you are on the "Reference" page or any subpage, will output:
// - Fusion Reference
// - Eel Reference
menuItems = Neos.Neos:MenuItems {
    entryLevel = 2
    maximumLevels = 1
}


// Only render the children of the currently active page:
menuItems = Neos.Neos:MenuItems {
    // "EntryLevel = 0" means **THE CURRENTLY ACTIVE PAGE**
    entryLevel = 0
    maximumLevels = 1
}

```

### Neos.Neos:BreadcrumbMenuItems

`Neos.Neos:BreadcrumbMenuItems` outputs the "Breadcrumb" or "Rootline" towards the given page, i.e. the path from the root page towards the current page.

You should use `Neos.Neos:BreadcrumbMenuItems` as a data provider inside a `Neos.Fusion:Component` which outputs the breadcrumb menu, as explained above for `Neos.Neos:MenuItems`.

An example will explain this thoroughly:

```neosfusion
# Example Structure:
// Manual
//   - Neos Configuration
//   - Node Types explained
// Reference
//   - Fusion Reference
//       - Neos.Fusion      <---- we are here
//       - Neos.Neos
//   - Eel Reference
```

When the _Neos.Fusion_ page is rendered, `Neos.Neos:BreadcrumbMenuItems` will return the following menu items, in order:

*   _Home_ (not shown in the "example structure" above, the root node - however it is called)
*   _Reference_
*   _Fusion Reference_
*   _Neos.Fusion_ it always ends with the currently selected page.

##### Returned Data Structure of Neos.Neos:BreadcrumbMenuItems

The data structure is the same as explained in `Neos.Neos:MenuItems` above, just the `subItems` are always empty.

##### Configuration Options for Neos.Neos:BreadcrumbMenuItems

`Neos.Neos:BreadcrumbMenuItems` has no configuration options.

### Neos.Neos:DimensionsMenuItems

`Neos.Neos:DimensionsMenuItems` outputs links to different variants of the current page, f.e. to the different languages this page exists in. It is useful to f.e. render a language switcher.

You should use `Neos.Neos:DimensionsMenuItems` as a data provider inside a `Neos.Fusion:Component` which outputs the breadcrumb menu, as explained above for `Neos.Neos:MenuItems`.

##### Configuration Options for Neos.Neos:DimensionsMenuItems

`Neos.Neos:DimensionsMenuItems` has the following configuration options:

*   `renderHiddenInIndex` (default: `true`):  if documents which are hidden in index should be rendered or not
*   `dimension`: name of the dimension to use, if only a single dimension should be shown. If not set, all allowed dimension combinations are rendered.
*   `presets`: List of presets, if the default order should be overridden. Only  used with `dimension` set.
*   `includeAllPresets` (default: `false`): if true, items for all presets will be included, ignoring dimension constraints

The most common configuration is as follows:

```neosfusion
// render all different dimensions
menuItems = Neos.Neos:DimensionsMenuItems

```

The following examples are just relevant if you have **more than one dimension configured** _**(e.g. Language and Country):**_

```neosfusion
// render the different variants in the "language" dimension
menuItems = Neos.Neos:DimensionsMenuItems {
	dimension = "language"
}
```

Cases with other options defined are quite rare.

##### Returned Data Structure of Neos.Neos:DimensionsMenuItems

The data structure is the same as explained in `Neos.Neos:MenuItems` above, just the `subItems` are always empty, and the nodes returned are from different dimensions.

### Legacy Prototypes

##### Neos.Neos:Menu

`Neos.Neos:Menu` is a Fluid-backed component. For new projects, you should not use Fluid anymore to define the menu rendering of your output. **Instead, use** `**Neos.Neos:MenuItems**` **and rendering via** `**Neos.Fusion:Component**` **and AFX.**

##### Neos.Neos:BreadcrumbMenu

`Neos.Neos:BreadcrumbMenu` is a Fluid-backed component. For new projects, you should not use Fluid anymore to define the menu rendering of your output. **Instead, use** `**Neos.Neos:BreadcrumbMenuItems**` **and rendering via** `**Neos.Fusion:Component**` **and AFX.**

##### Neos.Neos:DimensionsMenu

`Neos.Neos:DimensionsMenu` is a Fluid-backed component. For new projects, you should not use Fluid anymore to define the menu rendering of your output. **Instead, use** `**Neos.Neos:DimensionsMenuItems**` **and rendering via** `**Neos.Fusion:Component**` **and AFX.**

##### Neos.Neos:Content

`Neos.Fusion:Content` is a Fluid-backed content component. For new projects, you should not use Fluid anymore to define the frontend rendering of your output. **Instead, use** `**Neos.Neos:ContentComponent**` **and AFX.**