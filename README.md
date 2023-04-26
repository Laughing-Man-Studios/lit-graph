# lit-graph
A Lit Framework component for making 2D graphs

## Setup
To start developing with the Lit-Graph repo, run the following commands to install the necessary dependencies for running the project.
```
npm install
```

## Running The Development Server
Run the following commands to run a local web server with a demo with Lit-Graph populated by some mock data. This will automatically open a new tab in your web browser to the url http://localhost:8000 and serve up the `index.html` file in the **dev/** folder.

```
npm run serve
```

## Running The Test Suite
Before running the tests, be sure to follow the [setup](#setup) instructions.

### Headless - Single Run
To run the tests only once in headless mode, run the following commands:
```
npm run test
```

### Headless - Watch
To run the tests in headless mode everytime a TypeScript file changes in the src folder, fun the following commands:
```
npm run test:watch
```
This is useful when writing tests.

### Browser - Watch
Follow the same instructions for [headless - watch](#headless---watch) and when the menu shows up in your terminal, press **M** to start a local dev server and follow the url to open the test page in your browser. You can then use the browser dev tools to debug tests.

## More Information
Please take a look at the project [wiki](https://github.com/Laughing-Man-Studios/lit-graph/wiki) for more information on the project architecture, roadmap, and release procedures.

