(function(jQuery){
  var $ = jQuery;

  $.extend({
    toUrl: function(base){
      if (!base)
        throw new Error('toUrl needs a valid base, arguments: [' + Array.prototype.join.call(arguments, ', ') + ']');
      var url = '';
      if(!base.match(/:\/\//)){
        url = 'http://';
      }
      url += base;
      if(url.charAt(url.length-1) != '/') {
        url += '/';
      }
      var pathElements = Array.prototype.slice.call(arguments, 1);
      if(pathElements){
        url += pathElements.join('/');
      }
      return url; 
    },
    Preview: function(el, fn){
      function write(val){
        $(el).text(val);
      }
      var that = {
        element: el,
        update: function(){
          var val = fn(write);
          if (val != undefined) {
            write(val);
          }
        }
      };
      that.update();
      return that;
    },
    Status: function(el, stats){
      if($.isArray(stats)){
        var statsMap = {};
        stats.forEach(function(stat){
          statsMap[stat] = stat;
        });
        stats = statsMap;
      }
      var values = [];
      for (var key in stats){
        values.push(stats[key]);
      }
      var that = {};
      Object.keys(stats).forEach(function(key){
        that[key] = function(){
          $(el).removeClass(values.join(' '));
          $(el).addClass(stats[key]);
        };
      });
      return that;
    },
  
  });

  $.fn.extend({
    reloadFrom: function(url){
      var script = this.attr('src').match(/\/([^\/]+\.js)/)[1];
      var scriptUrl = $.toUrl(url, script);
      this.attr('src', scriptUrl);
      return $.getScript(scriptUrl);
    },
  });

})(jQuery);
