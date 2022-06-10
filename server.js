const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const mysql = require('mysql')
const multer = require('multer')
const path = require('path')


app.use(express.static("./public"))

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({
    extended: false
}))

const db = mysql.createConnection({
    host: "localhost",
    user: "Marcus",
    password: "marcus!password!",
    database: "imagedb"
})

db.connect(function(err){
    if (err) {
        return console.error('error: ' + err.message)
    }
    console.log('Connected to server')
})

var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/images/')
    },
    filename: (req, file, callBack) => {
        callBack(null, file.filename + '-' + Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({
    storage: storage
})

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/index.html')
})

app.post("/post", upload.single('image'), (req, res) => {
    if (!req.file) {
        console.log("No file upload");
    } else {
        console.log(req.file.filename)
        var imgsrc = 'http://127.0.0.1:3000/images/' + req.file.filename
        var insertData = "INSERT INTO imagedb(file)VALUES(?)"
        db.query(insertData, [imgsrc], (err, result) => {
            if (err) throw err
            console.log("file uploaded")
        })
    }
});

const PORT = 3000
app.listen(PORT, () => console.log(`server is running on port: ${PORT}`))
