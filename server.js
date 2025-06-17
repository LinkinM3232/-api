const express = require('express')
const fs = require('fs') // модуль для работы с файлами

const app = express()
app.use(express.json()) // чтобы читать body JSON-запросов

const port = 3000



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/notes', (req, res) => { // чтобы получить все заметки
  const data = fs.readFileSync('notes.json', 'utf8')
  const notes = JSON.parse(data)
  res.json(notes)
})


app.post('/notes', (req, res) => {
  const { title, text } = req.body // чтобы брать данные из запроса

  const data = fs.readFileSync('notes.json', 'utf8')
  const notes = JSON.parse(data)

  const newNote = { // создание заметки 
    id: Date.now().toString(), 
    title,
    text,
    createdAt: new Date().toISOString() 
  }

  notes.push(newNote) 

  

  fs.writeFileSync('notes.json', JSON.stringify(notes, null, 2))

  res.status(201).json(newNote) 
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


app.delete('/notes/:id', (req, res) => {
  const noteId = req.params.id // получаем id из URL

  const data = fs.readFileSync('notes.json', 'utf8')
  let notes = JSON.parse(data)

  const initialLength = notes.length 
  notes = notes.filter(note => note.id !== noteId) 

  if (notes.length === initialLength) {
 
    return res.status(404).json({ message: 'Заметка не найдена' })
  }

  fs.writeFileSync('notes.json', JSON.stringify(notes, null, 2)) 
  res.json({ message: 'Заметка удалена' })
})