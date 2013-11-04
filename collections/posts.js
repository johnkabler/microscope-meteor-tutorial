//Notice how there is no var in front of Posts
//This is because it will be available to all files, while var would limit its scope
Posts = new Meteor.Collection('posts');
