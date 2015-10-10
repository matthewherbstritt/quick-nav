# Quick Nav

CSS/HTML templates intended to aid in quickly creating a simple but 
effective responsive navigation in modern browsers. 

Usage
----

This project is still a work in progress so it is
not yet suitable for use in production, however, if you would like to
try it out there is a working example in the `./demos` directory. 


If you have `Node` installed you can view this demo locally by first cloning
this repo and then, from the project root directory, installing 
the dependencies with

````sh
$ npm install
````

Then just run the default gulp task to start the Node server and fire up browser-sync:



````sh
$ gulp
````

Browser Support
----
Tested in the following browsers on Windows 10

* Chrome 45
* Firefox 41
* IE9+
* IE8 (without animations and requires HTML5 and CSS media query shivs)
* Opera 32

Tests
----
To run the integration tests you will need to download the latest 
[selenium standalone
server](http://www.seleniumhq.org/download/) and place 
the `.jar` file in a `/bin` directory in the project root.

Then, start the node server...

````sh
$ node server.js
````

..and run the tests:


````sh
$ npm test
````

The tests have been written using [Nightwatch.js ](http://nightwatchjs.org/).
