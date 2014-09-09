var ioc = function(){
	
	var _this = this;
	var registry = {};
	var singletonRegistry = {};

	this.registerAsSingleton = function(name, subject){

		if(singletonRegistry[name]){
			throw new Error(name +' is already registered!');
		}
		
		if( typeof(subject) === 'function' ){
			singletonRegistry[name] = applyContructorFunction(subject);
		}
		else{
			singletonRegistry[name] = subject;
		}
		
	};

	this.register = function(name, subject){
		
		if(registry[name]){
			throw new Error(name +' is already registered!');
		}
		
		registry[name] = subject;
	};

	this.resolve = function(name){
		var result = registry[name] || singletonRegistry[name];

		if(!result){
			throw new Error('Cannot resolve anything with the name: ' + name);
		}

		if( typeof(result) === 'function' ){

			return applyContructorFunction(result);    		        	
		}
		
		return result;
	};

	this.reset = function(){
		registry = {};
	};

	function getArgumentsFromFunction(fn){
		return fn.toString().match(/\((.*)\)/)[1].split(",");
	}

	function applyContructorFunction(constructorFunction) {
	    var arguments = [ ];
				
		var args = getArgumentsFromFunction(constructorFunction);

		for (var i = 0; i < args.length; i++) {
	    			
			if(args[i] !== ''){
				
				arguments.push(_this.resolve(args[i].trim()));
			}
		};

	    var argsArray = [null].concat(arguments);
	    var factoryFunction = constructorFunction.bind.apply(constructorFunction, argsArray);
	    return new factoryFunction();
	}
};

module.exports = new ioc();