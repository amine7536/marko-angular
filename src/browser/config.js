System.config({
    "baseURL": __dirname + "/",
  "transpiler": "babel",
  "babelOptions": {
    "optional": [
      "runtime"
    ]
  },
  "paths": {
    "*": "*.js",
    "github:*": "jspm_packages/github/*.js",
    "npm:*": "jspm_packages/npm/*.js",
    "bower:*": "jspm_packages/bower/*.js"
  }
});

System.config({
  "map": {
    "angular": "github:angular/bower-angular@1.4.3",
    "angular-route": "github:angular/bower-angular-route@1.4.3",
    "angular-ui-codemirror": "bower:angular-ui-codemirror@0.3.0",
    "angular-ui-layout": "bower:angular-ui-layout@1.0.5",
    "angular-ui-router": "bower:angular-ui-router@0.2.15",
    "babel": "npm:babel-core@5.8.3",
    "babel-runtime": "npm:babel-runtime@5.8.3",
    "codemirror": "bower:codemirror@5.5.0",
    "core-js": "npm:core-js@0.9.18",
    "css": "github:systemjs/plugin-css@0.1.13",
    "github-markdown-css": "bower:github-markdown-css@2.0.9",
    "highlightjs": "github:components/highlightjs@8.6.0",
    "jquery": "github:components/jquery@2.1.4",
    "markdown-it": "bower:markdown-it@4.4.0",
    "markdown-it-footnote": "bower:markdown-it-footnote@1.0.0",
    "raf": "bower:raf@latest",
    "text": "github:systemjs/plugin-text@0.0.2",
    "bower:angular-ui-codemirror@0.3.0": {
      "angular": "bower:angular@1.4.3",
      "codemirror": "bower:codemirror@5.5.0"
    },
    "bower:angular-ui-router@0.2.15": {
      "angular": "bower:angular@1.4.3"
    },
    "bower:codemirror@5.5.0": {
      "css": "github:systemjs/plugin-css@0.1.13"
    },
    "bower:github-markdown-css@2.0.9": {
      "css": "github:systemjs/plugin-css@0.1.13"
    },
    "github:angular/bower-angular-route@1.4.3": {
      "angular": "github:angular/bower-angular@1.4.3"
    },
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "npm:babel-runtime@5.8.3": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:core-js@0.9.18": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    }
  }
});

