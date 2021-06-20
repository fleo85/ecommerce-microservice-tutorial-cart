'use strict';
const Context = require('../models/cart-microservice-context.js')
var Sequelize = require('sequelize');

function buildUserForDB(user) {
  var docItem = {}
  docItem["name"] = user.name;
  docItem["surname"] = user.surname;
  return docItem;
}

function buildUserFromDB(user) {
  var docItem = {}
  docItem["id"] = user.id;
  docItem["name"] = user.name;
  docItem["surname"] = user.surname;
  docItem["currentCart"] = null
  if (user.carts != undefined){
    user.carts.forEach(function(cart){
      docItem["currentCart"] = buildCartFromDB(cart)
    })
  }
  return docItem
}

function buildCartForDB(cart, userId) {
  var docItem = {}
  docItem["userId"] = userId
  docItem["status"] = cart.status;
  return docItem;
}

function buildCartFromDB(cart) {
  var docItem = {}
  docItem["id"] = cart.id;
  docItem["status"] = cart.status;
  if (cart.cartlines != undefined){
    docItem["products"] = []
    cart.cartlines.forEach(function(cartline){
      docItem["products"].push(buildCartLineFromDB(cartline))
    })
  }
  return docItem
}

function buildCartLineForDB(cartline, cartId) {
  var docItem = {}
  docItem["cartId"] = cartId
  docItem["productId"] = cartline.productId;
  docItem["quantity"] = cartline.quantity;
  return docItem;
}

function buildCartLineFromDB(cartline) {
  var docItem = {}
  docItem["productId"] = cartline.productId;
  docItem["quantity"] = cartline.quantity;
  return docItem
}

/**
 * Restituisce i dettagli di un carrello inclusi gli item
 *
 * userId String 
 * cartId String 
 * returns Cart
 **/
exports.usersUserIdCartsCartIdGET = function(userId,cartId) {
  return new Promise(function(resolve, reject) {
    Context.Cart.findOne({
      where: {
        id: cartId
      },
      include: [
        {
          model: Context.CartLine,
          required: false
        }
      ]
    }).then(function (document) {
      resolve(buildCartFromDB(document));
    })
  });
}


/**
 * Modifica lo stato del carrello portandolo in finalizzato
 *
 * body Cart 
 * userId String 
 * cartId String 
 * returns Cart
 **/
exports.usersUserIdCartsCartIdPUT = function(body,userId,cartId) {
  //TODO: VERIFY THAT THE STATUS IS CLOSED AND THEN CALL SERVICES OR IMPLEMENT SAGA
  return new Promise(function(resolve, reject) {
    Context.sequelizeconn.transaction(t => {
      return Context.Cart.update(
        buildCartForDB(body, userId),
        {
          where: { id: cartId },
          transaction: t
        }
      )
    })
      .then(result => {

        resolve(body);
      }).catch(error => {
        console.log(error)
      });
  });
}


/**
 * Aggiunge un prodotto con una quantità al carrello
 *
 * body CartLine 
 * userId String 
 * cartId String 
 * productId String 
 * returns Cart
 **/
exports.usersUserIdCartsCartIdProductsProductIdPUT = function(body,userId,cartId,productId) {
  return new Promise(function(resolve, reject) {
    Context.sequelizeconn.transaction(t => {
      return Context.CartLine.count({
        where: { productId: productId }
      }).then(conteggio => {
        if (conteggio > 0) {
          return Context.CartLine.update(
            buildCartLineForDB(body, cartId),
            {
              where: { productId: productId },
              transaction: t
            }
          )
        } else {
          return Context.CartLine.create(
            buildCartLineForDB(body, cartId),
            {
              transaction: t
            }
          )
        }
      })
    })
      .then(result => {

        resolve(body);
      }).catch(error => {
        console.log(error)
      });
  });
}


/**
 * Ritorna tutti i carrelli dell'utente
 *
 * userId String 
 * returns CartList
 **/
exports.usersUserIdCartsGET = function(userId) {
  return new Promise(function(resolve, reject) {
    var result = {
      carts: [],
      total: 0
    }
    Context.Cart.findAndCountAll({
      where: {userId: userId}
    }).then(function (products) {
      console.log(products);
      result.total = products.count
      products.rows.forEach(function (product) {
        result.carts.push(buildCartFromDB(product));
      })
      resolve(result);
    })
  });
}


/**
 * Crea un carrello vuoto attivo per l'utente
 *
 * userId String 
 * returns Cart
 **/
exports.usersUserIdCartsPOST = function(userId) {
  return new Promise(function(resolve, reject) {
    var body = {status: 'open'}
    Context.sequelizeconn.transaction(t => {
      return Context.Cart.create(buildCartForDB(body, userId),
        {
          transaction: t
        }).then(updateProduct => {
          body.id = updateProduct.id
        })
    }).then(result => {
      resolve(body);
    }).catch(error => {
      console.log(error)
    });
  });
}


/**
 * Restituisce informazioni su utente ed id del carrello corrente se esiste
 *
 * userId String 
 * returns User
 **/
exports.usersUserIdGET = function(userId) {
  return new Promise(function(resolve, reject) {
    Context.User.findOne({
      where: {
        id: userId
      },
      include: [
        {
          model: Context.Cart,
          required: false,
          where: { status: 'open' }
        }
      ]
    }).then(function (document) {
      resolve(buildUserFromDB(document));
    })
  });
}


/**
 * Crea un nuovo utente
 *
 * body User 
 * userId String 
 * returns User
 **/
exports.usersPOST = function(body) {
  return new Promise(function(resolve, reject) {
    Context.sequelizeconn.transaction(t => {
      return Context.User.create(buildUserForDB(body),
        {
          transaction: t
        }).then(updateProduct => {
          body.id = updateProduct.id
        })
    }).then(result => {
      resolve(body);
    }).catch(error => {
      console.log(error)
    });
  });
}

