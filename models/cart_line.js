module.exports = (sequelize, type) => {
    return sequelize.define('cartline', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        productId: type.INTEGER,
        quantity: type.INTEGER
    })
}