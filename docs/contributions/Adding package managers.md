# Adding package managers
_Part of a series on <a href="./Contributions.md">Contributions</a>_

A substantial way to contribute to this software is to create support for more package managers. Despite there only being a fair share of the most popular package managers, contributing any package manager can greatly benefit the project itself and the users of those package maangers who seek to use this software in their unique situation.

## Considerations
Before adding or proposing a package manager, please make some considerations first. Outline the different methods of gathering information from the package manager, utilizing the package manager's full functionality, and whether or not it is even appropriate to support the package manager.

## Adding support
There are a few steps when going about adding support for your package manager.

1. Do your research on the package manager. Learn about ways the program can interface with the package manager for gathering information, utilizing features, and presenting information.
2. Define your package manager within `config.json`. It should be in line with the schema of other package manager definitions. Include metadata such as the name, distributions, and ID.
3. Create your service file which will provide the functions that the software will interact with to gather information from the package manager. It should be located within `/services`, and **must be defined within your package manager definition's service property in ``config.json``**. Following the already existing package definitions is a great way to figure out how to define your package manager.
4. Experiment and debug your package manager service functions, and make sure to add comments documenting how the software interacts with your package manager.