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

const express = require('express');
const { prototype } = require('pg/lib/connection-parameters');
const app = express();

const init = async() => {
    try {
        await sequelize.sync({ force: true})
        console.log('starting!')
        const alive = await Life.create({ name: 'alive'});
        const decease = await Life.create({ name: 'decease'});
        await Character.create({ name: 'Iron Man', lifeId: decease.id});
        await Character.create({ name: 'Pietro Maximoff', lifeId: decease.id});
        await Character.create({ name: 'Natasha Romanoff', lifeId: decease.id});
        await Character.create({ name: 'Captain America', lifeId: alive.id});
        await Character.create({ name: 'Doctor Strange', lifeId: alive.id});
        await Character.create({ name: 'Clint Barton', lifeId: alive.id});
        const port = process.env.PORT || 3000;
        app.listen(port, () => console.log(`listening on port ${port}`))
    }
    catch(ex) {
        console.log(ex)
    }
}

init();