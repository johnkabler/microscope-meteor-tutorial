//notice we are adding a global variable
postsHandle = Meteor.subscribeWithPagination('newPosts', 10); //Modified to work with paginated-subscription
//Tell the client to subscribe to the servers published 'posts' Cursor
Meteor.autorun(function() {
	Meteor.subscribe('singlePost', Session.get('currentPostId'));

	Meteor.subscribe('comments', Session.get('currentPostId'));
});

Meteor.subscribe('notifications');

