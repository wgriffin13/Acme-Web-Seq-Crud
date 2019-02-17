const express = require('express');
const {conn, Users} = require('./db')
const ejs = require('ejs')
const morgan = require('morgan');
const methodOverride = require('method-override')

const app = express();

app.use(morgan('dev'));
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
app.use(methodOverride('_method'));
// parses url-encoded bodies
app.use(express.urlencoded({ extended: false }));
// parses json bodies
app.use(express.json())

app.get('/users/:id', async (req, res, next) => {
    try {
        const users = await Users.findAll();
        const singleUser = await Users.findByPk(req.params.id)
        if (singleUser) {
            res.render('index-user', {users, singleUser})
        } else {
            res.status(404).send('404 page not found<br><a href="/users">Return to homepage</a>')
        }
    } catch (error) {next(error)
    }
});

app.get('/users', (req, res, next) => {
    Users.findAll()
        .then( (users) => {
            res.render('index', {users} );
        })
        .catch(next);
});

app.get('/', (req, res, next) => {
    res.redirect('/users')
});

app.delete('/users/:id', (req, res, next) => {
    Users.destroy({
        where: {
            id: req.params.id
        }
    })
    .then( () => {
        res.redirect('/users')
    })
    .catch(next)
});

app.put('/users/:id', (req, res, next) => {
    Users.findByPk(req.params.id)
        .then( (user) => {
            user.update({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
            })
        })
        .then( () => {
            res.redirect('/users/' + req.params.id)
        })
        .catch(next)
});

app.post('/users', (req, res, next) => {
    Users.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    })
    .then( () => res.redirect('/users') )
    .catch(next)
})

module.exports = app;
