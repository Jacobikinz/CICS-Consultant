const profileButton = document.getElementById('profilebutton');

profileButton.addEventListener('click', async () => {
    // document.location.href = 'profile.html';
    await fetch('/profile', {
        method: 'GET',
    });
});

const signoutButton = document.getElementById('signoutbutton');

signoutButton.addEventListener('click', async () => {
    document.cookie = '';
    console.log(document.cookie);
    await fetch('/signoutUser', {
        method: 'PUT',
    });
    document.location.href = 'home.html';
});