Template.postSubmit.events({
	'submit form': function(event) {
		event.preventDefault();

		var post = {
			url: $(event.target).find('[name=url]').val(),
			title: $(event.target).find('[name=title]').val(),
			message: $(event.target).find('[name=message]').val()
		}

		Meteor.call('post', post, function(error, id) { //The first argument to 
			//Meteor.call is the name of the custom Method we are making in
			// the posts.js file
			if (error) {
				throwError(error.reason);

				if(error.error === 302)
					Meteor.Router.to('postPage', error.details)
			} else { 
				Meteor.Router.to('postPage', id);
			}

		});
		
	}
});