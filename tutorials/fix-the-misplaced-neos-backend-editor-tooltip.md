url: /tutorials/fix-the-misplaced-neos-backend-editor-tooltip
# Fix the misplaced Neos Backend Editor Tooltip

When the Tooltip starts to be everywhere but not where you want it to be

**TL;DR:** Setting the html-element to 100% height will result in a misplaced tooltip, remove the line. When you need 100% height, apply it only to the body, NOT the HTML tag.

Lately we got access to a Neos project and were asked to fix a bug where the friendly little tooltip in die Neos Backend Editor was misbehaving. For a lot of nodes on the page it was located at the wrong position. It seamed like it wanted to stay at the top of the page and not follow as the user scrolled down and edited the nodes farther down the page.

![missplaced-neos-editor-tooltip](/_Resources/Persistent/48fcbe051eb1736659c165a7d1e6619947850293/Screenshot%202021-10-13%20at%2011.27.00.png)

The tooltip is placed way to far top

After a long deep-dive into the CSS code of the page we finally found the root of the problem:

```css
html, body {
	padding:0;
	margin: 0;
	width: 100%;
	height: 100%;
}
```

This looked fine at first glance, but after some A-B-Testing we figured out, that the 100% height responsible for the problem. Removing the single line fixed the problem!

### ... but why?

When you set the height of the HTML-element to 100% it will equal the height of your viewport, even when the content is longer. Like shown in this screenshot:

![](/_Resources/Persistent/7ffcbfe8ec222ef64e7d816a705a08d1410dfcf9/html-element-smaller-than-page-1920x1842.png)

The Neos UI uses the JavaScript-DOM function getBoundingClientRect to check where the clicked node on the page is located to place the tooltip right there. This function will return the max possible value given by the parents, which in this case is limited. So the tooltip will be placed further upwards.