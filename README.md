**digs** /dɪgs/<br/>
*n.* Living quarters.<br/>
*v.intr.* Something a badger does.

# What

Digs is an experiment in badge issuing to the [OBI](https://github.com/mozilla/openbadges/wiki) 
standard. It's intended as a **testing/experimentation prototype**, not as an actual badging solution. 

Digs is really two pieces at the moment: a temporary JSON blob storage facility (Digs) and the BadgeBadger app.

## Digs

Digs is a RESTful API with an optional library on top that provides basic CRUD-type operations
for storing arbitrary bits of JSON. 

### Installation

    $ git clone git://github.com/stenington/digs.git
    $ cd digs
    $ npm install
    $ node app.js

Digs will now be running on `localhost:8010`.

### API

<table style="text-align: center;">
<tr style="color: #666;">
  <td></td>
  <td style="padding: 0 50px;">GET</td>
  <td style="padding: 0 50px;">PUT</td>
  <td style="padding: 0 50px;">POST</td>
  <td style="padding: 0 50px;">DELETE</td>
</tr>
<tr style="background-color: #bdb;">
  <td style="text-align: left; font-weight: bold; padding-right: 30px; background-color: #fff;">/dwellers</td>
  <td>List all</td>
  <td>Replace all</td>
  <td>Create new, return id</td>
  <td>Delete all</td>
</tr>
<tr style="background-color: #bdb;">
  <td style="text-align: left; font-weight: bold; padding-right: 30px; background-color: #fff;">/dwellers/:id</td>
  <td>Get json</td>
  <td>Create/replace</td>
  <td style="background-color: #dbb;">X</td>
  <td>Delete</td>
</tr>
</table>

### digs.js

    Include it with:
    <script src="http://_yourhost_/digs.js"></script>

    digs.list().success(function(map){});                  => GET    /dwellers
    digs.save({}).success(function(id){});                 => POST   /dwellers
    digs.save({}, 'someId').success(function(){});         => PUT    /dwellers/someId
    digs.retrieve('someId').success(function(json){});     => GET    /dwellers/someId
    digs.erase('someId').success(function(){});            => DELETE /dwellers/someId

All the `digs.js` functions are thin wrappers around `jQuery.ajax()`, so you can use 
the `.success()`, `.error()`, and `.complete()` methods on the return. 

### Static serving

Digs will also serve anything you drop in the `digs/static/` directory. That's
where BadgeBager lives.

## BadgeBadger

BadgeBadger makes use of Digs to host assertions for a badge issuing test and exploration
platform. Visit `http://localhost:8010/badgebadger/` to get started, the app includes a ton
of explanatory information itself.
