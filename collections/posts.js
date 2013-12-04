//Notice how there is no var in front of Posts
//This is because it will be available to all files, while var would limit its scope
Posts = new Meteor.Collection('posts');

var request = Meteor.require('request');
var cheerio = Meteor.require('cheerio');
//calling these for scraping purposes


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

	getHnArticles: function() {

		hn_result = Meteor.http.get('http://news.ycombinator.com');
		//console.log(hn_result);
		$ = cheerio.load(hn_result.content);

		var result_set = [];

		$('span.comhead').each(function(i, element){ //for ever <span class='comhead'>, do the following
      		  var a = $(this).prev();
		      var rank = a.parent().parent().text();
		      var title = a.text();
		      var url = a.attr('href');
		      var subtext = a.parent().parent().next().children('.subtext').children();
		      var points = $(subtext).eq(0).text();
		      var username = $(subtext).eq(1).text();
		      var comments = $(subtext).eq(2).text();
      		  //parsed metadata object
      		var metadata = {
        		rank: parseInt(rank),
		        title: title,
		        url: url,
		        points: parseInt(points),
		        username: username,
		        comments: parseInt(comments)
      		};
      	 	result_set.push(metadata);
    	});
    	    //console.log(result_set);

    	for (var i = 0; i<result_set.length; i++) {

    		var hn_post = result_set[i];

    		var postAttributes = {
				url: hn_post.url,
				title: hn_post.title,
				message: 'Scraped automatically from Hacker News'
			};

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
				continue;
			};

			// pick out the whitelisted keys
			// This keeps a nefarious client from monkeying around with our db
			var post = _.extend(_.pick(postAttributes, 'url', 'title', 'message'), {
				userId: user._id,
				author: 'scraped from Hacker News',
				submitted: new Date().getTime(),
				commentsCount: 0, 
				upvoters: [],
				votes: 0
			});

			Posts.insert(post);

		}

			
    },

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
			commentsCount: 0, 
			upvoters: [],
			votes: 0
		});

		var postId = Posts.insert(post);

		return postId;
	},

	

	upvote: function(postId) {
		var user = Meteor.user();
		// ensure the user is logged in
		if (!user) 
			throw new Meteor.Error(401, "You need to login to upvote");

		var post = Posts.findOne(postId);
		if (!post) 
			throw new Meteor.Error(422, 'Post not found');

		Posts.update({
			_id: postId,
			upvoters: {$ne: user._id}
		}, {
			$addToSet: {upvoters: user._id}, 
			$inc: {votes: 1}
		});
	}
});