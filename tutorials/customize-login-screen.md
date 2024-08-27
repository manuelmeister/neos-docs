url: /tutorials/customize-login-screen
# Customize Login Screen

You can customize the login screen by editing your _Settings.yaml_

You can replace the background image or add your own custom styles.

#### Customize the background image

Configuration/Settings.yaml:
```yaml
Neos:
  Neos:
    userInterface:
      backendLoginForm:
        backgroundImage: 'resource://Your.Package/Public/Images/LoginScreen.jpg'
```

#### Customize the css styles

Or alternatively add a custom stylesheet:

Configuration/Settings.yaml:
```yaml
Neos:
  Neos:
    userInterface:
      backendLoginForm:
        stylesheets:
          'Your.Package:CustomStyles': 'resource://Your.Package/Public/Styles/Login.css'
```

> **💡 Note**
> 
> In this case _Your.Package:CustomStyles_ is a simple key, used only internally.

##### How to disable the existing stylesheet?

You can disable existing stylesheets, by setting the value to _FALSE_, the following snippet will disable the stylesheet provided by Neos, so your are free to implement your own:

Configuration/Settings.yaml:
```yaml
Neos:
  Neos:
    userInterface:
      backendLoginForm:
        stylesheets:
          'Neos.Neos:DefaultStyles': false
          'Your.Package:CustomStyles': 'resource://Your.Package/Public/Styles/Login.css'
```