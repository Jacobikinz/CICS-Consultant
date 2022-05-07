import { setServerLoggedIn } from './multiuser.js';

setServerLoggedIn();

const emailinfo = document.getElementById('emailinfo');
const userEmailCookie = document.cookie.split('=')[1].split(';')[0];
emailinfo.innerHTML = '&nbsp;&nbsp;Email: ' + userEmailCookie;

const deleteButton = document.getElementById('deletebutton');
deleteButton.addEventListener('click', async () => {
    document.cookie = '';
    await fetch('/deleteUser', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: document.cookie.split('=')[1].split(';')[0] }),
    });
    document.location.href = 'html/home.html';
});