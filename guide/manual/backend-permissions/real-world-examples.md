url: /guide/manual/backend-permissions/real-world-examples
# Real World Examples

Let's showcase some realistic examples on how to configure permissions in Neos.

Neos provides a way to define Access Control Lists (ACL) in a fine-grained manner, enabling the following use cases:

*   hide parts of the node tree completely (useful for multi-site websites and frontend-login)
*   show only specific Backend Modules
*   allow to create/edit only specific NodeTypes
*   allow to only edit parts of the Node Tree
*   allow to only edit a specific dimension

#### Extend or adjust the existing roles

To adjust permissions for your editors, you can adjust the existing roles (_Neos.Neos:RestrictedEditor_ and Neos._Neos:Editor_ in most cases). If you need different sets of permissions, you will need to define your own custom roles, though.

Those custom roles should inherit from _RestrictedEditor_ or _Editor_ and then grant access to the additional privilege targets you define (see below).

**Now, let's jump into our use cases:**

## Allow editing for specific part of website

## Adjusting and defining roles

As a quick example, a privilege target giving editing access only to a specific part of the website looks as follows:

Configuration/Policy.yaml:
```yaml
privilegeTargets:
  'Neos\ContentRepository\Security\Authorization\Privilege\Node\EditNodePrivilege':
	# This rule ensures we need to explicitely *opt in* all parts of the tree where
	# we want to allow editing.
    'YourSite:EditAll':
      matcher: 'true'

    'YourSite:EditWebsitePart':
      matcher: 'isDescendantNodeOf("c1e528e2-b495-0622-e71c-f826614ef287")'
```

The first PrivilegeTarget `YourSite:EditAll` ensures that every Node is protected by default. Now, you can GRANT the Privilege Target `YourSite:EditWebsitePart` to your editors, and they will only be able to edit this specific website part.

## Limit Editing to a specific language

Here is an example for a privilege target and a role that limit editing to a specific language:

Configuration/Policy.yaml:
```yaml
privilegeTargets:
  'Neos\ContentRepository\Security\Authorization\Privilege\Node\EditNodePrivilege':
    # this privilegeTarget is defined to switch to a "allowlist" approach
    'Vendor.Site:EditAllNodes':
      matcher: 'TRUE'

    'Vendor.Site:EditFinnish':
      matcher: 'isInDimensionPreset("language", "fi")'

roles:
  'Neos.Neos:Editor':
    # the default editor should still be allowed to edit all nodes.
    privileges:
      -
        privilegeTarget: 'Vendor.Site:EditAllNodes'
        permission: GRANT

  # the finnish editor should only be allowed to edit finnish.
  'Vendor.Site:FinnishEditor':
    parentRoles: ['Neos.Neos:RestrictedEditor']
    privileges:
      -
        privilegeTarget: 'Vendor.Site:EditFinnish'
        permission: GRANT
```

## User rights for part of a page tree

Unfortunately, the policy framework of Neos and Flow is sometimes hard to use. Here, we do not only write down a solution for an example task, but want to explain in more detail how it works.

## Solution Steps

The following 4 rules should help us understanding more of the permission topic.

#### Rule 1

**All nodes that are NOT matched by a Privilege Target are allowed.**

Example: 

*   I can call all methods without a _MethodPrivilege_ restricting access.

With method privileges, this can be explained by the implementation: For all methods that are "selected" by a _MethodPrivilege_, Flow code is generated like this:

```php
public function myProtectedFunction() {
     checkUserIsAllowedToCallThisMethod();
     return parent::myProtectedFunction(); // call original function
}
```

For all other methods (having no privilege target), no proxy code is generated, i.e. they are not restricted.

The same applies to nodes

*   **related to nodes, this means that if a node is NOT matched by a node privilege target, access is allowed.**

#### Rule 2

**All nodes matched by a Privilege Target are forbidden,**  
**if no explicit GRANTs or DENIES are given.**

By starting to define a Privilege Target, we change the default from "Allow" to "Prohibit" unless the user has the appropriate role.

As an example:

```yaml
privilegeTargets:
  'Neos\Neos\Security\Authorization\Privilege\EditNodePrivilege':
    'Vendor.Project:AllNodes':
      matcher: 'TRUE'
```

Only this Privilege Target (without role assignment) ensures that NO node can be edited in the system.

#### Rule 3

**Always work with GRANT**

If, for example, I want to make sure that my administrator can still edit all nodes, I have to assign them the `AllNodes` privilege target which was defined above:

```yaml
roles:
  'Vendor.Project:AccessSite2':
    privileges:
      -
        privilegeTarget: 'Vendor.Project:AllNodes'
        permission: GRANT
```

We recommend to not work with DENY, but always with GRANT.

#### Rule 4

**If several Privilege Targets apply to a node, access is permitted**   
**as soon as the user has granted one of these Privilege Targets ...**

... This rule only applies if no DENY is used (see above; composability).

This means - now we are getting closer to the specific use case:

```yaml
privilegeTargets:
  'Neos\ContentRepository\Security\Authorization\Privilege\Node\EditNodePrivilege':
    'Vendor.Project:AllNodes':
      matcher: 'TRUE'
    'Vendor.Project:AccessSite2':
      matcher: 'isDescendantNodeOf("3f0bc644-4a48-11e9-8646-d663bd873d93")'
roles:
  'Vendor.Project:AccessSite2':
    privileges:
      -
        privilegeTarget: 'Vendor.Project:AccessSite2'
        permission: GRANT
  'Neos.Neos:Administrator':
    privileges:
      -
        privilegeTarget: 'Vendor.Project:AllNodes'
        permission: GRANT
```

So what happens here?

*   Due to the AllNodes rule the rights for all nodes have to be set explicitly.
*   If I have the Administrator role, I have a right for all nodes.
*   **If I have the AccessSite2 role, everything is forbidden for me (due to the AllNodes rule) except the subtree defined by AccessSite2 - these nodes are allowed.**