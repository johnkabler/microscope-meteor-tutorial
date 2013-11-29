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
	// animate from previous position to new position
	var instance = this;
	var rank = instance.data._rank;
	var $this = $(this.firstNode);
	var postHeight = 80;
	var newPosition = rank * postHeight;

	// if element has a currentPosition (it's not the first ever render)
	if (typeof(instance.currentPosition) !== 'undefined') {
		var previousPosition = instance.currentPosition;
		// calculate difference between old position and new position,
		// send element there
		var delta = previousPosition - newPosition;
		$this.css("top", delta + "px");
	}
	//let it draw in the old position then
	Meteor.defer(function() {
		instance.currentPosition = newPosition;
		// bring element back to its new original position
		$this.css("top", "0px");
	});
};

Template.postItem.events({
	'click .upvoteable': function(event) {
		event.preventDefault();
		Meteor.call('upvote', this._id);
	}
});