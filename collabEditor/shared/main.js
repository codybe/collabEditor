//////
// Methods
//////

Meteor.methods({
  addComment:function(comment){
    console.log("addComment method running!");
    if (this.userId){// we have a user
      comment.owner = this.userId;
        return comments.insert(comment);
    }
    return;
  }, 
  addEditingUser:function(docid){
    var doc, user, e_users;
    doc = Documents.findOne({_id:docid});

    if (!doc){return;}
    if (!this.userId){return;}

    user = Meteor.user().profile;
    e_users = editingUsers.findOne({docid:doc._id});
    if (!e_users){
      e_users = {
        docid:doc._id,
        users:{},
      };
    }
    user.lastEdit = new Date();
    e_users.users[this.userId] = user;

    editingUsers.upsert({_id:e_users._id},e_users);
  },
  addDoc:function(){
    var doc;
    if(!this.userId){
      return;
    }
    else{
      doc = {
              owner:this.userId,
              title:"My New Doc",
              createdOn:new Date(),
              isPrivate:false
            };
      return Documents.insert(doc);
    }
  },
  updateDocPrivacy:function(doc){
    var realDoc = Documents.findOne({_id:doc._id, owner:this.userId});
    if(realDoc){
      realDoc.isPrivate = doc.isPrivate;
    }
    Documents.update({_id:doc._id}, realDoc);


  }
})