tiny-ioc
========

A really tiny ioc container

#Installation

```
sudo npm install tiny-ioc
```

#How to use tiny-ioc

Basic usage:

```
var ioccontainer = require("tiny-ioc");

var myobject = function(){ this.name = "my name is ronald" }

ioccontainer.register("name", myobject);

var resolvedobject = ioccontainer.resolve("name");

resolvedobject.name outputs: "my name is ronald"

```

[![Build Status](https://travis-ci.org/rvdkooy/tiny-ioc.svg?branch=master)](https://travis-ci.org/rvdkooy/tiny-ioc)