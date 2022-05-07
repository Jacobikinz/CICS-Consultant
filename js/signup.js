import { setServerLoggedIn } from './multiuser.js';

setServerLoggedIn();

const fname = document.getElementById('fname');
const lname = document.getElementById('lname');
const email = document.getElementById('email');
const password = document.getElementById('password');
const signupButton = document.getElementById('save');
const resetButton = document.getElementById('clear');

resetButton.addEventListener('click', () => {
    fname.value = '';
    lname.value = '';
    email.value = '';
    password.value = '';
});

signupButton.addEventListener('click', async () => {
    const response = await fetch('/signupUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fname: fname.value, lname: lname.value, email: email.value, password: password.value }),
    });
    if (response.status === 200) {
        document.location.href = 'login.html';
    } else {
        document.location.href= 'register.html';
    }
});