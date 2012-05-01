var FindRoot = (function(){

  function findRoot() {                                                              
    for (var i = 0; i < document.scripts.length; i++) {                                              
      var script = document.scripts[i];                                                      
      var match = script.src.match(/(.*)\/findroot\.js$/); 
      if (match)                                                                 
        return match[1] + '/';                                                          
      }                                                                       
    throw new Error("issuer script not found.");                                                 
  } 

  var FindRoot = {
    root: findRoot(),
    version: 'versionB'
  };
  return FindRoot;

})();
