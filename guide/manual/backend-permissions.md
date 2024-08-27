url: /guide/manual/backend-permissions
# Backend Permissions

Permissions and Access Management in Neos CMS

## Goal: Restrict editing workflows

A common requirement, especially for larger websites with many editors, is the possibility to selectively control access to certain backend tools and parts of the content. For example so that editors can only edit certain pages or content types or that they are limited to specific workspaces. These access restrictions are used to enforce certain workflows and to reduce complexity for editors.

**On this page, we'll first explain the most important concepts; and explain how the default roles can be used.**

**Then, the biggest part of this chapter is** [**a deep-dive how to create own roles combined with access control lists.**](/guide/manual/backend-permissions/concept-deep-dive-custom-roles)

**Afterwards, we show some** [**real-world examples**](/guide/manual/backend-permissions/real-world-examples)**.**

**We conclude this chapter with reference pages for** [**Node Privileges**](/guide/manual/backend-permissions/node-privileges) **and** [**\-Matchers**](/guide/manual/backend-permissions/list-of-node-privilege-matchers)**,** [**Asset Privileges**](/guide/manual/backend-permissions/asset-privileges) **and** [**Module Privileges**](/guide/manual/backend-permissions/restricting-access-to-backend-modules)**.**

> **ℹ️ Frontend Access Restrictions are not covered here**
> 
> If you want to create a frontend login area for people **visiting** your website, this is not covered here. While this use case builds on the foundations explained here, we'll lateron provide an extra cookbook for this case.

## Users, Accounts and Roles

The following diagram explains the most important concepts and their relationships which you need to understand for using the built-in roles:

![](/_Resources/Persistent/1fd1e706c96856a8f3b2f4ceca6500b36b707761/diagram.svg)

In the diagram above, we focused on **Authorization logic**. To get a full understanding about all the parts involved in the Neos and Flow permission system, read the [_Concept Deep-Dive: Custom Roles_](/guide/manual/backend-permissions/concept-deep-dive-custom-roles) chapter.

##### User

A **User** is a real-world person, known to the system. The user has a first name, last name, etc. The user does not contain any authentication logic.

##### Account

An **Account** is an authentication method for a user. By default, a user has a single account for backend login; though you can attach multiple accounts to the same user to allow different authentication methods like oAuth, LDAP or proprietary single-signon for a single user.

The account has the **account identifier** like _jon.doe_ (which is what the user enters together with a password in the login form).

##### Role

An account references a set of **Roles**, to which permissions are attached. Which roles are available is configured in source code, in a file called _Policy.yaml_. These roles are often called Groups in other systems.

**Roles can inherit from other roles.**

##### Authentication Provider

Finally, an **Authentication Provider** is the component in the system which does the actual authentication work. It is configured in _Settings.yaml_ as part of the source code.

Neos ships with a [PersistedUsernamePasswordProvider](https://github.com/neos/flow-development-collection/blob/master/Neos.Flow/Classes/Security/Authentication/Provider/PersistedUsernamePasswordProvider.php) called **Neos.Neos:Backend**.

An Account is bound to a specific Authentication Provider. **You usually do not need to touch this part if you want to adjust permissions in the Neos backend.**

### Table of contents

*   [Custom Roles and Permissions in detail](/guide/manual/backend-permissions/concept-deep-dive-custom-roles)
*   [Real World Examples](/guide/manual/backend-permissions/real-world-examples)
*   [List of Node Privileges](/guide/manual/backend-permissions/node-privileges)
*   [List of Node Privilege Matchers](/guide/manual/backend-permissions/list-of-node-privilege-matchers)
*   [List of Asset Privileges](/guide/manual/backend-permissions/asset-privileges)
*   [Restricting Access to Backend Modules](/guide/manual/backend-permissions/restricting-access-to-backend-modules)