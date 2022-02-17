const db = require('./db');
const sequelize = db.sequelize;
const Character = db.Character;
const Life = db.Life;

const express = require('express');
const app = express();
const methodOverride = require('method-override');

app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => res.redirect('/marvel'));

app.delete('/marvel/:id', async(req, res, next) => {
    try {
        const char = await Character.findByPk(req.params.id);
        await char.destroy();
        res.redirect(`/marvel/${char.lifeId}`)
    }
    catch(ex){
        next(ex);
    }
});

app.post('/marvel', async(req, res, next) => {
    try {
        const character = await Character.create(req.body);
        res.redirect(`/marvel/${character.lifeId}`)
    }
    catch(ex) {
        next(ex);
    }
})

app.get('/marvel', async(req, res, next) => {
    try {
        const characters = await Character.findAll({
            include: [Life]
        })
        const lives = await Life.findAll();
        const options = lives.map(life => {
            return `
            <option value='${life.id}'> 
            ${life.name}
            </option>
            `;
        }).join('')
        const html = characters.map (character => {
            return `
            <div class='para'>
                ${character.name} is<a href='/marvel/${character.life.id}'>${character.life.name}</a>
            </div>
            `
        }).join('')     
        res.send(`
        <html>
        <head>
            <title>Marvel Character's Lives</title>
            <link rel='stylesheet' href='/styles.css' />
        </head>
        <body>
            <h1>Marvel Characters</h1>
            <h2>Are they alive still? </h2>
            ${html}
            <form method = 'POST'>
                <input name='name' placeholder='Character Name'/>
                <select name='lifeId'>
                ${ options }
                </select>
            <button>Life Pending</button>
        </body>
        </html>
        `)
    }
    catch(ex) {
        next(ex)
    }
})

app.get('/marvel/:id', async(req, res, next) => {
    try {
        const lives = await Life.findByPk(req.params.id, {
            include: [Character]
        });
        const html = lives.characters.map (life => {
            return `
            <div class='life'>
                ${life.name}
                <form method='POST' action='/marvel/${life.id}?_method=delete'>
                <button>Erase</button>
                </form>
            </div>
            `
        }).join('');
        res.send(`
        <html>
        <head>
            <title>Marvel Characters</title>
            <link rel='stylesheet' href='/styles.css' />
        </head>
        <body>
        <h1>Marvel Characters That Are ${lives.name.charAt(0).toUpperCase() + lives.name.slice(1)}</h1>
        <h2>
        <a href='/marvel'> <-Back to More Characters</a>
        </h2>
        ${html}
        </body>
        </html>
        `)
    }
    catch(ex) {
        next(ex);
    }
})

const init = async() => {
    try {
        await sequelize.sync({ force: true})
        console.log('starting!')
        const alive = await Life.create({ name: 'alive 💪'});
        const decease = await Life.create({ name: 'deceased 💀'});
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