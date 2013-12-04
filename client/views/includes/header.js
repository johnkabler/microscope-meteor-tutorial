Template.header.helpers({
	activeRouteClass: function(/* route names */) {
		var args = Array.prototype.slice.call(arguments, 0);
		//The above bit of magic is done because 'arguments' isn't an array
		//it is an array like object, and therefore is set to 'this' in the 
		//first argument
		//http://stackoverflow.com/questions/7056925/how-does-array-prototype-slice-call-work
		//above is relevant stack overflow article
		args.pop();

		var active = _.any(args, function(name) {
			return location.pathname === Meteor.Router[name + 'Path']();
		});

		return active && 'active';
	}
});

Template.header.events({
	'click .hnPull': function() {
		//event.preventDefault();
		Meteor.call('getHnArticles');
	}
});