Template.postSubmit.events({
	'submit form': function(event) {
		event.preventDefault();

		var post = {
			url: $(event.target).find('[name=url]').val(),
			title: $(event.target).find('[name=title]').val(),
			message: $(event.target).find('[name=message]').val()
		}

		post._id = Posts.insert(post); //the insert() function returns the generated id
		Meteor.Router.to('postPage', post);
	}
});