'use strict';

// кеш кат и товар. рефакт. токен в хедер. добавить пут метод для эдд товар. доабвить коды ошибок 
let port = process.env.PORT || 3000;

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
var bodyParserJson = bodyParser.json();
const fs = require('fs');


// const catalog = require('../data/categories');
// const goods = require('../data/goods');
// const users = require('../data/users');
// const usersCart = require('../data/usersCart');




// function getCategoryById(id) {
//   const result = catalog.categories.filter(item => {
//     return item.id === +id;
//   });
//   return result;
// };


// function getGoodsFromSpecificCategory(categoryId) {
//   const result = goods.filter(item => {
//     return item.categoryId === +categoryId;
//   });
//   return result;
// };

// function getItemById(categoryId, itemId) {
//   const result = goods.filter(item => {
//     return item.categoryId === +categoryId && item.id === +itemId;
//   });
//   return result;
// };

////////////////////////////////////////////////////////////////////

function dataBaseQuery(req, res, qyeryToDataBase) {
  var mysql = require('mysql');
  var connection = mysql.createConnection({
  host: '127.0.0.1',
  port: '3306',
  user: 'root',
  password: 'somepassword',
  database : 'onlineshop'});
  try {
    connection.connect(function(err) {
      if (err) throw err;
      console.log("error connection to database");
    });
    var response = res;
  
  connection.query (qyeryToDataBase, function(error, result, fields) {
    if(error)            
    {
        return;
    } else {
      response.send(JSON.stringify(result))
    };
  
  });
  } catch(exception) {
    console.log(exception);
  } finally {
    connection.close;
  }
};
function dataBaseQueryWithoutSand(req, res, qyeryToDataBase) {
  var mysql = require('mysql');
  var connection = mysql.createConnection({
  host: '127.0.0.1',
  port: '3306',
  user: 'root',
  password: 'somepassword',
  database : 'onlineshop'});
  try {
    connection.connect(function(err) {
      if (err) throw err;
      console.log("error connection to database");
    });
    var response = res;
  
  connection.query (qyeryToDataBase, function(error, result, fields) {
    if(error || result == undefined)            
    {
      return error;
    } else {
      console.log(result);
    };
  
  });
  } catch(exception) {
    console.log(exception);
  } finally {
    
    return JSON.stringify(result);
  }
};
//"SELECT categoryName FROM `categoriestable` LIMIT 0, 1000"
router.get('/categories', (req, res) => {
  dataBaseQuery(req, res, "SELECT * FROM `categoriestable` LIMIT 0, 1000");
});


// router.get('/categories/:categoryId', (req, res) => {
//   const id = req.params.categoryId;
//   const category = getCategoryById(id);

// })

// router.get('/goods', (req, res) => {
//   res.send(goods);
// })

router.get('/categories/:categoryId/goods', (req, res) => {
  const id = req.params.categoryId;
  dataBaseQuery(req, res, "SELECT * FROM `itemsTable` WHERE itemCategoryID = "+ id +" LIMIT 0, 1000");
  // const goods = getGoodsFromSpecificCategory(id);
  // res.send(goods);
});

router.get('/goods/:itemId', (req, res) => {
  const id = req.params.itemId;
  dataBaseQuery(req, res, "SELECT * FROM `itemsTable` WHERE itemID = " + id + " LIMIT 0, 1000");
  // const item = getItemById(categoryId, itemId);
  // res.send(item)
});

////////////////////////////////////////////////////////////////////////

function checkLogin(obj, reqName) {
  let flag = true;
  
  for(let user in obj) {
    if(user === reqName) {
      flag = false;
    }
  }
  return flag;
}
router.post('/registration', bodyParserJson, (req, res) => { 
    var mysql = require('mysql');
    var connection = mysql.createConnection({
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: 'somepassword',
    database : 'onlineshop'});
    try {
      connection.connect(function(err) {
        if (err) throw err;
        console.log("error connection to database");
      });
      var response = res;
    
    connection.query (qyeryToDataBase, function(error, result, fields) {
      if(error || result == undefined)            
      {
        return error;
      } else {
        console.log(result);
      };
          var user = dataBaseQueryWithoutSand(req, res, "SELECT userLogin FROM `usersTable` WHERE userLogin = '"+ req.body.username +"' LIMIT 0, 1000");
      if(true) {
        let userPassID = req.body.password;
        dataBaseQuery(req, res, `INSERT INTO usersTable (userID, userLogin, userPassID) VALUES (default,"${req.body.username}", "${userPassID}")`)
        res.send('регистрация прошла успешно!');
      } else {
        res.status('409').send('пользователь с таким именем уже существует');
      }
    });
    } catch(exception) {
      console.log(exception);
    } finally {
      
    }

  }
  catch (exception){
    console.log(exception);
  }
  finally {
    connection.close;
  }
    console.log();
})

router.post('/login', bodyParserJson, (req, res) => {
  let data = users;
  let secretLine = 'dsffds2354asvcfd2432zzz';
  
  if(!checkLogin(users, req.body.username)) {
    for(let user in data) {
      if(user === req.body.username && data[user].password === req.body.password) {
        data[req.body.username].token = secretLine + user;
        fs.writeFile('./data/users.json', JSON.stringify(data));
        res.send(data[req.body.username].token);
      }  
    }
    res.status(400).send('Введённые данные не верны, повторите попытку'); 
  }
  res.status(401).send("Зарегистрируйтесь пожалуйста!");
})

router.post('/logout', bodyParserJson, (req,res) => {
  let data = users;
  data[req.body.username].token = '';
  fs.writeFile('./data/users.json', JSON.stringify(data));
  res.send('logged out')
})

/////////////////////////////////////////////////////////////////////////




function checkProductCart(products, categoryId, itemId) {
  let flag = false;
  if(products === undefined) {
    return flag; 
  } else {
    products.forEach((product) => {
    if(+product.id === +itemId && +product.categoryId === +categoryId) {
          flag = true;
          increaseTheCounter(product);
        }
        console.log(product.id);
      }
      // console.log(flag);
    ) 
    return flag;
  }
}

function increaseTheCounter(item) {
  return item.currentValue += 1;
}

router.post('/cart', bodyParserJson, (req, res) => {
  let data = usersCart;
  const categoryId = req.body.categoryId;
  const itemId = req.body.id;
  let goods = getItemById(categoryId, itemId);
  if(checkProductCart(data[req.body.token], categoryId, itemId)) {
    fs.writeFile('./data/usersCart.json', JSON.stringify(data));
    res.send('you have successfully added a similar product');
  } else if(data[req.body.token] === undefined) {
    data[req.body.token] = goods;
    fs.writeFile('./data/usersCart.json', JSON.stringify(data));
    res.send('product successfully added');
  } else {
    data[req.body.token].push(goods[0]);
    fs.writeFile('./data/usersCart.json', JSON.stringify(data));
    res.send('product successfully added');
  }
})

router.delete('/cart', bodyParserJson, (req, res) => {
  let data = usersCart;
  const categoryId = req.body.categoryId;
  const itemId = req.body.id;
  data[req.body.token] = usersCart[req.body.token].filter((item) => {
    return !(item.id === +itemId && item.categoryId === +categoryId);
  });
  fs.writeFile('./data/usersCart.json', JSON.stringify(data));
  res.send('delete successfully');
})

router.get('/cart', (req, res) => {
  if(usersCart[req.headers.token] === undefined) {
    res.status('204').send('Корзина пуста');
  }
  let data = usersCart[req.headers.token]
  res.send(data);
})
/////////////////////////////////////////////////////////////////////////


module.exports = router;


// кеш кат и товар. рефакт. токен в хедер. добавить пут метод для эдд товар. доабвить коды ошибок