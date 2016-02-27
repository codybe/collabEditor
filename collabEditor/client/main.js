Meteor.subscribe("documents");
Meteor.subscribe("editingUsers");
Meteor.subscribe("comments");

Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function() {
  this.render('navbar', {to:"header"});
  this.render('docList', {to:"main"});
});

Router.route('/documents/:_id', function() {
  console.log(this.params._id);
  Session.set("docid",this.params._id);
  this.render('navbar', {to:"header"});
  this.render('docItem', {to:"main"});
});

//////
// Helpers
//////

Template.editor.helpers({
  docid:function(){
    setupCurDoc();
    return Session.get("docid");
  },
  config:function () {
    return function(editor){
      editor.setOption("lineNumbers",true);
      editor.setOption("theme","hopscotch")
      editor.setOption("mode","html");
      editor.on("change", function (cm_editor, info) {
        $("#viewer_iframe").contents().find("html").html(cm_editor.getValue());
        Meteor.call("addEditingUser",Session.get("docid"));

      });
    }
  }
});

Template.editingUsers.helpers({
  users:function(){
    var doc,e_users,users;

    doc = Documents.findOne({_id:Session.get("docid")});
    console.log(doc);

    if (!doc){return;}
    e_users = editingUsers.findOne({docid:doc._id});
    if (!e_users){return;}

    users = new Array();
    var i = 0;
    for(var user_id in e_users.users){
      users[i] = fixObjectKeys(e_users.users[user_id]);
      i++;
    }
    console.log(users);
    return users;
  }
});

Template.navbar.helpers({
  documents:function(){
    return Documents.find();
  }
});

Template.docList.helpers({
  documents:function(){
    return Documents.find();
  },
});

Template.insertCommentForm.helpers({
  docid:function(){
    return Session.get("docid");
  }
});

Template.commentList.helpers({
  comments:function(){
    return comments.find({docid:Session.get("docid")});
  }
});

Template.docMeta.helpers({
  document:function(){
    return Documents.findOne({_id:Session.get("docid")});
  },
  canEdit:function(){
    var doc; 
    doc = Documents.findOne({_id:Session.get("docid")});
    if(doc){
      if(doc.owner == Meteor.userId()){
        return true;
      }
    }
    return false;
  }
});

Template.editableText.helpers({
  userCanEdit:function(doc,Collection){
    var doc = Documents.findOne({_id:Session.get("docid"), owner:Meteor.userId()});
    if(!doc){
      return false;
    }

    return true 
  }
});

///////
// Events
///////

Template.navbar.events({
  "click .js-add-doc":function(event){
    event.preventDefault();
    if(!Meteor.user()){
      alert("You must login");
    }else{
      setTimeout(function(){ 
        Meteor.call("addDoc",function(err,res){
          if(!err){
            Session.set("docid",res);
          }
        }); 
      }, 10);
    }
  },
  "click .js-load-doc":function(event){
    event.preventDefault();
    Session.set("docid",this._id);
  }
});

Template.docMeta.events({
  "click .js-tog-private":function(event){
    var doc;

    doc = {
            _id:Session.get("docid"),
            isPrivate:event.target.checked      
          };
    Meteor.call("updateDocPrivacy",doc);

  }   
});

///////
// Private Functions
///////

function setupCurDoc(){
  var doc;
  if (!Session.get("docid")){
    doc = Documents.findOne();
    if(doc){
      Session.set("docid",doc._id);
    }
  }
}

function fixObjectKeys(obj){
  var newObj = {};
  for (key in obj){
    var key2 = key.replace("-","");
    newObj[key2] = obj[key];
  }
  return newObj;
}
