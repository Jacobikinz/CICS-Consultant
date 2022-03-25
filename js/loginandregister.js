const signinbutton = document.getElementById('signinbutton');
console.log(signinbutton);

signinbutton.addEventListener("click", function (e) {
    document.location.href = 'signin.html';
    // console.log('hi');
});

const registerbutton = document.getElementById('registerbutton');
registerbutton.addEventListener("click", function (e) {
    document.location.href = 'register.html';
});