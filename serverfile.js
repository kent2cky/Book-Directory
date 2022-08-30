const mysql = require('mysql');
const express = require('express');
const formidable = require('express-formidable');
var fs = require('fs');

const app = express();
app.use(formidable());

const con = mysql.createConnection({
  host: "209.97.131.142",
  user: "chidiogo",
  password: "c#1di0g0",
  database: "book_directory"
});

function handleError(res, errMsg){
  res.render('errors/index', {errMsg});
}

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    });

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page
app.get('/', function(req, res) { 
    console.log('this is req.query', req.query);

    const sql = "select * from books where 1";
    con.query(sql, function (err, books) {
        if (err) {
          handleError(res);
        }else{
          res.render('pages/index', {books});
        }
    }); 
});

// about page
app.get('/books', function(req, res) {
  res.render('pages/books');
});


// about page
app.get('/about', function(req, res) {
  res.render('pages/about');
});

// new-book
app.get('/new-book', function(req, res) {
  res.render('pages/new-book');
});

// new-book
app.post('/new-book', function(req, res) {
  const formData = req.fields;
  const sql = `insert into books (name, author, publish_year) values (${mysql.escape(formData.bookName)}, ${mysql.escape(formData.author)}, ${mysql.escape(formData.publishYear)})`;
  console.log('this is sql', sql);
    con.query(sql, function (err, result) {
        if (err) {
           handleError(res);
        }else{
          console.log("books: " + result);
          res.redirect('/');
        }
         
    }); 
});

// edit-book
app.get('/edit-book', function(req, res) {
    const id = req.query.id;
    const sql = `select * from books where id = ${mysql.escape(id)}`;
  console.log('this is sql', sql);
    con.query(sql, function (err, result) {
        if (err) {
           handleError(res);
        }else{
          const book = result[0];
          console.log("book: ", book);
          res.render('pages/edit-book', {book});
        }
    }); 
});

// new-book
app.post('/edit-book', function(req, res) {
    const formData = req.fields;

  const sql = `update books set 
                name = ${mysql.escape(formData.bookName)}, 
                author = ${mysql.escape(formData.author)}, 
                publish_year = ${mysql.escape(formData.publishYear)}
              where id = ${mysql.escape(formData.id)}`;
    con.query(sql, function (err, result) {
        if (err) {
          console.log('this is error, ',err);
          const errorMsg = err.sqlMessage;
          console.log(errorMsg)

          handleError(res, errorMsg);
        }
        else{
          console.log("books: " + result);
          res.redirect('/'); 
        }
    }); 
});

app.post('/delete-book', function(req, res) {
      const id = req.fields.id;

    const sql = `delete from books where id = ${mysql.escape(id)}`;
  console.log('this is sql', sql);
    con.query(sql, function (err, result) {
        if (err) {
          handleError(res);
        }else{
          res.redirect('/'); 
        }
    }); 
});

// edit-book
app.get('/.well-known/assetlinks.json', function(req, res) {
  
  console.log('we got here');
  var fileName = 'assetlinks.json';  

  fs.readFile(fileName, function(err, data) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(data);
    return res.end();
  });
});

app.get('/deeplink', function(req, res) {
  
  console.log('we got here');
  var fileName = 'deeplink.html';  

  fs.readFile(fileName, function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
});

// // new-book
// app.delete('/new-book', function(req, res) {
//     console.log(req);
//   res.render('pages/new-book');
// });

app.listen(8080);
console.log('Server is listening on port 8080');