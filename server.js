var express = require('express');
var pgp = require('pg-promise')();
var db = pgp('postgres://nkwnjxuiidwrns:b72b4de42f726173c9acee8a85dd10ed1c8dc1a2ab7402a6feebbbccb8b14f85@ec2-54-163-245-44.compute-1.amazonaws.com:5432/d34ii1v5fr4h1e?ssl=true')
var app = express();var bodyPaser = require('body-parser');
app.use(bodyPaser.json());
app.use(bodyPaser.urlencoded({extended: true}));



//app.use(express.static('static'));
app.set('view engine', 'ejs');

app.get('/', function (request, response) {
    response.render('pages/index');
});
app.get('/about', function (request, response) {
    var name = "tanakorn Pitakchaichan";
    var hobbie = ['Music', 'Game', 'Programming'];
    var bdate = '19/05/1997';
    response.render('pages/about', { fullname: name, hobbies: hobbie, bdate: bdate });
});

app.get('/users/:id', function (request, response) {
    var id = request.param('id');
    var sql = 'select * from users';
    if (id){
            sql += ' where id ='+id;
    }
    
    db.any(sql)
        .then(function(data){
            console.log('DATA:'+data);
            response.render('pages/users',{users : data});
            
        })
        .catch(function(data){
                console.log('ERROR:'+console.error);
                
    })

});
app.get('/products/:pid', function (request, response) {
   var pid = request.params.pid;
   var sql = "select * from products where id=" +pid;
   db.any(sql)
    .then(function(data){
        response.render('pages/product_edit',{product: data[0]});
    })
    .catch(function(data){
        console.log('ERROR:'+console.error);
 })
});

app.get('/products', function (request, response) {
    var id = request.param('id');
    var sql = 'select * from products';
    if (id){
            sql += ' where id ='+id;
    }
    db.any(sql)
        .then(function(data){
            console.log('DATA:'+data);
            response.render('pages/products',{products : data});
            
        })
        .catch(function(data){
                console.log('ERROR:'+console.error);
                
    })
    
});


//Update data
app.post('/products/update', function (request, response){
        
        var id = request.body.id;
        var price = request.body.price;
        var title = request.body.title;
        var sql = `update products set title =${title}, price= ${price}  where id = ${id}`;
        console.log('UPDATE:'+sql);
        response.redirect('/products');
        response.send(sql);
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
console.log('App is running on http://localhost:' + port);
});




// console.log('App is running at http://localhost:8080');
// app.listen(8080);
