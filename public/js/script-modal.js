const openModalButtons = document.getElementById('exerciseBtn');
const closeModalButtons = document.getElementById('modalCloseBtn');
const overlay = document.getElementById('overlay');
const modal = document.getElementById('modal')

const tittle = document.getElementById('tittle');
const body = document.getElementById('modalBody');


openModalButtons.addEventListener('click', function () {

  tittle.innerHTML = "<div class='tittle'>Add Exercise</div>"
  body.innerHTML = '<form action="/exercise" method="post" >' +
    '<input type="text" name="exerciseName" placeholder="Exercise Name" required>' +
    '<button type="submit" name="button" class="smallBtn" id="modalPlus">+</button>'+
    '</form>'

  modal.classList.add('active');
  overlay.classList.add('active');
});

closeModalButtons.addEventListener('click', function () {
  modal.classList.remove('active');
  overlay.classList.remove('active');
});


// edit buttons
// /////////////////////////////////////////////////////////////////////
const editBtns = document.querySelectorAll(".editBtn");

editBtns.forEach(function(btn) {
  btn.addEventListener('click', function () {

    tittle.innerHTML = "<div class='tittle'>" + btn.id + "</div>"

    body.innerHTML = '<form action="/exercise/change/' +btn.id +'" method="post" >' +
    '<input type="text" name="exerciseName" placeholder="New name" required>' +
    '<button type="submit" name="button" class="smallBtn" id="modalPlus">+</button>' +
    '</form>'

    modal.classList.add('active');
    overlay.classList.add('active');
  })
})



const deleteBtns = document.querySelectorAll(".deleteBtn");

deleteBtns.forEach(function(btn) {
  btn.addEventListener('click', function () {

    tittle.innerHTML = "<div class='tittle'>" + btn.id + "</div>"

    body.innerHTML = '<form action="/exercise/delete/' +btn.id +'" method="post" >' +
    '<button type="submit" name="button" id="deleteBtn">DELETE</button>' +
    '</form>'
    modal.classList.add('active');
    overlay.classList.add('active');
  })
})
