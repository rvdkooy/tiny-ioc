var ioc = function(){
	
	var _this = this;
	var registry = {};
	var singletonRegistry = {};

	this.registerAsSingleton = function(name, subject, options){

		options = options || {};

		if(singletonRegistry[name]){
			throw new Error(name +' is already registered!');
		}
		
		if( typeof(subject) === 'function' ){
			
			singletonRegistry[name] = {
				subject: applyContructorFunction(subject, options),
				options: options
			};
		}
		else{
			singletonRegistry[name] = {
				subject: subject,
				options: options
			};
		}
	};

	this.register = function(name, subject, options){
		
		options = options || {};

		if(registry[name]){
			throw new Error(name +' is already registered!');
		}
		
		registry[name] = {
			subject: subject,
			options: options
		};
	};

	this.resolve = function(arg){

		if(typeof(arg) === 'function'){
			return applyContructorFunction(arg, {});	
		}
		else{
			var result = registry[arg] || singletonRegistry[arg];

			if(!result){
				throw new Error('Cannot resolve anything with the name: ' + arg);
			}

			if( typeof(result.subject) === 'function' ){

				return applyContructorFunction(result.subject, result.options);    		        	
			}
			
			return result.subject;
		}
	};

	this.reset = function(){
		registry = {};
		singletonRegistry = {};
	};

	function getArgumentsFromFunction(fn){
		return fn.toString().match(/\((.*)\)/)[1].split(",");
	}

	function applyContructorFunction(constructorFunction, options) {
	    var arguments = [ ];
		
	    if(!options.ignoreSubDependencies){
	    	var args = getArgumentsFromFunction(constructorFunction);

			for (var i = 0; i < args.length; i++) {
		    			
				if(args[i] !== ''){
					
					arguments.push(_this.resolve(args[i].trim()));
				}
			};
	    }
		
	    var argsArray = [null].concat(arguments);
	    var factoryFunction = constructorFunction.bind.apply(constructorFunction, argsArray);
	    return new factoryFunction();
	}
};

module.exports = new ioc();