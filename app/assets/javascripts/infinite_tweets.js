(function(){

  $.InfiniteTweets = function(el) {
    this.$el = $(el);
    $(".fetch-more").on("click", this.fetchMore.bind(this));
    this.maxCreatedAt = null;
    this.fetchTweets();
  };

  $.InfiniteTweets.prototype = {
    fetchMore: function(event){
      this.fetchTweets();
    },

    fetchTweets: function(){
      var that = this;
      var obj = {
        url: "/feed",
        method: "get",
        dataType: "json",
        success: that.insertTweets.bind(that)
      };
      if( this.maxCreatedAt !== null){
        obj.max_created_at = this.maxCreatedAt;
      }
      $.ajax(obj);
    },

    insertTweets: function(response) {
      var $feed = this.$el.find("#feed");
      $.each(response, function(index, tweet) {
        var $li = $("<li>").text(JSON.stringify(tweet));
        $feed.append($li);
      });
      this.maxCreatedAt = response[response.length -1].created_at;
    }
  };

  $.fn.infiniteTweets = function () {
    return this.each(function (){
      new $.InfiniteTweets(this);
    });
  };

  $(function (){
    $("div.infinite-tweets").infiniteTweets();
  });

})();
