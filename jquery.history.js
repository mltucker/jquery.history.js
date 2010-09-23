/**
 * history jQuery plugin
 * Copyright 2010, Mark Tucker
 * Licensed under the MIT
 * http://jquery.org/license
 *
 * Date: Wed Sep 22 20:16:25 CDT 2010
 **/

(function($) {
    var name = "history", initialize, methods;

    initialize = function() {
	this.data('state.history', {
	    undos: [],
	    redos: [],
	    compound: null
	});
    };

    function CompoundMemento() {
	var mementos = [];
	return {
	    add: function(memento) {
		mementos.push(memento);
	    },
	    undo: function() {
		for (var i = mementos.length - 1; i >= 0; i--) {
		    mementos[i].undo();
		}
	    },
	    redo: function() {
		for (var i = 0; i < mementos.length; i++) {
		    mementos[i].redo();
		}
	    }
	};
    }

    methods = {
	remember: function(memento) {
	    var state = this.data('state.history');
	    
	    if (memento.commit) {
		memento.commit();
	    }

	    if (state.compound) {
		state.compound.add(memento);
	    } else {
		state.redos = [];
		state.undos.push(memento);
	    }
	},
	undo: function() {
	    var state = this.data('state.history');
	    if (state.undos.length > 0) {
		var memento = state.undos.pop();
		memento.undo();
		state.redos.push(memento);
	    }
	},
	redo: function() {
	    var state = this.data('state.history');
	    if (state.redos.length > 0) {
		var memento = state.redos.pop();
		memento.redo();
		state.undos.push(memento);
	    }
	},
	undoable: function() {
	    return this.data('state.history').undos.length > 0;
	},
	redoable: function() {
	    return this.data('state.history').redos.length > 0;
	},
	clear: function() {
	    var state = this.data('state.history');
	    state.undos = [];
	    state.redos = [];
	    state.compound = [];
	},
	begin: function() {
	    var state = this.data('state.history');
	    state.compound = new CompoundMemento();
	},
	end: function() {
	    var state = this.data('state.history');
	    state.redos = [];
	    state.undos.push(state.compound);
	    state.compound = null;
	}
    };

    $.fn.history = function(options) {
	var args = Array.prototype.slice.call(arguments, 1);
	
	if (typeof options === 'string') {
	    return methods[options].apply(this, args);
	} else {
	    return initialize.apply(this, options);
	}
    };
})(jQuery);

