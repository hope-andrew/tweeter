(function(){

  $.FollowToggle = function(el, options) {
    this.$el = $(el);
    this.userId = this.$el.attr("data-user-id") || options.userId;
    this.followState = this.$el.attr("data-initial-follow-state") || options.followState;
    this.render();
    this.$el.on('click', this.handleClick.bind(this));
  };

  $.FollowToggle.prototype = {
    render: function() {
      if(this.followState === "followed") {
        this.$el.text("Unfollow!");
        this.$el.prop("disabled", false);
      } else if( this.followState === "unfollowed") {
        this.$el.text("Follow!");
        this.$el.prop("disabled", false);
      } else {
        this.$el.prop("disabled", true);
      }
    },

    handleClick: function(event){
      event.preventDefault();
      var that = this;
      if(this.followState === "unfollowed") {
        this.followState = "following";
        this.render();
        $.ajax({
          url: "/users/"+this.userId+"/follow",
          method: "post",
          dataType: "json",
          success: function(response){
            that.followState = "followed";
            that.render();
          }
        });
      } else if(this.followState === "followed") {
        this.followState = "unfollowing";
        this.render();
        $.ajax({
          url: "/users/"+this.userId+"/follow",
          method: "delete",
          dataType: "json",
          success: function(response){
            that.followState = "unfollowed";
            that.render();
          }
        });
      }
    }
  };

  $.fn.followToggle = function (options) {
    return this.each(function (){
      new $.FollowToggle(this, options);
    });
  };

  $(function (){
    $("button.follow-toggle").followToggle();
  });

})();
