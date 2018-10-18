var express = require('express');
var pgp = require('pg-promise')();
var db = pgp(process.env.DATABASE_URL);
// var db = pgp('postgres://yqiuxqgvnmgbzn:ffd692f86d45ffceb269a06492f38f9cb5f8d6c0666b529b2d46770158cb939d@ec2-54-243-147-162.compute-1.amazonaws.com:5432/d28265d8skcf5j?ssl=true')
var app = express();
var bodyPaser = require('body-parser');
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
        var sql = `update products set title ='${title}',price= '${price}'  where id = '${id}'`;
        db.query(sql)
        .then(function(data){
            response.redirect('/products')
            
        })
        .catch(function(data){
                console.log('ERROR:'+console.error);
                
    })
});
app.get('/product_delete/:pid', function (request, response) {
    var id = request.param('id');
    var sql = 'delete from products';
    if (id){
            sql += ' where id ='+ id;
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
 

var port = process.env.PORT || 8080;
app.listen(port, function() {
console.log('App is running on http://localhost:' + port);
});




// console.log('App is running at http://localhost:8080');
// app.listen(8080);
