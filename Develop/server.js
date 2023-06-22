const express = require("express");
const fs = require("fs");
const path = require("path");
const database = require("./db/db.json")

var app = express();
var port = process.env.PORT || 3000;

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));

})

app.route("/api/notes")
    .get(function (req, res) {
        res.json(database);
    })

    .post(function (req, res) {
        let json_fp = path.join(__dirname, "/db/db.json");
        let newNote = req.body;

        let biggestId = 99;

        for (let i = 0; i < database.length; i++) {
            let each_note = database[i];

            if (each_note.id > biggestId) {
                biggestId = each_note.id;
            }

        }
        newNote.id = biggestId + 1;

        database.push(newNote)

        fs.writeFile(json_F_P, JSON.stringify(database), function (err) {

            if (err) {
                return console.log(err);

            }
            console.log('Your note was saved!!!');
        });
        res.json(newNote);
    })




app.delete("/api/notes/:id", function (req, res) {
    let json_F_P = path.join(__dirname, "/db/db.json");

    for (let i = 0; i < database.length; i++) {

        if (database[i].id == req.params.id) {
            database.splice(i, 1);
            break;
        }
    }

    fs.writeFileSync(json_F_P, JSON.stringify(database), function (err) {

        if (err) {
            return console.log(err);
        } else {
            console.log("Your note was deleted!!!");
        }

    });
    res.json(database);
});

app.listen(port, function () {
    console.log("App is listneing on PORT " + port);
});



