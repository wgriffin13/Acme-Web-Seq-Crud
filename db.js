const Sequelize = require('sequelize');
const conn = new Sequelize(process.env.DATABASE_URL);

const Users = conn.define('users', {
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
})

const syncAndSeed = () => {
    return conn.sync({force: true})
        .then( () => {
            console.log('\n----database seeding----\n')
            Users.create({firstName: 'John', lastName: 'Smith'});
            Users.create({firstName: 'Jane', lastName: 'Doe'});
            Users.create({firstName: 'Frank', lastName: 'Dream'});
        });
};

syncAndSeed()

module.exports = {
    conn,
    Users,
};
