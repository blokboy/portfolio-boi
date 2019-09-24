exports.up = function(knex) {
    return knex.schema.createTable('Accounts', tbl => {
        tbl.increments()
        tbl.string('first_name', 128).notNullable()
        tbl.string('last_name', 128).notNullable()
        tbl.string('email', 128).notNullable().unique()
        tbl.string('password', 128).notNullable()
        tbl.string('phone', 16).nullable()
        tbl.float('balance', 2).defaultTo(5000)
        tbl.boolean('confirmed').defaultTo(false)
        tbl.timestamp('created_at').defaultTo(knex.fn.now())
        tbl.timestamp('updated_at').defaultTo(knex.fn.now())
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('Accounts')
};
