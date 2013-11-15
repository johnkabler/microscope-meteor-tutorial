//Notice how there is no var in front of Posts
//This is because it will be available to all files, while var would limit its scope
Posts = new Meteor.Collection('posts');

Posts.allow({ 
	//we can define multiple statements for each operation in an allow statement
	//only one of them needs to return true for the operation to go through.  
	update: ownsDocument,
	remove: ownsDocument
});

Posts.deny({
	update: function(userId, post, fieldNames) {
		//only allow editing of the following fields
		// uses the underscore without function
		return (_.without(fieldNames, 'url', 'title').length > 0);
	}
});

Meteor.methods({
	post: function(postAttributes) {
		var user = Meteor.user(),
		postWithSameLink = Posts.findOne({url: postAttributes.url});

		// ensure the user is logged in

		if (!user)
			throw new Meteor.Error(401, "You need to login to post new stories");

		// Make sure the post has a title.  it can't be blank
		if (!postAttributes.title)
			throw new Meteor.Error(422, 'Please fill in a headline');

		// Make sure this isn't a duplicate post or repost
		if (postAttributes.url && postWithSameLink) {
			throw new Meteor.Error(302, 
				'This link has already been posted', 
				postWithSameLink._id);
		}

		// pick out the whitelisted keys
		// This keeps a nefarious client from monkeying around with our db
		var post = _.extend(_.pick(postAttributes, 'url', 'title', 'message'), {
			userId: user._id,
			author: user.username,
			submitted: new Date().getTime(),
			commentsCount: 0
		});

		var postId = Posts.insert(post);

		return postId;
	}
});