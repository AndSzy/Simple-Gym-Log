let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

const calendar = document.getElementById('calendarWrapper');

// Dates of work-outs that need to be added to calendar
////////////////////////////////////////////////////////////////


let arrayOfUniqueDatesInDateFormat = [];

arrayOfUniqueDates.forEach(function (date) {
  let current = new Date(date);
  let currentInShortFormat = new Date(current.getFullYear(), current.getMonth(), current.getDate());
  arrayOfUniqueDatesInDateFormat.push(currentInShortFormat);
})

console.log(arrayOfUniqueDatesInDateFormat);
////////////////////////////////////////////////////////////////


const monthAndYear = document.getElementById('monthAndYear');
const months = ['January','February','March','April','May','June','July','August', 'September','October','November','December'];



// Buttons
////////////////////////////////////////////////////////////////
const leftButton = document.getElementById('leftButton');
leftButton.addEventListener('click', function () {
  if (currentMonth === 0) {
    currentYear -=1;
    currentMonth = 11;
  } else {
    currentMonth -=1
  };
  showCallendar(currentMonth,currentYear);
})

const rightButton = document.getElementById('rightButton');
rightButton.addEventListener('click', function () {

  if (currentMonth === 11) {
    currentYear +=1
  }
  currentMonth = (currentMonth + 1) % 12;
  showCallendar(currentMonth,currentYear);
})

// Calendar
////////////////////////////////////////////////////////////////

function showCallendar (month, year) {
  monthAndYear.innerHTML = months[month] +" " + year;

  calendar.innerHTML = "";

  let firstDay = new Date(year,month).getDay();

  for (i= 0; i< firstDay;i++) {
    let div = document.createElement('div');
    calendar.append(div);
  }

  let lastDay = new Date(year,month +1, 0).getDate();


  for (i= 0; i < lastDay; i++) {
    let div = document.createElement('div');
    div.innerHTML = i + 1;
    calendar.append(div);
  }

  // Empty cells at the end
  ////////////////////////////////////////////////////////////////

  const numberOfCells = 35;
  let emptyCells = numberOfCells - lastDay - firstDay;

  for (i= 0; i< emptyCells ;i++) {
    let div = document.createElement('div');
    calendar.append(div);
  }

  // Dates of work-outs that need to be added to calendar
  ////////////////////////////////////////////////////////////////
  const calendarChildren = calendar.children;



  arrayOfUniqueDatesInDateFormat.forEach(function (date) {
    if (date.getFullYear() === year) {
      if(date.getMonth() === month) {
        // Search for correct cell
        ////////////////////////////////////////////////////////////////

        for (let i=0; i<calendarChildren.length; i++) {
          if (calendarChildren[i].innerHTML == date.getDate()) {
            calendarChildren[i].style.backgroundColor = "#c49d9d";
            calendarChildren[i].style.cursor = "pointer";
            calendarChildren[i].addEventListener('click', function () {
              let shortURL = date.getFullYear() +"," + date.getMonth() +"," + date.getDate();

              window.open("/more/calendar/" + date, "_self");
            })
          }
        }


      }
    }
  })


}

showCallendar(currentMonth,currentYear);
