const db = require('knex')(require('../data/knexfile').development)
const bcrypt = require('bcryptjs')

const { generateToken } = require('../utils')

const get = async (tbl) => {
    return await db(tbl) 
}

const findBy = async (tbl, filter) => {
    return await db(tbl).where(filter).first()
}

const findAllBy = async (tbl, filter) => {
    return await db(tbl).where(filter)
}

const add = async (tbl, data) => {
    return await db(tbl).insert(data)
}

const remove = async (tbl, id) => {
    return await db(tbl).where({ id }).del()
}

const update = async (tbl, id, data) => {
    return await db(tbl).where({ id }).update(data)
}

const register = async ({ first_name, last_name, password, email, phone }) => {
    try {
        const hash = bcrypt.hashSync(password, 12)
        const newUser = { first_name, last_name, password: hash, email, phone }
        const [ id ] = await add('Accounts', newUser)
        const token = await generateToken(id)
        return token 
    } catch({ err }) {
        return err
    }
}

const login = async ({ email, password }) => {
    try {
        const found = await findBy('Accounts', { email })
        if(found) {
            const success = bcrypt.compareSync(password, found.password)
            if(success) {
                const token = await generateToken(found)
                return token
            } else {
                return null 
            }
        } else {
            return null
        }
    } catch({ err }) {
        return err
    }
}

module.exports = {
    get,
    findBy,
    findAllBy,
    add,
    remove,
    update,
    register,
    login
}