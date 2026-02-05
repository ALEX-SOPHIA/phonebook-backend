const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(morgan('tiny'))

app.use(express.json())

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
        response.send('hello there!')
})
app.get('/api/persons', (request, response) => {
    response.json(persons)
})
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(p => p.id ===id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).json({error: 'Person not found'})
    }
})
app.get('/info', (request, response) => {
    const currentDate = new Date()
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${currentDate}</p>
        `)
})
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

const generateId =  (max) => {
    return String(Math.floor(Math.random()*max))
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log("body is ", body)
    
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
    if (persons.some(p => p.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    } 

    const person = {
        id: generateId(10000),
        name: body.name,
        number: body.number,
    }
    console.log("The added person is", person)
    
    persons = persons.concat(person)
    response.json(person)

})

const PORT = 3002
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})