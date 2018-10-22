var express = require('express');
var pgp = require('pg-promise')();
var db = pgp(process.env.DATABASE_URL);
// var db = pgp('postgres://yqiuxqgvnmgbzn:ffd692f86d45ffceb269a06492f38f9cb5f8d6c0666b529b2d46770158cb939d@ec2-54-243-147-162.compute-1.amazonaws.com:5432/d28265d8skcf5j?ssl=true')
var app = express();
var bodyPaser = require('body-parser');
var moment = require('moment');
app.use(bodyPaser.json());
app.use(bodyPaser.urlencoded({ extended: true }));



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
app.get('/users', function (request, response) {
    var id = request.param('id');
    var sql = 'select * from users';
    if (id) {
        sql += ' where user_id =' + id + ' ORDER BY user_id ASC';
    }
    db.any(sql + ' ORDER BY user_id ASC')
        .then(function (data) {
            console.log('DATA:' + data);
            response.render('pages/users', { users: data });

        })
        .catch(function (data) {
            console.log('ERROR:' + console.error);

        })

});

app.get('/insert_user', function (request, response) {
    var time = moment().format();
    response.render('pages/insert_user', { time: time});
});
app.post('/users/insert_user', function (request, response) {
   
    var email = request.body.email;
    var password = request.body.password;
    var time = request.body.time;
    var sql = `INSERT INTO "public"."users" (email,password,created_at) VALUES('${email}','${password}','${time}');`;
    db.query(sql)
        .then(function (data) {
            response.redirect('/users')

        })
        .catch(function (data) {
            console.log('ERROR:' + console.error);

        })
});
app.get('/users_delete/:id', function (request, response) {
    var id = request.params.id;
    var sql = 'DELETE FROM users';
    if (id) {
        sql += ' where user_id =' + id;
    }
    db.query(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            response.redirect('/users')

        })
        .catch(function (data) {
            console.log('ERROR:' + console.error);

        })
});
app.post('/users/update', function (request, response) {
    var id = request.body.id;
    var email = request.body.email;
    var password = request.body.password;
    var sql = `update users set email ='${email}',password= '${password}'  where user_id = '${id}'`;
    db.query(sql)
        .then(function (data) {
            response.redirect('/users')

        })
        .catch(function (data) {
            console.log('ERROR:' + console.error);

        })
});
app.get('/users/:id', function (request, response) {
    var id = request.params.id;
    var times = moment().format('MMMM Do YYYY, h:mm:ss a');
    var sql = "select * from users where user_id=" + id;
    db.any(sql)
        .then(function (data) {
            response.render('pages/users_edit', { user: data[0],time: times});
        })
        .catch(function (data) {
            console.log('ERROR:' + console.error);
        })
});


app.get('/products/:pid', function (request, response) {    
    var pid = request.params.pid;
    var times = moment().format('MMMM Do YYYY, h:mm:ss a');
    var sql = "select * from products where product_id=" + pid;
    db.any(sql)
        .then(function (data) {
            response.render('pages/product_edit', { product: data[0],time: times});
        })
        .catch(function (data) {
            console.log('ERROR:' + console.error);
        })
});

app.get('/products', function (request, response) {
    var id = request.param('id');
    var sql = 'select * from products';
    if (id) {
        sql += ' where product_id =' + id + ' ORDER BY product_id ASC';
    }
    db.any(sql + ' ORDER BY product_id ASC')
        .then(function (data) {
            console.log('DATA:' + data);
            response.render('pages/products', { products: data });

        })
        .catch(function (data) {
            console.log('ERROR:' + console.error);

        })

});


//Update data
app.post('/products/update', function (request, response) {
    var id = request.body.id;
    var price = request.body.price;
    var title = request.body.title;
    var sql = `update products set title ='${title}',price= '${price}'  where product_id = '${id}'`;
    db.query(sql)
        .then(function (data) {
            response.redirect('/products')

        })
        .catch(function (data) {
            console.log('ERROR:' + console.error);

        })
});
app.get('/product_delete/:pid', function (request, response) {
    var pid = request.params.pid;
    var sql = 'DELETE FROM products';
    if (pid) {
        sql += ' where product_id =' + pid;
    }
    db.query(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            response.redirect('/products')

        })
        .catch(function (data) {
            console.log('ERROR:' + console.error);

        })
});

app.post('/products/insert', function (request, response) {

    var price = request.body.price;
    var title = request.body.title;
    var time = request.body.time;
    var sql = `INSERT INTO "public"."products" (price,title,created_at) VALUES('${price}','${title}','${time}');`;
    db.query(sql)
        .then(function (data) {
            response.redirect('/products')

        })
        .catch(function (data) {
            console.log('ERROR:' + console.error);

        })
});
app.get('/insert', function (request, response) {
    var time = moment().format('MMMM Do YYYY, h:mm:ss a');
    response.render('pages/insert', { time: time});
});

app.get('/Report_product', function(req, res) {
    var sql ='select products.product_id,products.title,sum(purchase_items.quantity) as quantity,sum(purchase_items.price) as price from products inner join purchase_items on purchase_items.product_id=products.product_id group by products.product_id;select sum(quantity) as squantity,sum(price) as sprice from purchase_items';
    db.multi(sql)
    .then(function  (data) 
    {
 
        // console.log('DATA' + data);
        res.render('pages/Report_product', { product: data[0],sum: data[1]});
    })
    .catch(function (data) 
    {
        console.log('ERROR' + error);
    })
});

app.get('/Report_user', function(req, res) {
    var sql='select purchases.user_id,purchases.name,users.email,sum(purchase_items.price) as price from purchases inner join users on users.user_id=purchases.user_id inner join purchase_items on purchase_items.purchase_id=purchases.purchase_id group by purchases.user_id,purchases.name,users.email order by sum(purchase_items.price) desc LIMIT 25;'
    db.any(sql)
        .then(function (data) 
        {
            // console.log('DATA' + data);
            res.render('pages/Report_user', { user : data });
        })
        .catch(function (data) 
        {
            console.log('ERROR' + error);
        })
});
var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log('App is running on http://localhost:' + port);
});




// console.log('App is running at http://localhost:8080');
// app.listen(8080);
