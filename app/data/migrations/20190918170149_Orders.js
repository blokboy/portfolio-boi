exports.up = function(knex) {
  return knex.schema.createTable('Orders', tbl => {
    tbl.increments() 
    tbl.string('ticker', 8).notNullable()
    tbl.string('company_name', 128).notNullable()
    tbl.string('order_type', 16).notNullable()
    tbl.integer('price').notNullable()
    tbl.float('quantity', 2).notNullable()
    tbl.timestamp('created_at').defaultTo(knex.fn.now())
    tbl.timestamp('updated_at').defaultTo(knex.fn.now())
    tbl.integer('user_id').references('id').inTable('Accounts').onDelete('restrict')
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('Orders')
};
