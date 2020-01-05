const reps = document.getElementById("reps");
const addRepsBtn = document.getElementById("addReps");
const subRepsBtn = document.getElementById("subReps");
const weight = document.getElementById("weight");
const addWeightBtn = document.getElementById("addWeight");
const subWeightBtn = document.getElementById("subWeight");


addRepsBtn.addEventListener('click',function (event) {
  reps.value = (parseInt(reps.value,10) + 1) || 0;
});

subRepsBtn.addEventListener('click',function (event) {
  reps.value = (parseInt(reps.value,10) - 1) || 0;
});

addWeightBtn.addEventListener('click',function (event) {
  weight.value = (parseInt(weight.value,10) + 1) || 0;
});

subWeightBtn.addEventListener('click',function (event) {
  weight.value = (parseInt(weight.value,10) - 1) || 0;
});
