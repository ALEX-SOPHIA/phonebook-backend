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
app.get('/api/persons', (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
    })
})
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Person.findById(id)
        .then((person) => {
            if(person) {
                response.json(person)
            } else {
                response.status(404).json({error: 'Person not found'})
            }
        })
        .catch(error => {
            console.log(error)
            response.status(500).end()
        })
})
app.get('/info', (request, response) => {
    const currentDate = new Date()
    Person.countDocuments({})
        .then((count) => {
        response.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${currentDate}</p>
        `)
    })
    
})
app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
    
})

// app.delete('/api/persons/:id', (request, response) => {
//     const id = request.params.id
//     persons = persons.filter(person => person.id !== id)
//     response.status(204).end()
// })


app.post('/api/persons', (request, response) => {
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
    // if (persons.some(p => p.name === body.name)) {
    //     return response.status(400).json({
    //         error: 'name must be unique'
    //     })
    // } 
    const person = new Person({
        name: body.name,
        number: body.number,
    })
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})