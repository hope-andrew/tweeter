(function(){

  $.TweetCompose = function(el) {
    this.$el = $(el);
    this.$scriptTag = $(".mention-template");
    this.$el.on("submit", this.handleSubmit.bind(this));
    this.$el.find("textarea").on("input", function(event){
      var len = $(event.currentTarget).val().length;
      $(".chars-left").text((140-len));
    });

    this.$el.find(".add-mentioned-user").on("click", this.addMentionedUser.bind(this));

    this.$el.find(".mentioned-users").on("click", ".remove-mentioned-user", this.removeMentionedUser.bind(this));
  };

  $.TweetCompose.prototype = {
    handleSubmit: function(event) {
      event.preventDefault();
      var $tweet = $(event.currentTarget);
      var contents = $tweet.serializeJSON();
      "breakpoint";
      $tweet.find(":input").each(function(index, val){
        $(val).prop("disabled", true);
      });
      var that = this;
      $.ajax({
        url: "/tweets",
        type: "post",
        data: contents,
        dataType: "json",
        success: that.handleSuccess.bind(that)
      });
    },

    clearInput: function(){
      this.$el.find("textarea").val("");
      this.$el.find("select").val(null);
      this.$el.find(".mentioned-users").empty();
    },

    handleSuccess: function(response) {
      this.$el.find(":input").each(function(index, val){
        $(val).prop("disabled", false);
      });
      this.clearInput();
      var tweet = JSON.stringify(response.content);
      var $feed = $(this.$el.data("tweets-ul"));
      $feed.prepend("<li>"+tweet+"</li>");
    },

    addMentionedUser: function(event) {
      var $mentionedUsers = $(".mentioned-users");
      $mentionedUsers.append(this.$scriptTag.html());
    },

    removeMentionedUser: function(event) {
      var $link = $(event.currentTarget);
      $link.parents(".mention-selector").remove();
    }

  };

  $.fn.tweetCompose = function () {
    return this.each(function (){
      new $.TweetCompose(this);
    });
  };

  $(function (){
    $("form.tweet-compose").tweetCompose();
  });

})();
