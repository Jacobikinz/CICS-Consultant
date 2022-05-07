import { setServerLoggedIn } from './multiuser.js';

setServerLoggedIn();

const emailinfo = document.getElementById('emailinfo');
const userEmailCookie = document.cookie.split('=')[1].split(';')[0];
emailinfo.innerHTML = '&nbsp;&nbsp;Email: ' + userEmailCookie;

// Update information button can change email locally
const newemail = document.getElementById('newemail');
const newEmailButton = document.getElementById('confirm-new-email');
const updateInfoButton = document.getElementById('updatebutton');
const newemailContainer = document.getElementById('newemailcontainer');
updateInfoButton.addEventListener('click', () => {
    newemailContainer.classList = 'visible';
});

const newinfores = document.getElementById('newinforesponse');
newEmailButton.addEventListener('click', async () => {
    const oldcookie = document.cookie;
    document.cookie = ' ';
    document.cookie = 'useremail = ' + newemail.value;
    const response = await fetch('/newInfo', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oldemail: oldcookie.split('=')[1].split(';')[0], newemail: newemail.value }),
    });
    const data = await response.json();
    newinfores.innerHTML = '<br> ' + JSON.stringify(data);
});

const deleteButton = document.getElementById('deletebutton');
deleteButton.addEventListener('click', async () => {
    document.cookie = '';
    const response = await fetch('/deleteUser', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: document.cookie.split('=')[1].split(';')[0] }),
    });
    const data = await response.json();
    newinfores.innerHTML = '<br> ' + JSON.stringify(data);
});