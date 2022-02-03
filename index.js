const express = require('express')
const app = express()
const fs = require('fs/promises')
const fileShow = 'text.txt'

// app.get('/file', (request, response) => {
//     response.sendFile(fileShow, (err) => {
//         if (err) {
//             console.error(err)
//         }
//         console.log(`File Send: ${fileShow}`)
//     })
// })

// app.get('/file', (request, response) => {
//     fs.readFile(fileShow, 'utf8', (err, data) => {
//         if(err) {
//             response.send('No se puede leer')
//             return
//         }
//         response.send(data)
//     // res.write(sd)
//     // res.end()
// })
// })

// Con Promesas (then-catch)
app.get('/file-promise', (request, response) => {
    fs.readFile(fileShow, 'utf8')
    .then((data) => {
        response.send(data)
    })
    .catch((error) => {
        response.send('No se pudo leer')
    })
})

//Con promesas (async/await)
app.get('/file-async', async (request, response) => {
    const data = await fs.readFile(fileShow, 'utf8')
    response.send(data)
})

//
// app.get('/koders', async (request, response) => {
//     const data = await fs.readFile('kodemia.json', 'utf8')
//     const dataParsed = JSON.parse(data)
//     response.json(dataParsed.koders)
// })

//Get /koders/emilio
//Get /koders/sara
app.get('/koders/:id', async (request, response) => {
    const id = parseInt(request.params.id) 
    const data = await fs.readFile('kodemia.json', 'utf8')
    const db = JSON.parse(data)

    const koderFound = db.koders.filter((koder) => {
        return koder.id === id
        
    })

    response.json(koderFound)
    
})

app.get('/koders/sex/:sex', async (request, response) => {
    const sex = request.params.sex
    const data = await fs.readFile('kodemia.json', 'utf8')
    const db = JSON.parse(data)

    const koderSex = db.koders.filter((koder) => {
        return koder.sex.toLowerCase() === sex.toLowerCase()
    })
    response.json(koderSex)
})



// Hacer un endpoint que al llamarlo nos regrese el contenido de un archivo text.txt
// GET /file


app.get('/koders', async (request, response) => {
    const data = await fs.readFile('kodemia.json', 'utf8')
    const db = JSON.parse(data)
    let kodersFound = db.koders

    if(request.query.max_age) {
        kodersFound = kodersFound.filter((koder) => {
            return koder.age <= parseInt(request.query.max_age)
        })
    }

    response.json(kodersFound)
})

//Important para leer el body del request
app.use(express.json())


app.post('/koders', async (request, response) => {
    const data = await fs.readFile('kodemia.json', 'utf8')
    const db = JSON.parse(data)

    const newKoderId = db.koders.length + 1
    const newKoderData ={
        id: newKoderId,
        ...request.body
    }

    db.koders.push(newKoderData)

    const dbAsString = JSON.stringify(db, '\n', 2)
    await fs.writeFile('kodemia.json', dbAsString, 'utf8')

    response.json(db.koders)
})

app.delete('/koders/:id', async (request ,response) => {
    const id =  parseInt(request.params.id)
    const data = await fs.readFile('kodemia.json', 'utf8')
    const db = JSON.parse(data)
    
    const newKodersArray = db.koders.filter((koder) => id != koder.id)
    db.koders = newKodersArray

    const dbAsString = JSON.stringify(db, '\n', 2)
    await fs.writeFile('kodemia.json', dbAsString, 'utf8')

    response.json(db.koders)
})

app.patch('/koders/:id', async (request, response) => {
    const id = parseInt(request.params.id)

    if(isNaN(id)) {
        response
            .status(400)
            .json({
                message: "Id must be a number"
            })
            return
    }

    const data = await fs.readFile('kodemia.json', 'utf8')
    const db = JSON.parse(data)

    const koderFoundIndex = db.koders.findIndex((koder) => id === koder.id)

    if(koderFoundIndex < 0) {
        response.status(404)
        response.json({
            message: 'Koder not found'
        })
        return
    }

    db.koders[koderFoundIndex] = {
        ...db.koders[koderFoundIndex],
        ...request.body
    }

    const dbAsString = JSON.stringify(db, '\n', 2)
    await fs.writeFile('kodemia.json', dbAsString, 'utf8')

    response.json(db.koders[koderFoundIndex])


})

app.listen(8080, () => {
    console.log('Server is listening')
})


//Mentors
app.post('/mentors', async (request, response) => {
    const data = await fs.readFile('kodemia.json', 'utf8')
    const db = JSON.parse(data)

    const newMentorId = db.mentors.length + 1
    const newMentorData ={
        id: newMentorId,
        ...request.body
    }

    db.mentors.push(newMentorData)

    const dbAsString = JSON.stringify(db, '\n', 2)
    await fs.writeFile('kodemia.json', dbAsString, 'utf8')

    response.json(db.mentors)
})

app.delete('/mentors/:id', async (request ,response) => {
    const id =  parseInt(request.params.id)
    const data = await fs.readFile('kodemia.json', 'utf8')
    const db = JSON.parse(data)
    
    const newMentorsArray = db.mentors.filter((mentor) => id != mentor.id)
    db.mentors = newMentorsArray

    const dbAsString = JSON.stringify(db, '\n', 2)
    await fs.writeFile('kodemia.json', dbAsString, 'utf8')

    response.json(db.mentors)
})

app.patch('/mentors/:id', async (request, response) => {
    const id = parseInt(request.params.id)

    if(isNaN(id)) {
        response
            .status(400)
            .json({
                message: "Id must be a number"
            })
            return
    }

    const data = await fs.readFile('kodemia.json', 'utf8')
    const db = JSON.parse(data)

    const mentorFoundIndex = db.mentors.findIndex((mentor) => id === mentor.id)

    if(mentorFoundIndex < 0) {
        response.status(404)
        response.json({
            message: 'Mentor not found'
        })
        return
    }

    db.mentors[mentorFoundIndex] = {
        ...db.mentors[mentorFoundIndex],
        ...request.body
    }

    const dbAsString = JSON.stringify(db, '\n', 2)
    await fs.writeFile('kodemia.json', dbAsString, 'utf8')

    response.json(db.mentors[mentorFoundIndex])


})

app.get('/mentors', async (request, response) => {
    const data = await fs.readFile('kodemia.json', 'utf8')
    const db = JSON.parse(data)
    let mentorsFound = db.mentors

    response.json(mentorsFound)
})