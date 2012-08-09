function AssertionBuilder(defaults){

  defaults = defaults || {};

  var that = {
    json: function(vals){ 
      return _.defaults(vals, defaults); 
    },
    prettyPrint: function(vals){
      return JSON.stringify(that.json(vals), null, '  ');
    }
  };
  return that;
}
