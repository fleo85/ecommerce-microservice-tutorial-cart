'use strict';

var utils = require('../utils/writer.js');
var Default = require('../service/DefaultService');

module.exports.usersUserIdCartsCartIdGET = function usersUserIdCartsCartIdGET (req, res, next, userId, cartId) {
  Default.usersUserIdCartsCartIdGET(userId, cartId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.usersUserIdCartsCartIdPUT = function usersUserIdCartsCartIdPUT (req, res, next, body, userId, cartId) {
  Default.usersUserIdCartsCartIdPUT(body, userId, cartId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.usersUserIdCartsCartIdProductsProductIdPUT = function usersUserIdCartsCartIdProductsProductIdPUT (req, res, next, body, userId, cartId, productId) {
  Default.usersUserIdCartsCartIdProductsProductIdPUT(body, userId, cartId, productId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.usersUserIdCartsGET = function usersUserIdCartsGET (req, res, next, userId) {
  Default.usersUserIdCartsGET(userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.usersUserIdCartsPOST = function usersUserIdCartsPOST (req, res, next, userId) {
  Default.usersUserIdCartsPOST(userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.usersUserIdGET = function usersUserIdGET (req, res, next, userId) {
  Default.usersUserIdGET(userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.usersUserIdPOST = function usersUserIdPOST (req, res, next, body, userId) {
  Default.usersUserIdPOST(body, userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
