url: /guide/installation-development-setup/ddev-local-beach/all-platforms-using-localbeach-and-docker
# Setup Neos with Local Beach

Local Beach provides a tailor-made Docker-based setup for macOS and Linux.

## What is Local Beach?

Local Beach provides a tailor-made, free development environment for Neos and Flow, based on Docker and Docker Compose.

[Local Beach on Github](https://github.com/flownative/localbeach) [Website](https://www.flownative.com/en/products/localbeach.html)[Documentation](https://www.flownative.com/en/documentation/guides/localbeach/local-beach-setup-docker-based-neos-development-howto.html)

> **ℹ️ Does not work on Windows**
> 
> Local Beach is not yet running on Windows. While the Docker Compose setup in the background would work on Windows, the tooling needs to be adjusted. If you want to help out, get in touch with us at Flownative!

## Step by Step Instructions

### 1\. Install Local Beach & set up project

Local Beach comes with a command line tool that has to be installed first.

Please follow the [getting started guide to install Local Beach](https://www.flownative.com/en/documentation/guides/localbeach/local-beach-setup-docker-based-neos-development-howto.html) to install that tool and set up your project.

### 2\. Start Local Beach

If you followed the instructions above you have probably done this already:

```bash
beach start
```

Now, you are ready to access the Neos instance in your browser with the url output on the command line.

### 3\. Running the Setup Tool

The last step would be to install Neos itself. For this, you can take a look at the instructions for the setup tool.

[Following Guide: Running the Setup Tool](/guide/installation-development-setup/running-the-setup-tool)

_Written by_ **Karsten Dambekalns**