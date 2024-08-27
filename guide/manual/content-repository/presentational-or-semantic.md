url: /guide/manual/content-repository/presentational-or-semantic
# Presenta­tio­nal or Semantic

When and how to split your content

### Once upon a time...

...there was a CMS called Jack. It accepted everything the content editors threw at it. The rich text editor allowed tweaking fonts, colors, sizes and every layout was possible. It was quick and easy and every one loved it. After a while the internet moved along and a new set of displays emerged. Little screens humans could carry with them. The web designs didn't work for them. New technologies emerged to tackle those problems. Reusing the same content on mobile devices was hard. Content and styling were melted together. The content editors started to cry: “It looks bad on my iPhone. The navigation doesn't work and I can't read the text.”

Now, there is no CMS by the name of Jack and the story is fictional. But those problems are real and can be solved by separating content from styling. Something which has been discussed since the advent of CSS. This gains importance as the variety of channels, devices and apps grows.

There is a whole bunch of Content Management Systems that store content in one database field. Those systems allow mixing HTML structure and even Inline-CSS with text. Thus, they violate the separation of concerns.

If all of the above sounds strange to you: Once, the internet was a very dark place where tables were used for styling and content positioning. Websites were not responsive.

### Why should I care?

Well, if you want to do anything meaningful in Neos you need a few NodeTypes. The whole Content Repository contains nested nodes. At least you need a page and a text NodeType. You can't add images or do layouts otherwise. Without NodeTypes, you can't reuse anything.

Take a step back and imagine how your content and channels will evolve over time. Below we describe different strategies for choosing NodeTypes, their names and rendering.

### Presentational Nodes

This is the naive approach and can work well for smaller sites. You simply create node types that describe the visual look of a page. As Nodes are always in a tree structure, a simple page could have a structure like this:

Website with presentational nodes:
```directory
Page
|- Headline
|- Two-Column Layout
   |- Right Column (automatically created from the two-column layout)
   |  |- Image
   |- Right Column (automatically created from the two-column layout)
   |  |- Headline
   |  |- Text
|- Two-Column Layout
   |- Right Column (automatically created from the two-column layout)
   |  |- Image
   |- Right Column (automatically created from the two-column layout)
   |  |- Headline
   |  |- Text 
|- Two-Column Layout
   |- Right Column (automatically created from the two-column layout)
   |  |- Image
   |- Right Column (automatically created from the two-column layout)
   |  |- Headline
   |  |- Text
|- Text
```

As you can see, the page would have a first node of type _Headline_, then three Two-Column-Layouts. This NodeType can have automatically generated child nodes for left and right, where content can be added.

### Semantic Nodes

Semantic nodes describe the meaning and not the looks. So let's imagine the two column layout blocks above would be teaser of the latest blog articles. Then the text below would show the links to all child pages.

A semantic version could look like this:

Website with semantic nodes:
```directory
Page
|- Headline
|- Blog Teaser (property count=3)
|- Navigation
```

Of course for this to work you would need to create a special Document NodeType _BlogArticle_. Then the rendering of _BlogTeaser_ can easily find the latest three and render them.

Of course this is only the tip of the iceberg. Because since we created all blog articles as special document node type, we can then also output the semantic data as RSS feed, JSON, or even GraphQL. And the larger the content repository gets, the more it is important to structure your content in a semantic way.

For a cms-agnostic series on how to model content we can recommend the [Content Modeling Series by Cleve Gibbon](http://www.clevegibbon.com/content-modeling/ "Content Modeling Series").