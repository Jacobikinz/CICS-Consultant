const signinbutton = document.getElementById('signinbutton');
console.log(signinbutton);

signinbutton.addEventListener("click", function (e) {
    document.location.href = 'login.html';
});

const registerbutton = document.getElementById('registerbutton');
registerbutton.addEventListener("click", function (e) {
    document.location.href = 'signup.html';
});