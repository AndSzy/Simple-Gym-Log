const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const _ = require('lodash');
const bodyParser = require('body-parser')
const app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');



mongoose.connect('mongodb+srv://admin-AndSzy:test123@cluster0-daukk.mongodb.net/GymLogDB', {useNewUrlParser: true, useUnifiedTopology: true});

//mongodb://localhost:27017



// Date and Time
///////////////////////////////////////////////////////

const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

// Exercise Schema
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

const defaultExercises = [benchPress, squat];

// Set Schema
///////////////////////////////////////////////////////

const setsSchema = new mongoose.Schema({
  reps: Number,
  weight: Number,
  exercise: String,
  date: {type: Date, default: Date.now}
});


const Set = mongoose.model("Set", setsSchema);


// Body Weight Schema
///////////////////////////////////////////////////////

const bodyWeightSchema = new mongoose.Schema({
  weight: Number,
  date: {type: Date, default: Date.now}
});

const BodyWeight = mongoose.model("BodyWeight", bodyWeightSchema);


// Summary
///////////////////////////////////////////////////////


app.get("/", function (req, res) {
  const newestEntryInSetsCollection = Set.findOne({}, {date: 1}, {sort: {"date" : -1}}, function (err, found) {if (err) {
    console.log(err);
  } else {
    if (!found) {
      // RENDERING DATA IN CASE OF LACK OF EXERCISES
      /////////////////////////////////////////////////////////////////////////
      let emptyObject = [{reps: 0,
      weight: 0,
      exercise: "None",
      date: today}];

      res.render('summary', {heading: "Summary", found: emptyObject, today: today, lastFoundDateShort: today});
    }
    return found
  }
  });

  // UnhandledPromiseRejectionWarning
  /////////////////////////////////////////////////////////////////////////

  newestEntryInSetsCollection.then(function(data) {
    const lastFoundDate = new Date(data.date);
    const lastFoundDateShort = new Date(lastFoundDate.getFullYear(), lastFoundDate.getMonth(), lastFoundDate.getDate());


    const listOfNewest = Set.find({date: { $gte : lastFoundDateShort}}, function(err, found) {
      console.log(found);
      res.render('summary', {heading: "Summary", found: found, lastFoundDateShort: lastFoundDateShort, today: today});
    })
  })
});



app.get("/exercise", function (req, res) {

  Exercise.find({}, function (err, foundExercises) {
    if (foundExercises.length === 0) {

      Exercise.insertMany(defaultExercises, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Items inserted to DB.");
        };
      });
      res.redirect("/exercise");
    } else {
      res.render('exercise', {heading: "Exercise", newExercises : foundExercises});
    }
  });
});
// Custom address
///////////////////////////////////////////////////////

app.get("/exercise/:customExerciseName", function (req,res) {

  const customExerciseName = req.params.customExerciseName;

  Set.find({date: { $gte : today}, exercise: customExerciseName}, function(err, foundSets) {
    res.render('add', {heading: customExerciseName, completed: foundSets})
  })

});

// Calendar - chosen date
///////////////////////////////////////////////////////

app.get("/more/calendar/:customDate", function (req, res) {
  const customDate = req.params.customDate;

  const customDateObject = new Date(customDate);

  const customDatePlusOne = new Date(customDate);

  customDatePlusOne.setDate(customDatePlusOne.getDate() + 1);

  const customDateInShortFormat = customDateObject.getFullYear() +"/" + (customDateObject.getMonth() +1 ) +"/" + customDateObject.getDate();


  Set.find({ $and: [{date: { $gte: customDate} }, {date: { $lt: customDatePlusOne}}]},function(err, found) {
    res.render('calendarSummary', {heading: "Summary", customDate: customDateInShortFormat, found: found});
  })

})



// Add sets and weight to setsSchema
///////////////////////////////////////////////////////

app.post("/exercise/:customExerciseName", function (req, res) {
  const customExerciseName = req.params.customExerciseName;
  const reps = req.body.newSet;
  const weight = req.body.newWeight;

  const set = new Set ({
    reps: reps,
    weight: weight,
    exercise: customExerciseName
  });

  set.save();

  res.redirect("/exercise/" + customExerciseName)
})





// Add new exercise to exercisesSchema
///////////////////////////////////////////////////////
app.post("/exercise", function (req, res) {
  const name = req.body.exerciseName;

  const exercise = new Exercise ({
    name: name
  });

  exercise.save();

  res.redirect("/exercise");

})



// Editing exercises
///////////////////////////////////////////////////////

app.post("/exercise/change/:customExerciseName", function (req, res) {
  const customExerciseName = req.params.customExerciseName;
  const newName = req.body.exerciseName;

  Exercise.findOneAndUpdate({name: customExerciseName}, {name: newName}, {
  new: true}, function(err, doc) {
    if (err) {
      console.log(err);
    }
  })

  Set.updateMany({exercise: customExerciseName}, {exercise: newName}, function(err,doc) {
    if (err) {
      console.log(err);
    }
  })
  res.redirect("/exercise");
})


// Deleting exercises
///////////////////////////////////////////////////////
app.post("/exercise/delete/:customExerciseName", function (req, res) {
  const customExerciseName = req.params.customExerciseName;

  Set.deleteMany({exercise: customExerciseName}, function(err, doc) {
    if(err) {
      console.log(err);
    }
  });

  Exercise.deleteOne({name: customExerciseName}, function(err, doc) {
    if(err) {
      console.log(err);
    }
  });

  res.redirect("/exercise");

})


// More
///////////////////////////////////////////////////////

app.get("/more", function (req, res) {
  res.render('more', {heading: "More"});
});

// More - body weight
///////////////////////////////////////////////////////

app.get("/more/bodyweight", function (req, res) {

// Add Find Schema and render

BodyWeight.find({}, function (err, found){
  let arrayOfBodyWeights =[];
  let arrayOfDates = [];
  found.forEach(function(obj) {
    arrayOfBodyWeights.push(obj.weight);
    arrayOfDates.push(obj.date.toString());

  })

  res.render('bodyweight', {heading: "Body Weight", bodyWeightData: arrayOfBodyWeights,
arrayOfDates: arrayOfDates});
  })
});


app.post("/more/bodyweight", function (req, res) {

  const bodyWeight = req.body.bodyWeight;

  // Add bodyWeight to Schema
  const newBodyWeightEntry = new  BodyWeight({
    weight: bodyWeight
  });

  newBodyWeightEntry.save();

  res.redirect("/more/bodyweight");

})


// More - calendar
///////////////////////////////////////////////////////

app.get("/more/calendar", function (req, res) {
  Set.find ({}, function(err, found) {
    if (err) {
      console.log(err);
    }
    let arrayOfDates = [];

    found.forEach(function (item) {
    let itemCreationDate = new Date (item.date.getFullYear(), item.date.getMonth(), item.date.getDate());

    arrayOfDates.push(itemCreationDate.toString());
  })

  const arrayOfUniqueDates = arrayOfDates.filter(function (element, index, array) {
    return !index || element != array[index -1]
  })

    res.render("calendar", {heading: "Calendar", arrayOfUniqueDates: arrayOfUniqueDates});
  })
})


// More - timer
///////////////////////////////////////////////////////

app.get("/more/timer", function (req, res) {
  res.render("timer", {heading: "Timer"});
})





app.get("/exercise/:customExerciseName/history", function (req, res) {
  const customExerciseName = req.params.customExerciseName;
  Set.find({exercise: customExerciseName},{}, {sort: {date : -1}},  function (err, foundSets) {
    if (err) {
      console.log(err);
    } else {
      res.render('history', {heading: customExerciseName, foundSets: foundSets})
    }
  })
})


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen (port, function() {
  console.log("Server has started.");
});
