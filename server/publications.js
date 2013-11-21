Meteor.publish('newPosts', function(limit) {
	return Posts.find({}, {sort: {submitted: -1}, limit: limit });
});

Meteor.publish('singlePost', function(id) {
	return id && Posts.find(id);
});
//This tells Meteor server to publish this particular dbcall Cursor to the client
Meteor.publish('comments', function(postId) { //limit
	//the subset of comments published to users
	//who are viewing the post which the comments
	//pertain to
	return Comments.find({ postId: postId });
});

Meteor.publish('notifications', function() {
	return Notifications.find({userId: this.userId});
});