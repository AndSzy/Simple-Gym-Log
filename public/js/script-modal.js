const openModalButtons = document.getElementById('exerciseBtn');
const closeModalButtons = document.getElementById('modalCloseBtn');
const overlay = document.getElementById('overlay');
const modal = document.getElementById('modal')

openModalButtons.addEventListener('click', function () {
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
    const tittle = document.getElementById('tittle');
    tittle.innerHTML = "<div class='tittle'>" + btn.id + "</div>"
    const body = document.getElementById('modal-body');
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
    const tittle = document.getElementById('tittle');
    tittle.innerHTML = "<div class='tittle'>" + btn.id + "</div>"
    const body = document.getElementById('modal-body');
    body.innerHTML = '<form action="/exercise/delete/' +btn.id +'" method="post" >' +
    '<button type="submit" name="button" id="deleteBtn">DELETE</button>' +
    '</form>'
    modal.classList.add('active');
    overlay.classList.add('active');
  })
})
