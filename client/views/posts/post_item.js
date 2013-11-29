Template.postItem.helpers({
	ownPost: function() {
		return this.userId == Meteor.userId();
	},

	domain: function() {
		var a = document.createElement('a');
		a.href = this.url;
		return a.hostname;
	},

	upvotedClass: function() {
		var userId = Meteor.userId();
		if (userId && !_.include(this.upvoters, userId)) {
			return 'btn-primary upvoteable';
		} else {
			return 'disabled';
		}
	}
});

Template.postItem.rendered = function() {
	//remember, items can't be moved in the DOM, only deleted and created

	// this means in order to animate, we have to animate the recreated element
	// to move from its former position to its new position on top of another element
	//it has been newly ranked above.

	//Due to Meteor's reactivity, the creation and deletion of a DOM element
	//happens automatically, as soon as data behind the DOM element changes


	// animate from previous position to new position
	var instance = this;
	var rank = instance.data._rank;
	var $this = $(this.firstNode); //this.firstNode is part of template api
	//it accesses the first top level dom node in the current template instance
	var postHeight = 80;
	var newPosition = rank * postHeight;

	// if element has a currentPosition (it's not the first ever render)
	if (typeof(instance.currentPosition) !== 'undefined') {
		var previousPosition = instance.currentPosition;
		// calculate difference between old position and new position,
		// send element there
		var delta = previousPosition - newPosition;
		$this.css("top", delta + "px");
	} else {
		// it's the first ever render, so hide element until the defer kicks off
		$this.addClass("invisible");
	}
	//let it draw in the old position then
	Meteor.defer(function() {
		instance.currentPosition = newPosition;
		// bring element back to its new original position
		$this.css("top", "0px").removeClass("invisible");
	});
};

Template.postItem.events({
	'click .upvoteable': function(event) {
		event.preventDefault();
		Meteor.call('upvote', this._id);
	}
});