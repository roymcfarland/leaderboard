// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Players = new Mongo.Collection("players");

if (Meteor.isClient) {
  Template.leaderboard.helpers({
    players: function () {
      return Players.find({}, {sort: {score: -1, name: 1}});
    },
    selected_name: function () {
      var player = Players.findOne(Session.get("selected_player"));
      return player && player.name;
    }
  });

  Template.player.helpers({
    selected: function () {
      return Session.equals("selected_player", this._id) ? "selected" : '';
    }
  });

  Template.leaderboard.events({
    'click button.inc': function () {
      Players.update(Session.get("selected_player"), {$inc: {score: 5}});
    }
  });

  Template.leaderboard.events({
    'click button.dcr': function () {
      Players.update(Session.get("selected_player"), {$inc: {score: -5}});
    }
  });

  Template.leaderboard.events({
    'click button.add': function () {
      $('.addForm').show();
    }
  });

  Template.leaderboard.events({
    'click button.rmv': function () {
      Players.remove(Session.get("selected_player"));
    }
  });

  Template.add_player.events({
    'submit .addForm': function (e) {
      e.preventDefault();
      Players.insert({
        name: $('.name_input').val(),
        score: Number($('.points_input').val())
      });
    }
  });

  Template.player.events({
    'click': function () {
      Session.set("selected_player", this._id);
    }
  });
}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Players.find().count() === 0) {
      var names = ["Ada Lovelace",
                   "Grace Hopper",
                   "Marie Curie",
                   "Carl Friedrich Gauss",
                   "Nikola Tesla",
                   "Claude Shannon"];
      for (var i = 0; i < names.length; i++)
        Players.insert({name: names[i], score: Math.floor(Random.fraction()*10)*5});
    }
  });
}
