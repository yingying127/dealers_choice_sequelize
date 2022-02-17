const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/marvel_db');
const { STRING } = require('sequelize');

const Character = sequelize.define('character', {
    name: {
        type: STRING,
        unique: true,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    }
});

const Life = sequelize.define('life', {
    name: {
        type: STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    }
});

Character.belongsTo(Life);
Life.hasMany(Character);

module.exports = {
    sequelize,
    Character,
    Life,
}