Template.commentSubmit.events({
	'submit form': function(event, template) {
		event.preventDefault();

		var comment = {
			body: $(event.target).find('[name=body]').val(),
			postId: template.data._id //remember that the commentsubmit is 
			//buried in the Post template, and calling the id field gets it from
			//the post id
		};

		Meteor.call('comment', comment, function(error, commentId) {
			error && Meteor.Errors.throw(error.reason);
		});
	}
});