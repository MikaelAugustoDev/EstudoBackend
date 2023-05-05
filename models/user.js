const Sequelize = require('sequelize')

const sequelize = new Sequelize('teste', 'root', 'mikael777', {
    host: 'localhost',
    dialect: 'mysql'
})

sequelize.authenticate().then(() => {
    console.log('Sucesso ao se conectar com o banco')
}).catch((err) => {
    console.log(`Erro ao se conectar em ${err}`)
});

const User = sequelize.define('users', {
    email: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    }
})

User.sync()

module.exports = User