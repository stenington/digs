function Digs(options) {
  options = options || {};

  function findRoot() {        
    for (var i = 0; i < document.scripts.length; i++) { 
      var script = document.scripts[i];
      var match = script.src.match(/(.*)\/digs\.js$/);
      if (match)               
        return match[1] + '/'; 
    }
    throw new Error("issuer script not found.");
  }

  function getUrl(base) {
    var pathElements = Array.prototype.slice.call(arguments, 1);
    base = base.substring(base.length-1) === '/' ? base : base + '/';
    return base + pathElements.join('/').replace(/\/+/, '/');
  }

  function getPathUrl(){
    var args = Array.prototype.slice.call(arguments);
    args.unshift(that.baseUrl);
    return getUrl.apply(this, args);
  }

  var that = {

    baseUrl: options.baseUrl || findRoot(),

    save: function(json, path){
      var req = {
        data: json
      };
      if (path) {
        req.url = getPathUrl('dwellers', path);
        req.type = 'PUT';
      }
      else {
        req.url = getPathUrl('dwellers');
        req.type = 'POST';
      }
      return $.ajax(req);
    },

    retrieve: function(path){
      return $.ajax({
        url: getPathUrl('dwellers', path),
        type: 'GET'
      });
    },

    erase: function(path){
      return $.ajax({
        url: getPathUrl('dwellers', path),
        type: 'DELETE'
      });
    },

    list: function(){
      return $.ajax({
        url: getPathUrl('dwellers'),
        type: 'GET'
      });
    }
  };
  return that;
}
