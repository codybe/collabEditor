this.Documents = new Mongo.Collection('documents');
editingUsers = new Mongo.Collection('editingUsers');
comments = new Mongo.Collection('comments');

comments.attachSchema(new SimpleSchema({
  title: {
    type: String,
    label: "Title",
    max: 200
  },
  body:{
    type: String,
    label: "Comment",
    max: 1000  	
  },
  docid:{
  	type: String, 
  }, 
  owner:{
  	type: String, 
  }, 
  
}));