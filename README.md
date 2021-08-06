# I18N

[![forthebadge](http://forthebadge.com/images/badges/built-with-love.svg)](http://forthebadge.com)  [![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](http://forthebadge.com)

I18N is a translation file editor.

## Features

- Import/export CSV and JSON files.
- In18 project allows you to view your files in a tree architecture.
- Progress bar and visual feedbacks.
- Auto translation.

## Get started

The core of the application is in the src/app directory by convention of the Ionic projects.

I invite you to learn about the Angular and Ionic frameworks and to have a good level of JavaScript to understand the project.

### Prerequisite

- Node v12+
- Ionic v5+
- Angular v9+

### Installation

It is necessary to have previously installed [Node.js](https://nodejs.org/en/download/)
Then install the prerequisite npm dependencies with the following commands:
```bash
npm install
cd electron
npm install
```

## Start

### Web
From the project root, enter the following commands:
```bash
ionic serve
```
A browser window should then open automatically on the page: http://localhost:8100/

To export:
```bash
npm run build
```

You will find the build in **www** folder in IN18 main folder.

### Desktop
From the project root, enter the following commands to compile:
```bash
npm run electron
```

To export:
```bash
npm run electron:win
npm run electron:linux
npm run electron:mac
```

You will find the builds in **release-builds** folder in IN18 main folder.

## Made with

* [Ionic](https://ionicframework.com/) - Framework for hybrid application (web, android, IOS, Windows, MacOS and Linux)
* [Angular](https://angular.io/) - Framework front-end
* [Node.js](https://nodejs.org/en/) - Real-time development on local server in JavaScript
* [Electron](https://www.electronjs.org/) - Build desktop application
* [VSCode](https://code.visualstudio.com/) - IDE

## Contribute

If you wish to contribute, you can contact us on the [Blockup Discord Server](https://discord.gg/FUmcynX).

## Versions
List of versions : [Click to view](https://github.com/landry42/IN18/tags)

## Authors

* **Landry** _alias_ [@landry42](https://github.com/landry42)
* **Vincent** _alias_ [@deakcor](https://github.com/deakcor)

Read the list of [contributors](https://github.com/landry42/IN18/contributors) to see who helped the project!


## License

This project is licensed under the "MIT" license - see the [LICENSE.md](LICENSE.md) file for more information.

## Support us

In18's features are totally free so if you want to support our work, here is a donation link.

[Support us](https://liberapay.com/IN18/donate)
