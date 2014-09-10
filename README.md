tiny-ioc
========

A really simple and lightweight ioc container built in nodejs

#Installation

```
$ npm install tiny-ioc
```

#How to use tiny-ioc

####Basic usage:
You register your dependency in the container with a unique name. If you use the same name twice, tiny-ioc will throw an exception.

```javascript
var ioccontainer = require("tiny-ioc");

var myobject = function() { 
	this.name = "my name is ronald" 
}
ioccontainer.register("name", myobject);

var resolvedobject = ioccontainer.resolve("name");
console.log(resolvedobject.name); ==> outputs: "my name is ronald"

```

####Nested Dependencies:
When resolving objects that have dependencies on other services, tiny-ioc will auto resolve them by default for you by mapping the name of the parameters.

```javascript
var ioccontainer = require("tiny-ioc");

var logger = function() { 
	this.log = function(message) {
		console.log(message);
	} 
}
var myobject = function(logger) { 
	
	this.doSomething = function() {
		logger.log('something happened!'); 	
	}
}

ioccontainer.register("logger", logger);
ioccontainer.register("myobject", myobject);

var resolvedobject = ioccontainer.resolve("myobject");
resolvedobject.doSomething() ==> outputs: "something happened!"

```

####Singletons:
Tiny-ioc can also register your objects as singletons.    
example:

```javascript
var ioccontainer = require("tiny-ioc");

var myobject = function() { 
	this.name = '';
}

ioccontainer.registerAsSingleton("myobject", myobject);

var resolvedobject = ioccontainer.resolve("myobject");
resolvedobject.name = "Ronald";

var secondResolvedObject = ioccontainer.resolve("myobject");
console.log(secondResolvedObject.name'); ==> outputs: "Ronald" 

```

####Resolving dependencies without registration:
If you have an object that has dependencies on other services, you can always let tiny-ioc inject those for you, even if the your object is not registered in the container.

```javascript
var ioccontainer = require("tiny-ioc");

var logger = function() { 
	this.log = function(message) {
		console.log(message);
	} 
}

ioccontainer.register("logger", logger);

var myobject = function(logger) { 
	
	this.doSomething = function() {
		logger.log('something happened!'); 	
	}
}



var myobjectinstance = ioccontainer.resolve(myobject);
resolvedobject.doSomething() ==> outputs: "something happened!"

```

####General
By default tiny-ioc will try to find all nested dependencies of a resolved object and will throw an error if it cannot find one. You can bypass this behavior when registering your object.    
example:

```javascript
var ioccontainer = require("tiny-ioc");

var myobject = function(unknowndependency) { 
	// some inner logic	
}

ioccontainer.register("myobject", myobject, 
	{ ignoreSubDependencies: true });

var myobjectinstance = ioccontainer.resolve("myobject");
==> does not throw.

```

[![Build Status](https://travis-ci.org/rvdkooy/tiny-ioc.svg?branch=master)](https://travis-ci.org/rvdkooy/tiny-ioc)
