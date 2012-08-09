$(function(){

  module('assertionbuilder.js');

  test('basic build', function(){
    var builder = AssertionBuilder();
    deepEqual(builder.json({ foo: 'bar' }), {foo: 'bar'});
  });

  test('build with defaults', function(){
    var builder = AssertionBuilder({
      hai: '2u',
      inner: {
        a: 'a'
      }
    });
    deepEqual(builder.json({ foo: 'bar' }), {foo: 'bar', hai: '2u', inner: { a: 'a' }});
    deepEqual(builder.json({ inner: { b: 'b' }}), { hai: '2u', inner: { a: 'a', b: 'b' }});
  });

  test('pretty print string', function(){
    var builder = AssertionBuilder();
    var obj = {
      foo: 'bar',
      inner: {
        a: 'b',
        c: 'd'
      }
    }
    equal(builder.prettyPrint(obj), JSON.stringify(obj, null, '  '));
  });
});
