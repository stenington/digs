
$(function(){

  function buildAssertion() {
    var assertion = {         
      "recipient": $('#email')[0].value,
      "badge": {         
        "version": $('#version')[0].value,
        "name": $('#name')[0].value,
        "image": $.toUrl(Config.hereFromBackpackUrl, 'img', 'badge.png'),
        "description": $('#desc')[0].value,
        "criteria": Config.hereFromBackpackUrl,
        "issuer": {
          // TODO: The 'origin' isn't checked right now,
          // so we will take advantage of this to use an
          // authoritative domain that's good for
          // demo purposes.
          "origin": "http://this.is.fake.org/",
          "name": "BadgeBadger",
          "org": "Experimental Badger Authority",
          "contact": "hai2u@notreal.org"
        }
      }
    };
    return assertion;
  }

  var Config = {
    init: function(){
      $('#backpackUrl').change(function(evt){
        Config.backpackUrl = $('#backpackUrl')[0].value;
        var stat = $.Status(
          $(evt.target).parent('.control-group'),
          ['warning', 'error', 'success']
        );
        stat.warning();
        $('#issuerScript').reloadFrom(Config.backpackUrl)
          .success(function(){ 
            stat.success(); 
          }).fail(function(){ 
            stat.error(); 
          });
      });
      $('#backpackUrl').change();

      $("#baseUrl").val($('<a href="./"></a>')[0].href);
      $('#baseUrl').change(function(){
        Config.hereFromBackpackUrl = $('#baseUrl')[0].value;
      });
      $('#baseUrl').change();
    },
  };
  Config.init();

  var assertionPreview = $.Preview('#assertion pre', function(){ 
    return JSON.stringify(buildAssertion(), null, '  '); 
  });

  $('#metadata form').change(assertionPreview.update);
  $('form #email').change(assertionPreview.update);

  var digs = Digs();

  var hostedAssertionsPrev = $.Preview('#hosted pre', function(write){ 
    digs.list().success(function(data){
      write(JSON.stringify(data, null, '  ')); 
    });
  });

  $('#assertion form').submit(function(){
    var stat = $.Status(
      $('#submit', this),
      {warning: 'btn-warning', success: 'btn-success', error: 'btn-error'}
    );
    stat.warning();
    var id = $('#assertionId')[0].value;
    var save;
    if (id != undefined) {
      save = digs.save(buildAssertion(), id);
    }
    else {
      save = digs.save(buildAssertion());
    }
    save.success(function(){
      stat.success();
    }).error(function(){
      stat.error();
    }).done(function(){
      hostedAssertionsPrev.update();
    });
    return false;
  });

  var callPreview = $.Preview('#preview', function(){ 
    var ids = $('#assertions')[0].value;
    var data = [];
    if (ids) {
      data = ids.split(/[\s,]+/).map(function(id){
        // HACK - maybe Digs should provide it's url?
        return $.toUrl(Config.hereFromBackpackUrl.replace(/\/badgebadger/, ''), 'dwellers', id);
      });
    }
    return 'OpenBadges.issue('  
      + JSON.stringify(data, null, '  ')
      + ', callback);';
  });
  $('#assertions').change(callPreview.update);
  $('#baseUrl').change(callPreview.update);

  $('#issue form').submit(function(){
    // DRY this out
    var ids = $('#assertions')[0].value;
    var data = [];
    if (ids) {
      data = ids.split(/[\s,]+/).map(function(id){
        // HACK - maybe Digs should provide it's url?
        return $.toUrl(Config.hereFromBackpackUrl.replace(/\/badgebadger/, ''), 'dwellers', id);
      });
    }
    OpenBadges.issue(data, function(errors, successes){
      $('#result').text(JSON.stringify({errors: errors, successes: successes}, null, '  '));
    });
    return false;
  });

});
