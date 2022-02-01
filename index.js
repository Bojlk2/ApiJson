const express = require('express')
const app = express()
const fsPromise = require('fs/promises')
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
    fsPromise.readFile(fileShow, 'utf8')
    .then((data) => {
        response.send(data)
    })
    .catch((error) => {
        response.send('No se pudo leer')
    })
})

//Con promesas (async/await)
app.get('/file-async', async (request, response) => {
    const data = await fsPromise.readFile(fileShow, 'utf8')
    response.send(data)
})

//
app.get('/koders', async (request, response) => {
    const data = await fsPromise.readFile('kodemia.json', 'utf8')
    const dataParsed = JSON.parse(data)
    response.json(dataParsed.koders)
})

//Get /koders/emilio
//Get /koders/sara
app.get('/koders/:id', async (request, response) => {
    const id = parseInt(request.params.id)
    const data = await fsPromise.readFile('kodemia.json', 'utf8')
    const db = JSON.parse(data)

    const koderFound = db.koders.filter((koder) => {
        return koder.id === id //Normalización
        
    })

    response.json(koderFound)
    
})

app.get('/koders/sex/:sex', async (request, response) => {
    const sex = request.params.sex
    const data = await fsPromise.readFile('kodemia.json', 'utf8')
    const db = JSON.parse(data)

    const koderSex = db.koders.filter((koder) => {
        return koder.sex.toLowerCase() === sex.toLowerCase()
    })
    response.json(koderSex)
})

app.listen(8080, () => {
    console.log('Server is listening')
})

// Hacer un endpoint que al llamarlo nos regrese el contenido de un archivo text.txt
// GET /file