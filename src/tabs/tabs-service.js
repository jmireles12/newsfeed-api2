const TabsService = {
    getAllTabs(knex) {
        return knex.select('*').from('tabs')
    },
    insertTab(knex, newTab) {
        return knex
            .insert(newTab)
            .into('tabs')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex.from('tabs').select('*').where('id', id).first()
    },
    deleteTab(knex, id) {
        return knex('tabs')
            .where({ id })
            .delete()
    },
    updateTab(knex, id, newTabFields) {
        return knex('tabs')
            .where({ id })
            .update(newTabFields)
    },
}

module.exports = TabsService