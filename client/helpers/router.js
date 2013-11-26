Meteor.Router.add({
	'/' : {to: 'bestPosts', as: 'home'},

	'/best': 'bestPosts',

	'/new': 'newPosts',

	'/posts/:_id': {
		to: 'postPage', 
		and: function(id) { Session.set('currentPostId', id); } 
		//In Meteor, the Session is the global store of state in the browser.
		//The Session variable lives on the client and keeps track of 
		//where the user is.  Even maintains state during hot code reloads.  
	},

	'/posts/:_id/edit': {
		to: 'postEdit',
		and: function(id) { Session.set('currentPostId', id); }
	},

	'/submit': 'postSubmit'
});
//By default the name of the route here is "postsList"
//This allows us to start using convenience functions from the Router package
//Check the navbar href which takes postsListPath to bring us back to /

Meteor.Router.filters({
	'requireLogin': function(page) {
		if (Meteor.user())
			return page;
		else if (Meteor.loggingIn())
			return 'loading';
		else 
			return 'accessDenied';
	}, 
	'clearErrors': function(page) {
		Meteor.Errors.clear();
		return page;
	}
});

Meteor.Router.filter('requireLogin', {only: 'postSubmit'});
Meteor.Router.filter('clearErrors');