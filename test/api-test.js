const PORT = 3000;

// should we use the configured port?
var config = require ('../config.js');

var app = require ('../app.js'),
    assert = require ('assert'),
    APIeasy = require ('api-easy');

app.listen(PORT);

var newId; 

APIeasy.describe('/dwellers')
  .use('localhost', PORT)
  .path('/dwellers')
  .setHeader('Content-Type', 'application/json')
  .discuss('With no dwellers')
    .get().expect(200, {})
    .next()
  .undiscuss()
    .put({'a': {foo: 'bar'}, 'b': {foo: 'baz'}}).expect(200)
    .next()
  .discuss('To verify PUT')
    .get().expect(200, {'a': {foo: 'bar'}, 'b': {foo: 'baz'}})
    .next()
  .undiscuss()
    .post({foo: 'new'}).expect(201).expect('returns id', function(err, req, body){
      newId = JSON.parse(body);
    })
    .next()
  .discuss('To verify POST')
    .get().expect(200).expect('new dweller resides at id', function(err, req, body){
      var got = JSON.parse(body);
      assert.deepEqual(got[newId], {foo: 'new'});
    })
    .next()
  .undiscuss()
    .del().expect(204)
    .next()
  .discuss('To verify DELETE')
    .get().expect(200, {})
  .undiscuss().export(module);

APIeasy.describe('/dwellers/:id')
  .use('localhost', PORT)
  .path('/dwellers/foo')
  .setHeader('Content-Type', 'application/json')
  .discuss('With nothing at /foo')
    .get().expect(404)
    .next()
    .post({foo: 'foo'}).expect(404) // 404 might be wrong here
    .next()
    .put({foo: 'foo'}).expect(201)
    .next()
  .undiscuss()
  .discuss('To verify PUT')
    .get().expect(200, {foo: 'foo'})
    .next()
  .undiscuss()
  .discuss('With something at foo')
    .put({foo: 'notfoo'}).expect(200)
    .next()
  .undiscuss()
  .discuss('To verify PUT')
    .get().expect(200, {foo: 'notfoo'})
    .next()
  .undiscuss()
    .del().expect(204)
    .next()
  .discuss('To verify DELETE')
    .get().expect(404)
  .undiscuss()
.export(module);
