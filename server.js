const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

app.use(express.json())
app.use(cors())

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'deha',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})
const poolPromise = pool.promise().

// Récupère la liste des tâches
app.get('/tasks', (req, res)=>{
    res.send({
        task1: 'démarrer projet'
    });
})

app.listen(port, ()=>{
    console.log('server turning on ' + port)
})
