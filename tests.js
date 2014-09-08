var assert = require("assert");
var ioc = require('./ioc');

describe('Ioc tests: ', function(){
	
	it('It should be able to be resolve', function(){
		ioc.reset();
		var input = { };
		ioc.register('test', input)
		var output = ioc.resolve('test');
		assert.equal(input, output);
	});

	it('It should be able to be resolve2', function(){
		ioc.reset();
		var input = { };
		ioc.register('test', input)
		var output = ioc.resolve('test');
		assert.equal(input, output);
	});

	it('It should throw when registering with an existing name', function(){
		ioc.reset();
		ioc.register('test', { })
		assert.throws( function(){
			ioc.register('test', {});
		}, Error );
	});

	it('It should throw when it cannot resolve', function(){
		ioc.reset();
		
		assert.throws( function(){
			ioc.resolve('unregisteredname', {});
		}, Error );
	});

	it('It should new an object when possible', function(){
		ioc.reset();
		
		var myfunction = function(){
			
			this.property = 'myproperty';
		}

		ioc.register('instance', myfunction);

		var instance = ioc.resolve('instance');

		assert.equal(instance.property, 'myproperty');
	});

	it('It should also inject dependencies into resolved objects', function(){
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

		var resolved = ioc.resolve('mydependency');

		assert.equal(resolved.name, 'mydependency');
		assert.equal(resolved.sub1.name, 'mysubdependency1');
		assert.equal(resolved.sub2.name, 'mysubdependency2');
	});
});







