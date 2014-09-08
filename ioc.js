function applyToConstructor(constructor, argArray) {
    var args = [null].concat(argArray);
    var factoryFunction = constructor.bind.apply(constructor, args);
    return new factoryFunction();
}

var ioc = function(){

	var registry = {};

	this.register = function(name, subject){
		
		if(registry[name]){
			throw new Error(name +' is already registered!');
		}
		
		registry[name] = subject;
	};

	this.resolve = function(name){
		var result = registry[name];

		if(!result){
			throw new Error('Cannot resolve anything with the name: ' + name);
		}

		if( typeof(result) === 'function' ){
			
			var arguments = [ ];
			
			var args = result.toString().match(/\((.*)\)/)[1].split(",");
    
    		for (var i = 0; i < args.length; i++) {
    			
    			if(args[i] !== ''){
    				
    				arguments.push(this.resolve(args[i].trim()));
    			}
    		};

			return applyToConstructor(result, arguments);    		        	
		}
		
		return result;
	};

	this.reset = function(){
		registry = {};
	};
};

module.exports = new ioc();