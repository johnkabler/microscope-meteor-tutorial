Meteor.subscribe('posts');
//Tell the client to subscribe to the servers published 'posts' Cursor
Meteor.autorun(function() {
	Meteor.subscribe('comments', Session.get('currentPostId'));
});

Meteor.subscribe('notifications');

