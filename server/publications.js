Meteor.publish('posts', function() {
	return Posts.find();
});
//This tells Meteor server to publish this particular dbcall Cursor to the client