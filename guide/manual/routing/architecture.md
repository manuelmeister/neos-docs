url: /guide/manual/routing/architecture
# Architecture

Overview about the node routing process and URL generation, with extension points

## Incoming direction: URL to NodeAddress

This is usually simply triggered **once** per request, before the controller starts working.

### Multi-Site and Multiple Content Repository support via SiteDetectionMiddleware

The Dimension Resolving configuration might be site-specific, f.e. one site maps a subdomain to a different language; and another site which wants to use the UriPathSegment.

Additionally, we want to support using different content repositories for different sites, e.g. to have different NodeTypes configured, or differing dimension configuration.

Thus, the frontend routing needs the result of the site detection as input. Site detection is done before the routing; inside the [SiteDetectionMiddleware](https://github.com/neos/neos-development-collection/blob/9.0/Neos.Neos/Classes/FrontendRouting/SiteDetection/SiteDetectionMiddleware.php).

**Feel free to replace the Site Detection with your own custom Middleware (it's very little code).**

The Site Detection is done at every request.

### Custom Dimension Resolving via DimensionResolverInterface

Especially the DimensionSpacePoint matching must be very extensible, because people might want to map domains, subdomains, URL slugs, ... to different dimensions; and maybe even handle every dimension individually.

This is why the [EventSourcedFrontendNodeRoutePartHandler](https://github.com/neos/neos-development-collection/blob/9.0/Neos.Neos/Classes/FrontendRouting/EventSourcedFrontendNodeRoutePartHandler.php) calls the [DelegatingResolver](https://github.com/neos/neos-development-collection/blob/9.0/Neos.Neos/Classes/FrontendRouting/DimensionResolution/DelegatingResolver.php), which calls potentially multiple [DimensionResolverInterfaces](https://github.com/neos/neos-development-collection/blob/9.0/Neos.Neos/Classes/FrontendRouting/DimensionResolution/DimensionResolverInterface.php).

See [Configuring Dimension Resolving](/guide/manual/routing/configuring-dimension-resolving) and Custom DimensionResolvers in PHP for details on how to customize the Dimension Resolving.

Because the Dimension Resolving runs inside the RoutePartHandler, this is all cached (via the Routing Cache).

### Reading the Uri Path Segment and finding the node

This is implemented in [EventSourcedFrontendNodeRoutePartHandler](https://github.com/neos/neos-development-collection/blob/9.0/Neos.Neos/Classes/FrontendRouting/EventSourcedFrontendNodeRoutePartHandler.php), and is not extensible.

### Routing result

The result of the routing call is a [NodeAddress](https://github.com/neos/neos-development-collection/blob/9.0/Neos.Neos/Classes/FrontendRouting/NodeAddress.php), containing:

*   the `WorkspaceName` (which is always **live** in our case)
*   the `ContentStreamId` of the live workspace
*   The `DimensionSpacePoint` we want to see the page in (i.e. in language=de), as resolved by [DimensionResolverInterface](https://github.com/neos/neos-development-collection/blob/9.0/Neos.Neos/Classes/FrontendRouting/DimensionResolution/DimensionResolverInterface.php).
*   The `NodeAggregateId` of the Document Node we want to show, as resolved by [EventSourcedFrontendNodeRoutePartHandler](https://github.com/neos/neos-development-collection/blob/9.0/Neos.Neos/Classes/FrontendRouting/EventSourcedFrontendNodeRoutePartHandler.php)

## Generating links: NodeAddress to URL

First, the URL path is resolved for the Node (by checking the [DocumentUriPathFinder](https://github.com/neos/neos-development-collection/blob/9.0/Neos.Neos/Classes/FrontendRouting/Projection/DocumentUriPathFinder.php) projection).

Then, the [CrossSiteLinkerInterface](https://github.com/neos/neos-development-collection/blob/9.0/Neos.Neos/Classes/FrontendRouting/CrossSiteLinking/CrossSiteLinkerInterface.php) is responsible for adjusting the built URL in case it needs to be generated for a different Site. It is a global singleton, but can be replaced globally if needed, as it is a planned extension point.

Last, the [DimensionResolverInterface](https://github.com/neos/neos-development-collection/blob/9.0/Neos.Neos/Classes/FrontendRouting/DimensionResolution/DimensionResolverInterface.php) **of the target site** is called for adjusting the URL to account for dimensions.