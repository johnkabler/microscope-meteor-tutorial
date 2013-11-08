//Notice how there is no var in front of Posts
//This is because it will be available to all files, while var would limit its scope
Posts = new Meteor.Collection('posts');

//This is a temporary method for allowing inserts.
//We will refine this to something better later.  
//For now this will work

Posts.allow({
	insert: function(userId, doc) {
		//only allow posting if you are logged in;
		return !! userId;
	}
});
