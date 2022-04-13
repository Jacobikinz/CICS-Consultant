// Will implement the functionality to look people up with email once hooked up to DB
// const fnameinfo = document.getElementById('fnameinfo');
// const lnameinfo = document.getElementById('lnameinfo');
const emailinfo = document.getElementById('emailinfo');
const userEmailCookie = JSON.parse(document.cookie)['useremail'];

// fnameinfo.innerText = "First name: " + curruser['fname'];
// lnameinfo.innerText = "Last name: " + curruser['lname'];
emailinfo.innerHTML = "&nbsp;&nbsp;Email: " + userEmailCookie;

// Update information button can change email locally
const infolabel = document.getElementById('newemaillabel');
const newemail = document.getElementById('newemail');
const newEmailButton = document.getElementById('confirm-new-email');
const updateInfoButton = document.getElementById('updatebutton');
updateInfoButton.addEventListener('click', (e) => {
    infolabel.classList = "visible";
    newemail.classList = "visible";
    newEmailButton.classList = "btn btn-warning visible";
});

const newinfores = document.getElementById('newinforesponse');
newEmailButton.addEventListener('click', async (e) => {
    document.cookie = '{ "useremail": "' + newemail.value + '" }';
    const response = await fetch(`/newInfo`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ oldemail: userEmailCookie, newemail: newemail.value }),
    });
    const data = await response.json();
    console.log(data);
    newinfores.innerHTML = "<br> " + JSON.stringify(data);
});