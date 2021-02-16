require('dotenv').config()
const knex = require('knex')
const TabsService = require('./tabs/tabs-service')

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DATABASE_URL,
})

TabsService.getAllTabs(knexInstance)
    .then(tabs => console.log(tabs))
    .then(() =>
        TabsService.insertTab(knexInstance, {
            name: 'New Name',
        })
    )
    .then(newTab => {
        console.log(newTab)
        return TabsService.updateTab(knexInstance,
            newTab.id,
            { name: 'Updated name' }
        ).then(() => TabsService.getById(knexInstance, newTab.id))
    })
    .then(tab => {
        console.log(tab)
        return TabsService.deleteTab(knexInstance, tab.id)
    })