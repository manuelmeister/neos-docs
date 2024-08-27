url: /guide/manual/rendering/fluid
# Legacy: Fluid Template Language

Our Classic Template Language

> **💡 For new projects use AFX**
> 
> For new projects we recommend to use AFX, since it's more powerful and the current best practise.

Fluid has several goals in mind:

*   Simplicity
*   Flexibility
*   Extensibility
*   Ease of use

This templating engine should not be bloated, instead, we try to do it “The Zen Way” - you do not need to learn too many things, thus you can concentrate on getting your things done, while the template engine handles everything you do not want to care about.

## What Does it Do?

In many MVC systems, the view currently does not have a lot of functionality. The standard view usually provides a `render` method, and nothing more. That makes it cumbersome to write powerful views, as most designers will not write PHP code.

That is where the Template Engine comes into play: It “lives” inside the View, and is controlled by a special TemplateView which instantiates the Template Parser, resolves the template HTML file, and renders the template afterwards.

Below, you’ll find a snippet of a real-world template displaying a list of blog postings. Use it to check whether you find the template language intuitive:

```markup
{namespace f=Neos\FluidAdaptor\ViewHelpers}
<html>
<head><title>Blog</title></head>
<body>
<h1>Blog Postings</h1>
<f:for each="{postings}" as="posting">
  <h2>{posting.title}</h2>
  <div class="author">{posting.author.name} {posting.author.email}</div>
  <p>
    <f:link.action action="details" arguments="{id : posting.id}">
      {posting.teaser}
    </f:link.action>
  </p>
</f:for>
</body>
</html>
```

*   The _Namespace Import_ makes the `\Neos\FluidAdaptor\ViewHelper` namespace available under the shorthand f.
*   The `<f:for>` essentially corresponds to `foreach ($postings as $posting)` in PHP.
*   With the dot-notation (`{posting.title}` or `{posting.author.name}`), you can traverse objects. In the latter example, the system calls `$posting->getAuthor()->getName()`.
*   The `<f:link.action />` tag is a so-called ViewHelper. It calls arbitrary PHP code, and in this case renders a link to the “details”-Action.

There is a lot more to show, including:

*   Layouts
*   Custom View Helpers
*   Boolean expression syntax

## Basic Concepts

This section describes all basic concepts available. This includes:

*   [Namespaces](#namespaces)
*   [Variables / Object Accessors](#variables-and-object-accessors)
*   [View Helpers](#view-helpers)
*   [Arrays](#arrays)

### Namespaces

Fluid can be extended easily, thus it needs a way to tell where a certain tag is defined. This is done using namespaces, closely following the well-known XML behavior.

Namespaces can be defined in a template in two ways:

**{namespace f=NeosFluidAdaptorViewHelpers}**

This is a non-standard way only understood by Fluid. It links the `f` prefix to the PHP namespace `\Neos\FluidAdaptor\ViewHelpers`.

**<html xmlns:foo=”http://some/unique/namespace”>**

The standard for declaring a namespace in XML. This will link the `foo` prefix to the URI `http://some/unique/namespace` and Fluid can look up the corresponding PHP namespace in your settings (so this is a two-piece configuration). This makes it possible for your XML editor to validate the template files and even use an XSD schema for auto completion.

A namespace linking `f` to `\Neos\FluidAdaptor\ViewHelpers` is imported by default. All other namespaces need to be imported explicitly.

If using the XML namespace syntax the default pattern `http://typo3.org/ns/<php namespace>` is resolved automatically by the Fluid parser. If you use a custom XML namespace URI you need to configure the URI to PHP namespace mapping. The YAML syntax for that is:

```yaml
Neos:
  Fluid:
    namespaces:
      'http://some/unique/namespace': 'My\Php\Namespace'
```

### Variables and Object Accessors

A templating system would be quite pointless if it was not possible to display some external data in the templates. That’s what variables are for.

Suppose you want to output the title of your blog, you could write the following snippet into your controller:

```php
$this->view->assign('blogTitle', $blog->getTitle());
```

Then, you could output the blog title in your template with the following snippet:

```markup
<h1>This blog is called {blogTitle}</h1>
```

Now, you might want to extend the output by the blog author as well. To do this, you could repeat the above steps, but that would be quite inconvenient and hard to read.

> **ℹ️ Note**
> 
> The semantics between the controller and the view should be the following: The controller instructs the view to “render the blog object given to it”, and not to “render the Blog title, and the blog posting 1, …”.  
>  Passing objects to the view instead of simple values is highly encouraged!

That is why the template language has a special syntax for object access. A nicer way of expressing the above is the following:

```php
// This should go into the controller:
$this->view->assign('blog', $blog);
```

```markup
<!-- This should go into the template: -->
<h1>This blog is called {blog.title}, written by {blog.author}</h1>
```

Instead of passing strings to the template, we are passing whole objects around now - which is much nicer to use both from the controller and the view side. To access certain properties of these objects, you can use Object Accessors. By writing `{blog.title}`, the template engine will call a `getTitle()` method on the blog object, if it exists. Besides, you can use that syntax to traverse associative arrays and public properties.

> **💡 Tip**
> 
> Deep nesting is supported: If you want to output the email address of the blog author, then you can use `{blog.author.email}`, which is roughly equivalent to `$blog->getAuthor()->getEmail()`.

### View Helpers

All output logic is placed in View Helpers.

The view helpers are invoked by using XML tags in the template, and are implemented as PHP classes (more on that later).

This concept is best understood with an example:

```markup
{namespace f=Neos\FluidAdaptor\ViewHelpers}
<f:link.action controller="Administration">Administration</f:link.action>
```

The example consists of two parts:

*   _Namespace Declaration_ as explained earlier.
*   _Calling the View Helper_ with the `<f:link.action...> ... </f:link.action>` tag renders a link.

Now, the main difference between Fluid and other templating engines is how the view helpers are implemented: For each view helper, there exists a corresponding PHP class. Let’s see how this works for the example above:

The `<f:link.action />` tag is implemented in the class `\Neos\FluidAdaptor\ViewHelpers\Link\ActionViewHelper`.

> **ℹ️ Note**
> 
> The class name of such a view helper is constructed for a given tag as follows:
> 
> 1.  The first part of the class name is the namespace which was imported (the namespace prefix `f` was expanded to its full namespace `Neos\FluidAdaptor\ViewHelpers`)
> 2.  The unqualified name of the tag, without the prefix, is capitalized (`Link`), and the postfix ViewHelper is appended.

The tag and view helper concept is the core concept of Fluid. All output logic is implemented through such ViewHelpers / tags! Things like `if/else`, `for`, … are all implemented using custom tags - a main difference to other templating languages.

> **ℹ️ Note**
> 
> Some benefits of the class-based approach approach are:
> 
> *   You cannot override already existing view helpers by accident.
> *   It is very easy to write custom view helpers, which live next to the standard view helpers
> *   All user documentation for a view helper can be automatically generated from the annotations and code documentation.

Most view helpers have some parameters. These can be plain strings, just like in`<f:link.action controller="Administration">...</f:link.action>`, but as well arbitrary objects. Parameters of view helpers will just be parsed with the same rules as the rest of the template, thus you can pass arrays or objects as parameters.

This is often used when adding arguments to links:

```markup
<f:link.action controller="Blog" action="show" arguments="{singleBlog: blogObject}">
  ... read more
</f:link.action>
```

Here, the view helper will get a parameter called `arguments` which is of type `array`.

> **ℹ️ Warning**
> 
> Make sure you do not put a space before or after the opening or closing brackets of an array. If you type `arguments="{singleBlog: blogObject}"` (notice the space before the opening curly bracket), the array is automatically casted to a string (as a string concatenation takes place). This also applies when using object accessors: `<f:do.something with="{object}" />` and `<f:do.something with="{object}" />` are substantially different: In the first case, the view helper will receive an object as argument, while in the second case, it will receive a string as argument. This might first seem like a bug, but actually it is just consistent that it works that way.

#### Boolean Expressions

Often, you need some kind of conditions inside your template. For them, you will usually use the `<f:if>` ViewHelper. Now let’s imagine we have a list of blog postings and want to display some additional information for the currently selected blog posting. We assume that the currently selected blog is available in `{currentBlogPosting}`. Now, let’s have a look how this works:

```markup
<f:for each="{blogPosts}" as="post">
  <f:if condition="{post} == {currentBlogPosting}">... some special output here ...</f:if>
</f:for>
```

In the above example, there is a bit of new syntax involved: `{post} == {currentBlogPosting}`. Intuitively, this says “if the post I’‘m currently iterating over is the same as currentBlogPosting, do something.”

Why can we use this boolean expression syntax? Well, because the `IfViewHelper` has registered the argument condition as `boolean`. Thus, the boolean expression syntax is available in all arguments of ViewHelpers which are of type `boolean`.

All boolean expressions have the form `X <comparator> Y`, where:

*   _<comparator>_ is one of the following: `==, >, >=, <, <=, % (modulo)`
*   _X_ and _Y_ are one of the following:
    *   a number (integer or float)
    *   a string (in single or double quotes)
    *   a JSON array
    *   a ViewHelper
    *   an Object Accessor (this is probably the most used example)
    *   inline notation for ViewHelpers

#### Inline Notation for ViewHelpers

In many cases, the tag-based syntax of ViewHelpers is really intuitive, especially when building loops, or forms. However, in other cases, using the tag-based syntax feels a bit awkward – this can be demonstrated best with the `<f:uri.resource>`\- ViewHelper, which is used to reference static files inside the _Public/_ folder of a package. That’s why it is often used inside `<style>` or `<script>`\-tags, leading to the following code:

```markup
<link rel="stylesheet" href="<f:uri.resource path='myCssFile.css' />" />
```

You will notice that this is really difficult to read, as two tags are nested into each other. That’s where the inline notation comes into play: It allows the usage of `{f:uri.resource()}` instead of `<f:uri.resource />`. The above example can be written like the following:

```markup
<link rel="stylesheet" href="{f:uri.resource(path:'myCssFile.css')}" />
```

This is readable much better, and explains the intent of the ViewHelper in a much better way: It is used like a helper function.

The syntax is still more flexible: In real-world templates, you will often find code like the following, formatting a `DateTime` object (stored in `{post.date}` in the example below):

```neosfusion
<f:format.date format="d-m-Y">{post.date}</f:format.date>
```

This can also be re-written using the inline notation:

```markup
{post.date -> f:format.date(format:'d-m-Y')}
```

This is also a lot better readable than the above syntax.

> **💡 Tip**
> 
> This can also be chained indefinitely often, so one can write:  
>   
> `{post.date -> foo:myHelper() -> bar:bla()}` Sometimes you’ll still need to further nest ViewHelpers, that is when the design of the ViewHelper does not allow that chaining or provides further arguments. Have in mind that each argument itself is evaluated as Fluid code, so the following constructs are also possible: 
> 
> {foo: bar, baz: '{planet.manufacturer -> f:someother.helper(test: \\'stuff\\')}'}
> {some: '{f:format.stuff(arg: \\'foo'\\)}'}

To wrap it up: Internally, both syntax variants are handled equally, and every ViewHelper can be called in both ways. However, if the ViewHelper “feels” like a tag, use the tag-based notation, if it “feels” like a helper function, use the Inline Notation.

### Arrays

Some view helpers, like the `SelectViewHelper` (which renders an HTML select dropdown box), need to get associative arrays as arguments (mapping from internal to displayed name). See the following example for how this works:

```markup
<f:form.select options="{edit: 'Edit item', delete: 'Delete item'}" />
```

The array syntax used here is very similar to the JSON object syntax. Thus, the left side of the associative array is used as key without any parsing, and the right side can be either:

*   a number:  
    `{a : 1, b : 2 }`
*   a string; Needs to be in either single- or double quotes. In a double-quoted string, you need to escape the `"` with a `\` in front (and vice versa for single quoted strings). A string is again handled as Fluid Syntax, this is what you see in example `c`:  
    `{`  
      `a : 'Hallo',`  
      `b : "Second string with escaped \" (double quotes) but not escaped ' (single quotes)"`  
      `c : "{firstName} {lastName}"`  
    `}`
*   a boolean, best represented with their integer equivalents:  
    `{a : 'foo', notifySomebody: 1 useLogging: 0 }`
*   a nested array:  
    `{`  
      `a : {`  
        `a1 : "bla1",`  
        `a2 : "bla2"`  
      `},`  
      `b : "hallo"`  
    `}`
*   a variable reference (=an object accessor):  
    `{blogTitle : blog.title, blogObject: blog }`

> **ℹ️ Note**
> 
> All these array examples will result into an associative array. If you have to supply a non-associative, i.e. numerically-indexed array, you’ll write `{0: 'foo', 1: 'bar', 2: 'baz'}`.

## Passing Data to the View

You can pass arbitrary objects to the view, using `$this->view->assign($identifier, $object)` from within the controller. See the above paragraphs about Object Accessors for details how to use the passed data.

## Layouts

In almost all web applications, there are many similarities between each page. Usually, there are common templates or menu structures which will not change for many pages.

To make this possible in Fluid, we created a layout system, which we will introduce in this section.

### Writing a Layout

Every layout is placed in the _Resources/Private/Layouts_ directory, and has the file ending of the current format (by default _.html_). A layout is a normal Fluid template file, except there are some parts where the actual content of the target page should be inserted:

```markup
<html>
<head><title>My fancy web application</title></head>
<body>
<div id="menu">... menu goes here ...</div>
<div id="content">
  <f:render section="content" />
</div>
</body>
</html>
```

With this tag, a section from the target template is rendered.

### Using a Layout

Using a layout involves two steps:

*   Declare which layout to use: `<f:layout name="..." />` can be written anywhere on the page (though we suggest to write it on top, right after the namespace declaration) - the given name references the layout.
*   Provide the content for all sections used by the layout using the `<f:section>...</f:section>`tag: `<f:section name="content">...</f:section>`

For the above layout, a minimal template would look like the following:

```markup
<f:layout name="example.html" />

<f:section name="content">
  This HTML here will be outputted to inside the layout
</f:section>
```

## Further reading

*   [Writing Your Own ViewHelper](/guide/manual/rendering/fluid/custom-viewhelpers)