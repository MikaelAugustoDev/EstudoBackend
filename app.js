const express = require('express')
const Sequelize = require('sequelize')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()

//Models

delete require.cache[require.resolve('./models/user')]
const User = require('./models/user')

// Configurando JSON response

app.use(express.json())

// Rota Pública

app.get('/', (req, res) => {
    res.status(200).json({msg: "Bem Vindo ao Home"})
})

// Rota de Registro de usuario

app.post('/registro', async (req, res) => {

    const {email, password} = req.body

    // Validações

    if(!email) {
        return res.status(422).json({msg: "Email é obrigatorio"})
    }

    if(!password) {
        return res.status(422).json({msg: "password é obrigatorio"})
    }

    // Checando se ja existe esse usuario

    const userExiste = await User.findOne({email: email})

    if(userExiste) {
        return res.status(422).json({msg: "Email já cadastrado"}) 
    }

    // Criando a password

    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    // criar usuario

    const user = new User({
        email,
        password: passwordHash,
    })

    try {

        await user.save()

        res.status(201).json({msg: "Usuario criado com sucesso"})

    }catch(err) {

        console.log(err)

        res.status(500).json({msg: "erro"})
    }
})

app.post('/login', async (req, res) => {

    const {email, password} = req.body

    // validações

    if(!email) {
        return res.status(422).json({msg: "Email é obrigatorio"})
    }

    if(!password) {
        return res.status(422).json({msg: "password é obrigatorio"})
    }

    // checar se existe

    const user = await User.findOne({email: email})

    if(!user) {
        return res.status(404).json({msg: "Usuario nao encontrado"}) 
    }

    // checando a password

    const checkpassword = await bcrypt.compare(password, user.password)

    if(!checkpassword) {
        return res.status(422).json({msg: "password invalida"})
    }



})

// CONECTANDO COM O BANCO DE DADOS

// const sequelize = new Sequelize('teste', 'root', 'mikael777', {
//     host: 'localhost',
//     dialect: 'mysql'
// })

// sequelize.authenticate().then(() => {
//     console.log('Sucesso ao se conectar com o banco')
// }).catch((err) => {
//     console.log(`Erro ao se conectar em ${err}`)
// });

// const User = sequelize.define('users', {
//     email: {
//         type: Sequelize.STRING
//     },
//     password: {
//         type: Sequelize.STRING
//     }
// })

// User.sync({force: true})

app.listen(3000, () => console.log('Sucesso ao Rodar em http://localhost:3000'))