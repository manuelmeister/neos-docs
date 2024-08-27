url: /guide/manual/performance
# Improving Performance

How you can improve the performance of your production Neos instance

> **ℹ️ Draft**
> 
> This page is not yet fully completed - we are still working on the content here. Expect some rough edges 🙃

There are various tweaks you should apply to Neos, ensuring it runs performantly and smooth - also with bigger sites. This page aims to list them.

#### Suggestions by core team member Sebastian Helzle

Be sure to read [Sebastian's blog post](https://mind-the-seb.de/blog/the-basic-recipe-for-a-fast-neos-cms-website), as it lists many important tips and tweaks:

[Read Sebastian's Blog Post about Performance](https://mind-the-seb.de/blog/the-basic-recipe-for-a-fast-neos-cms-website)

#### How to use strace to find slowness

[This blog post at sandstorm.de](https://sandstorm.de/de/blog/post/debugging-a-slow-neos-backend-in-kubernetes.html) explains how you can use strace to find out causes when a site is slow; and then fix the Content Cache.

[Read this Blog Post about using strace](https://sandstorm.de/de/blog/post/debugging-a-slow-neos-backend-in-kubernetes.html)

#### Daniel's Talk about Large Scale Neos

At Neos Conference 2019, Neos Core Team member Daniel Lienert had a talk about how to improve performance in huge Neos projects. He covers various topics, from optimized packages to certain FlowQuery constructs to improve.

[![Neos Con 2019 | Daniel Lienert: Large Scale Neos](/_Resources/Persistent/d16c95e8b2382129e3ce2b52f0ac67301d06a912/Youtube-psNyW1XyF_k-maxresdefault.jpg)](https://www.youtube.com/watch?v=psNyW1XyF_k)

> **ℹ️ We'll complete this page soon!**
> 
> We'll add more content to this page very soon; if you want to help out get in touch with us on [slack.neos.io](https://slack.neos.io) in #guild-documentation.