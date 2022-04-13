const fname = document.getElementById('fname');
const lname = document.getElementById('lname');
const email = document.getElementById('email');
const password = document.getElementById('password');
const signupButton = document.getElementById('save');
const resetButton = document.getElementById('clear');
const validateSignup = document.getElementById('signupstatus');

resetButton.addEventListener('click', (e) => {
    fname.value = '';
    lname.value = '';
    email.value = '';
    password.value = '';
});

signupButton.addEventListener('click', async (e) => {
    const response = await fetch(`/signupUser`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fname: fname.value, lname: lname.value, email: email.value, password: password.value }),
    });
    const data = await response.json();
    validateSignup.innerHTML = '<br>' + JSON.stringify(data).replaceAll('"', '');
    document.cookie = '{ "useremail": "' + email.value + '" }';
    document.location.href = 'profile.html';
});