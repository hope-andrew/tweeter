(function(){

  $.UsersSearch = function(el) {
    this.$el = $(el);
    this.$input = this.$el.find("input");
    this.$users = this.$el.find(".users");

    this.$input.on("input", this.handleInput.bind(this) );
  };

  $.UsersSearch.prototype = {

    handleInput: function(event) {
      var $field = $(event.currentTarget);
      var message = {query: $field.val()};
      var that = this;
      $.ajax({
        url: "/users/search",
        method: "get",
        data: message,
        dataType: "json",
        success: that.renderResults.bind(that)
      });
    },

    renderResults: function(response) {
      this.$users.html("");
      var $users= this.$users;
      $.each(response,function(index, value){
        var $user = $("<li>");
        $users.append($user);

        $user.append($("<a href='#'>"+value.username+"</a>"));
        var $button = $("<button class='follow-toggle'>");
        $user.append($button);
        $button.followToggle({
          userId: value.id,
          followState: value.followed ? "followed" : "unfollowed"
        });
      });
    }
    // <% follow_state = current_user.follows?(user) ? "followed" : "unfollowed" %>

  };

  $.fn.usersSearch = function () {
    return this.each(function (){
      new $.UsersSearch(this);
    });
  };

  $(function (){
    $("div.users-search").usersSearch();
  });

})();
