$(function(){

  module('badgebadger.js');

  test('toUrl helper', function(){
    equal($.toUrl('base'), 'http://base/', 'prepends protocol'); 
    equal($.toUrl('base', 'foo'), 'http://base/foo', 'single path element'); 
    equal($.toUrl('base', 'foo', 'bar'), 'http://base/foo/bar', 'multiple path elements'); 
    equal($.toUrl('http://base'), 'http://base/', 'handles base with protocol'); 
    equal($.toUrl('ftp://base'), 'ftp://base/', 'handles other protocols'); 
    equal($.toUrl('http://base', 'foo'), 'http://base/foo', 'base with protocol and path element'); 
    equal($.toUrl('base/', 'foo'), 'http://base/foo', 'slashes not duplicated between base and path');
  });

  test('Status with array arg', function(){
    var el = $('<div></div>');
    var stat = $.Status(el, ['warning', 'error', 'success']);

    stat.warning();
    ok($(el).hasClass('warning'), 'warning set');
    ok(!$(el).hasClass('error'), 'error off');
    ok(!$(el).hasClass('success'), 'success off');

    stat.success();
    ok(!$(el).hasClass('warning'), 'warning off');
    ok(!$(el).hasClass('error'), 'error off');
    ok($(el).hasClass('success'), 'success set');

    stat.error();
    ok(!$(el).hasClass('warning'), 'warning off');
    ok($(el).hasClass('error'), 'error set');
    ok(!$(el).hasClass('success'), 'success off');

    raises(function(){ $(el).setStatusClass('foo'); }, 'unknown status blows up');
  });

  test('Status with map arg', function(){
    var el = $('<div></div>');
    var stat = $.Status(el, {foo: '_foo', bar: '_bar'});

    stat.foo();
    ok($(el).hasClass('_foo'), 'foo set');
    ok(!$(el).hasClass('_bar'), 'bar off');

    stat.bar();
    ok(!$(el).hasClass('_foo'), 'foo off');
    ok($(el).hasClass('_bar'), 'bar set');
  });

  test('Preview return', function(){
    var div = $('<div></div>').appendTo('#qunit-fixture');
    var prev = $.Preview(div, (function(){
      var i = 0;
      return function(){
        return i++;
      }
    })());
    equal(prev.element, div, 'preview element');
    equal($(prev.element).text(), '0', 'initial value is first call to function');
    prev.update(); 
    equal($(prev.element).text(), '1', 'update called function again');
  });

  asyncTest('Preview callback', function(){
    var div = $('<div></div>').appendTo('#qunit-fixture');
    var prev = $.Preview(div, function(draw){ 
      draw('hi'); 
      start();
    });
    equal($(prev.element).text(), 'hi');
  });

  asyncTest('Reload script', function(){
    ok(FindRoot, 'FindRoot script loaded');    
    equal(FindRoot.version, 'versionA', 'versionA loaded');
    ok(FindRoot.root.match(/badgebadger\/test\/versionA/), 'FindRoot saw versionA root');

    var reload = $('script[src*="findroot.js"]').reloadFrom(FindRoot.root.replace('versionA', 'versionB'));
    reload.success(function(){
      start();
      ok(FindRoot, 'FindRoot script still there');    
      equal(FindRoot.version, 'versionB', 'versionB loaded');
      ok(FindRoot.root.match(/badgebadger\/test\/versionB/), 'FindRoot saw versionB root');
    }).fail(function(){
      start();
      ok(false, 'reload failed');
    });
  });

});
