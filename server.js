const db = require('./db')

const init = () => {
    try {
        console.log('starting!')
    }
    catch(ex) {
        console.log(ex)
    }
}

init();