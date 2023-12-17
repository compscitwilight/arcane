# Data styling guide (for package manager services)
This doc provides a styling guide for how information from package managers should be represented whenever requested. Package manager services should return information from the package manager in a compatible way for the renderer code.

## `list_installed_packages() : string[]`
The `list_installed_packages()` method is a very important method to be included within package manager service scripts. This method returns all of the installed packages that the package manager keeps track of.

For formatting data in this method, make sure that they are in accordance with the <a href="./types/IPackage.md">`Package`</a> interface.