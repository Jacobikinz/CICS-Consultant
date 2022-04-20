const email = document.getElementById('email');
const password = document.getElementById('password');
const loginButton = document.getElementById('loginbutton');
const validateLogin = document.getElementById('loginstatus');

loginButton.addEventListener('click', async (e) => {
    console.log('button clicked');
    const response = await fetch(`/loginUser`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'email': email.value,
        'password': password.value,
    },
    });
    const data = await response.json();
    validateLogin.innerHTML = JSON.stringify('<br>' + data['message']).replaceAll('"', '');
    if (response.status === 200) {
        document.cookie = '{ "useremail": "' + email.value + '", "userfname": "' + data['fname'] + '", "userlname": "' + data['lname'] + '"  }';
        document.location.href = 'profile.html';
    }
});