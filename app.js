const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const _ = require('lodash');
const bodyParser = require('body-parser')
const app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/GymLogDB', {useNewUrlParser: true, useUnifiedTopology: true});

// Date and Time
///////////////////////////////////////////////////////

const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

// CREATE EXERCISE LIST SCHEMA
///////////////////////////////////////////////////////

const exercisesSchema = new mongoose.Schema({
  name: String
});

const Exercise = mongoose.model("Exercise", exercisesSchema);

const benchPress = new Exercise ({
  name: "Bench Press"
});

const squat = new Exercise ({
  name: "Squat"
});

// benchPress.save();
// squat.save();

// CREATE SET SCHEMA
///////////////////////////////////////////////////////

const setsSchema = new mongoose.Schema({
  reps: Number,
  weight: Number,
  exercise: String,
  date: {type: Date, default: Date.now}
});


const Set = mongoose.model("Set", setsSchema);






app.get("/", function (req, res) {
  // ////////////////////////////////////////////////////////////////////

  const newestEntry = Set.findOne({}, {date: 1}, {sort: {"date" : -1}}, function (err, found) {if (err) {
    console.log(err);
    // RENDERING DATA IN CASE OF ERROR
    res.render('summary', {heading: "Summary", summaryStats: 1});
  } else {
    return found
  }
  });

  newestEntry.then(function(data) {
    const date = new Date(data.date);
    const lastDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    console.log(lastDate);

    const listOfNewest = Set.find({date: { $gte : lastDate}}, function(err, found) {
      console.log(found);
      res.render('summary', {heading: "Summary", summaryStats: found, lastDate: lastDate, today: today});
    })
  })
});



app.get("/exercise", function (req, res) {
  Exercise.find({}, function (err, foundExercises) {
    res.render('exercise', {heading: "Exercise", newExercises : foundExercises});
  });
});
// CREATE CUSTOM ADDRESS
///////////////////////////////////////////////////////

app.get("/exercise/:customExerciseName", function (req,res) {

  const customExerciseName = req.params.customExerciseName;
  console.log(customExerciseName);
  const foundSets = "";

  Set.find({date: { $gte : today}, exercise: customExerciseName}, function(err, foundSets) {
    res.render('add', {heading: customExerciseName, completed: foundSets})
  })

});

// ADD SETS AND WEIGHT TO EXERCISE
///////////////////////////////////////////////////////

app.post("/exercise/:customExerciseName", function (req, res) {
  const customExerciseName = req.params.customExerciseName;
  const reps = req.body.newSet;
  const weight = req.body.newWeight;
  console.log(customExerciseName);

  const set = new Set ({
    reps: reps,
    weight: weight,
    exercise: customExerciseName
  });

  console.log(set);

  set.save();

  res.redirect("/exercise/" + customExerciseName)
})



app.get("/more", function (req, res) {
  res.render('more', {heading: "More"});
});


app.get("/exercise/:customExerciseName/history", function (req, res) {
  const customExerciseName = req.params.customExerciseName;
  Set.find({exercise: customExerciseName},{}, {sort: {date : -1}},  function (err, foundSets) {
    if (err) {
      console.log(err);
    } else {
      console.log(foundSets);
      res.render('history', {heading: customExerciseName, foundSets: foundSets})
    }
  })
})


app.listen (3000, function() {
  console.log("Server started.");
});
