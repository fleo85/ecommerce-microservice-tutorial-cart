const UserModel = require('./user.js')
const CartModel = require('./cart.js')
const CartLineModel = require('./cart_line.js')

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
var pg_host = process.env.POSTGRES_HOST || config.host
var database = process.env.POSTGRES_DATABASENAME || config.database
var username = process.env.POSTGRES_USERNAME || config.username
var password = process.env.POSTGRES_PASSWORD || config.password

var sequelize = require('sequelize');
const sequelizeconn = new sequelize(database, username, password, {
    host: pg_host,
    dialect: config.dialect,
    forcedbreset: config.forcedbreset,
    minifyAliases: config.minifyAliases});

const User = UserModel(sequelizeconn, sequelize);
const Cart = CartModel(sequelizeconn, sequelize);
const CartLine = CartLineModel(sequelizeconn, sequelize);

CartLine.belongsTo(Cart)
Cart.hasMany(CartLine)
Cart.belongsTo(User)
User.hasMany(Cart)

sequelizeconn.sync({force: config.forcedbreset}).then(() => {console.log('Databases and tables created')})

module.exports = {
    sequelizeconn,
    User,
    Cart,
    CartLine
}