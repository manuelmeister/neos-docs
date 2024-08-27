url: /guide/manual/backend-permissions/concept-deep-dive-custom-roles
# Concept Deep-Dive: Custom Roles

To understand how to create your custom roles and privileges, let's deep dive into the permission concept of Neos and Flow.

Neos and Flow feature quite a sophisticated permission framework, which allows to model many kinds of permission restrictions – however, it comes with a learning curve. On this page, we'll explain all the core concepts in full detail.

## Authentication and Authorization concepts

The **Authentication** part of the diagram below is responsible for deciding _who the user is;_ and the **Authorization** part should decide _what the user can do_.

The **Surrounding Concepts** contain additional concepts which are related.

The diagram below is an extended version of the one shown on the [_Backend Permissions_](/guide/manual/backend-permissions) page. Everything highlighted in **blue** is what you can extend; with the fat-blue parts being the ones which are most often extended.

![](/_Resources/Persistent/1b43a385e91bcd231e6551a5a7617af02ddf3bbd/diagram.svg)

## Authentication

_a.k.a "Who am I?"_

##### User

_a.k.a. a real-world person_

A **User** is a real-world person, known to the system. The user has a first name, last name, etc. The user does not contain any authentication logic.

##### Account

_a.k.a. login credentials for a person_

An **Account** is an authentication method for a user. By default, a user has a single account for backend login; though you can attach multiple accounts to the same user to allow different authentication methods like oAuth, LDAP or proprietary single-signon for a single user.

The account has the **account identifier** like _john.doe_ (which is what the user enters together with a password in the login form).

##### Authentication Provider

_a.k.a. How do I log in?_

Finally, an **Authentication Provider** is the component in the system which does the actual authentication work. It is configured in _Settings.yaml_ as part of the source code.

Neos ships with a [PersistedUsernamePasswordProvider](https://github.com/neos/flow-development-collection/blob/master/Neos.Flow/Classes/Security/Authentication/Provider/PersistedUsernamePasswordProvider.php) called **Neos.Neos:Backend**.

An Account is bound to a specific Authentication Provider. **Usually you create your own authentication provider to implement your custom Login or Single Signon (SSO) logic.**

##### RequestPattern

_a.k.a. In which scope is my login active?_

A set of request patterns can be part of the **Authentication Provider** configuration in _Settings.yaml_. They are used to set the **scope when the authentication provider is active** (usually based on the controllers which are called).

This is used to distinguish between coarse-grained application parts, like in Neos, between the backend login and a frontend login for website visitors.

##### EntryPoint

_a.k.a. What to do in case of missing permissions?_

The EntryPoint is also part of the **Authentication Provider** configuration in _Settings.yaml_. It is used to **specify what should happen in case the user is not logged in when accessing a protected resource** – we usually want to redirect to a login page then.

The EntryPoint is also triggered if the user is logged in, but does not have access to the specific privilege target.

## Authorization

_a.k.a. "What am I allowed to do?"_

##### Role

_a.k.a. a coarse-grained set of permissions._

Roles are the bridge between the **authentication** and the **authorization** parts of the system: Accounts reference roles, and the roles internally contain a set of privilege rules which say "you are granted to do X" of "you are denied to do Y".

A privilege rule references a **Privilege Target** and specifies whether you are allowed (GRANT), or not allowed (DENY) to access this target.

**Roles can inherit from other roles.**

##### PrivilegeTarget

_a.k.a a small part of the system which should be access-restricted_

Privilege Targets specify exactly what part of the system you want to apply restrictions to.

## What are Privilege Targets?

That were a lot of concepts to grasp so far. Let's focus a bit more in detail on a crucial one - the Privilege Target. This will help you to understand the way permissions are applied in Neos (and Flow) in better detail.

#### Cornerstone: Declarative privilege enforcement

In Neos and Flow, we want to ensure that permissions are enforced **everywhere and consistently**.

Of course, you are free to do explicit access checks in your code by calling `$securityContext->hasRole('Your:Role.Here')` or `$privilegeManager->isPrivilegeTargetGranted('Your:PrivilegeTarget.Here')`.

However, you would manually need to ensure that **you place this code in all possible code-paths the user can trigger**. If you forget this at a single code path, this will lead to a security issue.

To ensure that permissions are enforced across all possible code paths, we do two things:

1.  We specify the access check **declaratively** in _Policy.yaml_ (by using Privilege Targets).
2.  We **enforce** all privilege targets in the system on a low level by using Aspect-Oriented Programming (AOP) or Doctrine Query Rewriting.

How does this look in practice? Let's check this out with an example.

#### Specifying a MethodPrivilege

As an example, let's specify a _MethodPrivilege_ to target all `set*()` methods on the `Invoice` model class:

Configuration/Policy.yaml:
```yaml
privilegeTargets:
  // the first level here is the TYPE of the privilege
  'Neos\Flow\Security\Authorization\Privilege\Method\MethodPrivilege':

    // the second level is our desired NAME of the privilegeTarget
    // (must be unique in the whole system)
    'Your.Package:ModifyInvoice':
      matcher: 'method(Your\Package\Domain\Model\Invoice->set.*())'

```

By specifying this privilege target, the system will **automatically instrument your code**, and place an access check in front of every `set*()` method in the Invoice class.

This is done using AOP (Aspect-Oriented Programming) – so the _matcher_ for the _MethodPrivilege_ is using the [AOP Pointcut Expression](https://flowframework.readthedocs.io/en/stable/TheDefinitiveGuide/PartIII/AspectOrientedProgramming.html#pointcut-expressions) syntax.

> **ℹ️ Access to Privilege Targets is DENIED by default**
> 
> Defining a _privilegeTarget_ means that access to the target needs to be explicitely GRANTED, otherwise the user is forbidden to e.g. call the method.  
> **This means, effectively the default behavior is switched by specifying a privilegeTarget:**  
> Without a _privilegeTarget_, a method call is allowed. Conversely, by targeting a method with a _privilegeTarget_, the method call is **DENIED** unless explicitely GRANTED.

#### Referencing the Privilege in a role

In order to grant access to our just specified privilege target `Your.Package:ModifyInvoice`, we need to add a rule to the roles we want to allow access:

Configuration/Policy.yaml:
```yaml
privilegeTargets:
  ...

roles:
  'Neos.Flow:AuthenticatedUser':
    privileges:
      -
        privilegeTarget: 'Your.Package:ModifyInvoice'
        permission: GRANT

```

Now, we created our desired behavior:

*   a logged in user to the system is allowed to modify invoices
*   all other users are not allowed to modify invoices.

#### Different types of PrivilegeTargets

So far, we have seen the _MethodPrivilege_ in action. Now, let's check out some privilege types on nodes:

Configuration/Policy.yaml:
```yaml
privilegeTargets:
  'Neos\ContentRepository\Security\Authorization\Privilege\Node\EditNodePrivilege':
    'YourSite:EditWebsitePart':
      matcher: 'isDescendantNodeOf("c1e528e2-b495-0622-e71c-f826614ef287")'
```

Let's again reconfirm our understanding about what is changing in the system with the above privilege:

*   All nodes below the specified one are now switched to being **non-editable**.
*   We now have to explicitely grant the `YourSite:EditWebsitePart` privilege to again have the behavior as before - where you simply could edit all nodes.

We see that this privilege target has a different kind of `matcher` expression – one which is used to select nodes. This is because we need a different way to target nodes, compared to targeting methods.

**Every Privilege Target type can have a different kind of Matcher expression. The table below summarizes them.**

#### Overview of PrivilegeTargets and their match expressions

| Privilege Target type | expression language in matcher |
| --- | --- |
| MethodPrivilege | AOP Pointcut Expressions - see the Flow manual about AOP for details. |
| EntityPrivilege | Eel expressions with isType, property - see the Flow manual for details |
| Node Privileges |
| ReadNodePrivilege | Eel expressions using isDescendantNodeOf, isAncestorNodeOf, isAncestorOrDescendantNodeOf, nodeIsOfType, isInWorkspace, isInDimensionPreset.Reference is on List of Node Privilege Matchers. |
| EditNodePrivilege |
| NodeTreePrivilege |
| CreateNodePrivilege | Eel expressions using the list above, plus createdNodeIsOfType. |
| ReadNodePropertyPrivilege | Eel expressions using the list above, plus nodePropertyIsIn. |
| EditNodePropertyPrivilege |
| Asset Privileges |
| ReadAssetPrivilege | Eel expressions using titleStartsWith, titleEndsWith, titleContains, hasMediaType, isTagged, isInCollection, isWithoutCollection.Reference is on the List of Asset Privileges. |
| ReadAssetCollectionPrivilege | Eel expressions using isTitled, hasId.Reference is on the List of Asset Privileges. |
| ReadTagPrivilege | Eel expressions using isLabeled, hasId.Reference is on the List of Asset Privileges. |
| Neos Privileges |
| ModulePrivilege | Strings which are module paths (i.e. URLs of the module) |

## GRANT and DENY explained

If a resource (i.e. a method for _MethodPrivilege_, or a Backend Module for _ModulePrivilege_) is covered by a privilege target, **it needs at least one role which GRANTS access to the resource, and no role which DENIES access**. In case no role (for the current account) specifies GRANT or DENY, access is denied by default.

This means if a role DENIES access, this overrules all GRANT statements; no matter if they are in the same role or in other roles which are currently active for the current account.

> **ℹ️ Suggestion: Do not use DENY**
> 
> As long as you do not use DENY statements in your roles, the permission logic is _**purely additive:**_ This means that adding an additional role will never decrease the effective permissions of the user.  
>   
> **This leads to a really predictable permission system – so we suggest you try to avoid DENY statements.**  
>   
> When you start using DENY, you can "cut" something out of the set of allowed Privilege Targets that should _always_ be forbidden.  
>   
> As soon as we use DENY, **the policy is no longer composable**, because a **DENY always "wins"**, no matter what GRANTs are still existing for the privilege target..  
>   
> DENY is meant as an **escape hatch** (last resort), because sometimes you need it to implement very complex rules.

## Limitations

Except for the assignment of roles to users there is no UI for editing security related configuration. Any changes needed have to be made to the policies in `Policy.yaml`.

## Closing Thoughts

We hope you now have a detailed understanding of how the security framework works. We suggest that you check out the [Real-World Examples](/guide/manual/backend-permissions/real-world-examples) next.

The links below contain some more information from the community:

*   [Multi-site access restriction with Neos CMS (Aske Ertmann)](https://blog.ertmann.me/multi-site-access-restriction-with-neos-cms-9d5624126d5b)
*   [Neos.Flow Security Framework reference](https://flowframework.readthedocs.io/en/stable/TheDefinitiveGuide/PartIII/Security.html)

> **ℹ️ Everything written on this page applies to Flow**
> 
> Because the Security framework is a Flow concept, everything written here on this section can be used for plain Flow applications as well – you just have a few less privilege target types.