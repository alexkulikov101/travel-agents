var inputWhere = document.querySelector(".form__input-where");
var inputWhen = document.querySelector(".form__input-when");
var inputDuration = document.querySelector(".form__input-duration");
var labelWhen = document.querySelector(".form__label-when");
var labelWhere = document.querySelector(".form__label-where");
var labelDuration = document.querySelector(".form__label-duration");
var btn = document.querySelector(".form__btn");
var slider = document.querySelector(".slider");
var form = document.querySelector(".form");

if (window.matchMedia("(max-width: 670px)").matches) {
  form.style = "height: 60px";
  inputWhere.addEventListener("focus", function() {
    form.style = "height: 239px !important;";
    form.style.marginBottom = "0px";
    slider.style = "height: 717px";
    inputWhen.style.display = "flex";
    labelWhen.style.display = "flex";
    inputDuration.style.display = "flex";
    labelDuration.style.display = "flex";
    btn.style.display = "flex";
  });
}
if (window.matchMedia("(min-width: 671px)").matches) {
  form.style = "height: 88px";
}

inputWhen.addEventListener("focus", function() {
  labelWhen.style.display = "none";
});

inputWhen.addEventListener("blur", function() {
  labelWhen.style.display = "flex";
});
// inputWhere.addEventListener("blur", function() {
//   labelWhere.style.display = "none";
// });

inputDuration.addEventListener("focus", function() {
  labelDuration.style.display = "none";
});

inputDuration.addEventListener("blur", function() {
  labelDuration.style.display = "flex";
});

function myFunction(x2) {
  if (x2.matches) {
    form.style = "height: auto";
    form.style = "marginBottom: 0px";
  } else {
    form.style = "height: 88px";
  }
}

var x2 = window.matchMedia("(max-width: 670px)");
myFunction(x2); // Call listener function at run time
x2.addListener(myFunction); // Attach listener function on state changes
