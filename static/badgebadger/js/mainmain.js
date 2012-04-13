$(function(){

  var Preview = function(selector, getText){
    var update = function(){
      $(selector).text(getText());
    }
    update();
    return update;
  };
  
  $('#backpackUrl').change(function(){
    var scriptUrl = $('#backpackUrl')[0].value + '/issuer.js';
    $('#issuerScript').attr('src', scriptUrl);
    $.getScript(scriptUrl)
    .done(function(script, textStatus){
      console.log('Done', textStatus);
    })
    .fail(function(jqxhr, settings, exception){
      console.log('Fail', exception);
    });
  });

  var Location = (function(){
    var baseURI = $('<a href="./"></a>')[0].href;

    function uriFromBackpack(){
      var args = Array.prototype.slice.call(arguments);
      var path = '';
      if(args){
        path = '/' + args.join('/'); 
      }
      return $("#baseUrl")[0].value + path;
    }

    var that = {
      baseURI: baseURI,
      assertionUrl: function(path){
        return uriFromBackpack('host', path) 
      },
      assertionUrls: function(){
        var assertionUrls = [];
        var assertions = $('#assertions')[0].value.split(/[\s,]+/);
        assertions.forEach(function(path){
          if(path)
            assertionUrls.push(that.assertionUrl(path)); 
        });
        return assertionUrls;
      },
      staticUrl: function(path){
        return uriFromBackpack(path);
      }
    };
    return that;
  })();

  $("#baseUrl").val(Location.baseURI);

  $('#randPath').click(function(){
    $('#assertionPath')[0].value = randomString(8);
    return false;
  });

  $('#assertions').change(Preview(
    '#preview',
    function(){
      return 'OpenBadges.issue(' + JSON.stringify(Location.assertionUrls(), null, '  ') + ', callback);';
    }
  ));

  var hostedAssertions = (function(){
    var currentData = "LOL I DUNNO";
    return {
      update: function(){
        $.ajax({
          url: Location.baseURI + 'host',
          context: this,
          error: function(req, text, err){
            console.log("Unable to fetch hosted assertions:", text, err)
          },
          success: function(data, text, req){
            currentData = data;
            this.refresh();
          }
        });
      },
      refresh: function(){
        $('#hosted > pre').text(JSON.stringify(currentData, null, '  '));
      }
    };
  }());
  hostedAssertions.update();

  function buildAssertion() {
    var assertion = {         
      "recipient": $('#email')[0].value,
      "badge": {         
        "version": $('#version')[0].value,
        "name": $('#name')[0].value,
        "image": Location.staticUrl('img/badge.png'),
        "description": $('#desc')[0].value,
        "criteria": Location.baseURI,
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

  $('#metadata form').change(Preview(
    '#assertion pre', 
    function(){ 
      return JSON.stringify(buildAssertion(), null, '  '); 
    }
  ));

  $('#assertion form').submit(function(){
    var assertion = buildAssertion();
    var assertionUrl = Location.baseURI + 'host/' + $('#assertionPath')[0].value;
    var stat = $('.status', this);
    stat.removeClass('error success').text("Sending...");
    $.ajax({
      url: assertionUrl,
      data: assertion,
      type: 'POST',
      error: function(req, text, err){
        console.log("ERROR", text, err);
        stat.addClass('error').text("Error!");
      },
      success: function(data, text, req){
        console.log("success", text);
        stat.addClass('success').text("Done!");
        hostedAssertions.update();
      }
    });

    return false;
  });

  $('#issue form').submit(function(){
    try {
      OpenBadges.issue(Location.assertionUrls(), function(errors, successes){
        $('#result').text(JSON.stringify({errors: errors, successes: successes}, null, '  '));
      });
    }
    catch (err) {
      console.log(err.toString());
    }
    return false;
  });
});
