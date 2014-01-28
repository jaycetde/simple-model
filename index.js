var Emitter = require('emitter-context')
  , util = require('util')
  , attachMiddleware = require('attach-middleware')
  , deepEqual = require('deepequal')
;

util.inherits(Model, Emitter);

module.exports = Model;

function Model() {
    
    if (!(this instanceof Model)) return new Model();
    
    Emitter.call(this);
    
    this._attrs = {};
    
}

attachMiddleware(Model.prototype, { runName: '_setMiddleware', useName: 'setMiddleware' });
attachMiddleware(Model.prototype, { runName: '_getMiddleware', useName: 'getMiddleware' });

Model.prototype.set = function (prop, val) {
    
    if (arguments.length === 1 && typeof prop === 'object') {
        for (var p in prop) {
            if (prop.hasOwnProperty(p)) {
                this.set(p, prop[p]);
            }
        }
        return this;
    }
    
    var self = this
      , prev = this.get(prop)
    ;
    
    this._setMiddleware(prop, val, function (err, prop, val) {
        
        // stop if the value is the same
        if (deepEqual(prev, val, true)) return;
        
        self._attrs[prop] = val;
        
        self.emit('change', prop, val, prev);
        self.emit('change ' + prop, val, prev);
        
    });
    
    return this;
};

Model.prototype.get = function (prop) {
    
    var self = this
      , value
      , isSynchronous = false
    ;
    
    this._getMiddleware(prop, undefined, function (err, prop, val) {
        value = typeof val === 'undefined' ? self._attrs[prop] : val;
        isSynchronous = true;
    });
    
    if (!isSynchronous) throw new Error('get middleware must be synchronous');
    
    return value;
    
};

Model.prototype.toJSON = function () {
    return this._attrs;
};