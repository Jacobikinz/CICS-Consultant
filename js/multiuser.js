export async function setServerLoggedIn() {
    let data = null;
    if (document.cookie !== '') {
        const response = await fetch('/setLoggedIn', {
            method: 'PUT',
            body: JSON.stringify({
                cookies: JSON.parse(document.cookie),
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        data = await response.json();
    }
    const profileButton = document.getElementById('profilebutton');
    const signoutButton = document.getElementById('signoutbutton');
    const signinButton = document.getElementById('signinbutton');
    const registerbutton = document.getElementById('registerbutton');
    if (data === 'true') {
        profileButton.classList.remove('invisible');
        signoutButton.classList.remove('invisible');
        signinButton.classList.add('invisible');
        registerbutton.classList.add('invisible');
    } else {
        profileButton.classList.add('invisible');
        signoutButton.classList.add('invisible');
        signinButton.classList.remove('invisible');
        registerbutton.classList.remove('invisible');
    }
}