var assert = require("assert");
var ioc = require('./index');

describe('Ioc tests: ', function(){
	
	// ---------------------------
	// General tests
	// ---------------------------
	it('It should be able to be resolve', function(){
		// arrange
		ioc.reset();
		var input = { };
		ioc.register('test', input)
		
		// act
		var output = ioc.resolve('test');
		
		// assert
		assert.equal(input, output);
	});

	it('It should throw when registering with an existing name', function(){
		// arrange
		ioc.reset();
		ioc.register('test', { })
		
		// act & assert
		assert.throws( function(){
			ioc.register('test', {});
		}, Error );
	});

	it('It should throw when it cannot resolve', function(){
		// arrange
		ioc.reset();
		
		// act & assert
		assert.throws( function(){
			ioc.resolve('unregisteredname', {});
		}, Error );
	});

	it('It should new every object which is registered normally', function(){
		// arrange
		ioc.reset();
		
		var myfunction = function(){
			
			this.property = 'myproperty';
		}

		ioc.register('instance', myfunction);

		// act & assert
		var instance = ioc.resolve('instance');
		assert.equal(instance.property, 'myproperty');
		instance.property = 'mypropertychanged';
		var instance2 = ioc.resolve('instance');
		assert.equal(instance2.property, 'myproperty');
	});

	it('It should inject dependencies into the constructor by default', function(){
		// arrange
		ioc.reset();
		
		var mysubdependency1 = function(){
			this.name = "mysubdependency1";
		}
		var mysubdependency2 = function(){
			this.name = "mysubdependency2";
		}

		var mydependency = function(mysubdependency1, mysubdependency2){
			this.name = 'mydependency';
			this.sub1 = mysubdependency1;
			this.sub2 = mysubdependency2;
		}

		ioc.register('mysubdependency1', mysubdependency1);
		ioc.register('mysubdependency2', mysubdependency2);
		ioc.register('mydependency', mydependency);

		// act
		var resolved = ioc.resolve('mydependency');

		// assert
		assert.equal(resolved.name, 'mydependency');
		assert.equal(resolved.sub1.name, 'mysubdependency1');
		assert.equal(resolved.sub2.name, 'mysubdependency2');
	});
	
	it('It should not inject dependencies into the constructor when it is specified to be ignored', function(){
		// arrange
		ioc.reset();
		
		var mydependency = function(unknowndependency){
			this.name = 'mydependency';
		}

		ioc.register('mydependency', mydependency, { ignoreSubDependencies: true });

		// act
		var resolved = ioc.resolve('mydependency');

		// assert
		assert.equal(resolved.name, 'mydependency');
	});

	// ---------------------------
	// Singleton tests
	// ---------------------------
	it('It should return a singleton when a function is registerd as singleton', function(){
		// arrange
		ioc.reset();
		
		var myfunction = function(){
			
			this.property = 'myproperty';
		}

		ioc.registerAsSingleton('instance', myfunction);

		// act % assert
		var instance = ioc.resolve('instance');
		instance.property = 'mypropertychanged';
		var instance2 = ioc.resolve('instance');
		assert.equal(instance2.property, 'mypropertychanged');
	});

	it('It should return a singleton when an object is registerd as singleton', function(){
		// arrange
		ioc.reset();
		
		var myObject = {
			property: 'myproperty'
		}

		ioc.registerAsSingleton('object', myObject);

		// act % assert
		var resolvedObject = ioc.resolve('object');
		resolvedObject.property = 'mypropertychanged';
		var resolvedObject2 = ioc.resolve('object');
		assert.equal(resolvedObject2.property, 'mypropertychanged');
	});

	it('It should throw when registering a singleton with an existing name', function(){
		// arrange
		ioc.reset();
		ioc.registerAsSingleton('test', { })
		
		// act & assert
		assert.throws( function(){
			ioc.registerAsSingleton('test', {});
		}, Error );
	});

	it('It should inject dependencies into the constructor of a singleton by default', function(){
		// arrange
		ioc.reset();
		
		var mysubdependency1 = function(){
			this.name = "mysubdependency1";
		}
		var mysubdependency2 = function(){
			this.name = "mysubdependency2";
		}

		var mydependency = function(mysubdependency1, mysubdependency2){
			this.name = 'mydependency';
			this.sub1 = mysubdependency1;
			this.sub2 = mysubdependency2;
		}

		ioc.register('mysubdependency1', mysubdependency1);
		ioc.register('mysubdependency2', mysubdependency2);
		ioc.registerAsSingleton('mydependency', mydependency);

		// act
		var resolved = ioc.resolve('mydependency');

		// assert
		assert.equal(resolved.name, 'mydependency');
		assert.equal(resolved.sub1.name, 'mysubdependency1');
		assert.equal(resolved.sub2.name, 'mysubdependency2');
	});

	it('It should not inject dependencies into the constructor of a singleton ' +
		'when it is specified to be ignored', function(){
		// arrange
		ioc.reset();
		
		var mydependency = function(unknowndependency){
			this.name = 'mydependency';
		}

		ioc.registerAsSingleton('mydependency', mydependency, { ignoreSubDependencies: true });

		// act
		var resolved = ioc.resolve('mydependency');

		// assert
		assert.equal(resolved.name, 'mydependency');
	});

	// ---------------------------
	// Resolve tests
	// ---------------------------
	it('It should inject dependencies into the constructor when resolving with a function', function(){
		// arrange
		ioc.reset();
		
		var mydependency = function(){
			this.name = 'mydependency';
		}

		var notRegisteredFunc = function(mydependency){
			this.mydependency = mydependency;
		}

		ioc.register('mydependency', mydependency);

		// act
		var resolved = ioc.resolve(notRegisteredFunc);

		// assert
		assert.equal(resolved.mydependency.name, 'mydependency');
	});
});







