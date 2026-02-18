require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/phonebook')
const app = express()

morgan.token('body',(req) => {
    if(req.method === 'POST') {
        return JSON.stringify(req.body)
    }
    return ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body '))
app.use(express.static('dist'))
app.use(express.json())


app.get('/', (request, response) => {
        response.send('hello there!')
})
app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then(people => {
            response.json(people)
        })
        .catch(error => next(error))
})
app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findById(id)
        .then((person) => {
            if(person) {
                response.json(person)
            } else {
                response.status(404).json({error: 'Person not found'})
            }
        })
        .catch(error => next(error))
})
app.get('/info', (request, response, next) => {
    const currentDate = new Date()
    Person.countDocuments({})
        .then((count) => {
        response.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${currentDate}</p>
        `)
        })
        
        .catch(error => next(error))
    
})
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
    
})
app.post('/api/persons', (request, response, next) => {
    const body = request.body
    if(!body.name) {
        return response.status(400).json({
            error: 'name is missing'
        })
    }
    if(!body.number) {
        return response.status(400).json({
            error: 'number is missing'
        })
    }
    const person = new Person({
        name: body.name,
        number: body.number,
    })
    person.save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const {name, number} = request.body
    Person.findById(request.params.id)
        .then(person => {
            if(!person) {
                return response.status(404).end()
            }
            person.name = name
            person.number = number
            return person.save().then((updatedNote) => {
                response.json(updatedNote)
            }) 
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}

const errorHandler = (error, request, response, next) => {
    console.log('Error Handler triggered')
    console.log(error.message)
    if(error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
    }
    next(error)
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

