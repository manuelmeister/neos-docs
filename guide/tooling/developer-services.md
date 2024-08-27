url: /guide/tooling/developer-services
# Developer Services

## [FusionPen](https://fusionpen.punkt.de/)

FusionPen, created by the team at [Punkt.de,](https://punkt.de/) makes it extremely easy to experiment with and try out smaller and bigger code examples independently from a given project.

You define your Fusion prototypes in FusionPen. The first found prototype is used for rendering - so this way, you can name the prototypes any way you like.

By clicking "share your code", the code is saved in the database and a unique link to the current code state is generated. Changing the code generates new links - this way, you can save different versions.

Additionally, FusionPen supports different CSS frameworks as well.

## [AFX Converter](https://afx-converter.marchenry.de)

Core team member Marc Henry Schulz has built a web application that shows the transpiled fusion of an AFX snippet. This is helpful to diagnose how AFX transpiles to Fusion, and why 'x' wasn't working as expected.

> **⚠️ Note**
> 
> Currently the converter uses the old deprecated RawArray (instead of Fusion:DataStructure) and Array (instead of Neos.Fusion:Join).