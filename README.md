# Glsl-pizzabox

glsl-pizzabox is an Emberized version of [Mr. Doob's](https://github.com/mrdoob/) [glsl-sandbox](https://github.com/mrdoob/glsl-sandbox). The main difference is that glsl-pizzabox loads shaders from the server's local filesystem rather than from an in-browser code editor.

The goal glsl-pizzabox is to enable more rapid development of fragment shaders. The idea is that you can run glsl-pizzabox and load shader files from a local directory. When opening glsl-pizzabox in the browser, you can select your shader from a dropdown menu to see how it renders. Then, in your editor of choice, you can update the shader file, which will automatically reload so you can see the results of the change. 

Note there are a couple shaders included with this project. These shaders are examples from the [glsl-sandbox website](http://glslsandbox.com/).

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Installation

* `git clone <repository-url>` this repository
* change into the new directory
* `npm install`
* `bower install`

## Running / Development

* `ember server`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

Specify what it takes to deploy your app.

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](http://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

