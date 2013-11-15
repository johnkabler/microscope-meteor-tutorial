Meteor.publish('posts', function() {
	return Posts.find();
});
//This tells Meteor server to publish this particular dbcall Cursor to the client
Meteor.publish('comments', function(postId) { //limit
	//the subset of comments published to users
	//who are viewing the post which the comments
	//pertain to
	return Comments.find({ postId: postId });
});