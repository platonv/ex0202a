import Realm from 'realm'

let repository = new Realm({
  schema: [
    {
      name: 'Seats',
      primaryKey: 'id',
      properties: {
        id: { type: 'int', indexed: true },
        name: 'string',
        status: 'string',
        type: 'string',
        createdAt: 'date',
        updatedAt: 'date',
      },
    },
  ],
})

let cacheService = {
  findAll: function() {
    console.log('DB: find All')
    return repository.objects('Seats')
  },

  save: function(seat) {
    console.log('DB: saving')
    if (repository.objects('Seats').filtered("id = '" + seat.id + "'").length)
      return

    repository.write(() => {
      seat.createdAt = new Date()
      seat.updatedAt = new Date()
      console.log('DB: saving')
      console.log(seat)
      repository.create('Seats', seat)
    })
  },

  update: function(seat, callback) {
    if (!callback) return
    console.log('DB: update')
    console.log(seat)
    repository.write(() => {
      callback()
      seat.updatedAt = new Date()
    })
  },

  delete: function(seat) {
    console.log('DB: update')
    console.log(seat)
    repository.write(() => {
      repository.delete(seat)
    })
  },

  deleteAll: function() {
    console.log('DB: delete all')
    repository.write(() => {
      repository.deleteAll()
    })
  },
}

export default cacheService
