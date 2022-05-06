const profileButton = document.getElementById('profilebutton');

profileButton.addEventListener('click', () => {
    document.location.href = 'profile.html';
});

const signoutButton = document.getElementById('signoutbutton');

signoutButton.addEventListener('click', async () => {
    document.cookie = '{}';
    await fetch('/signoutUser', {
        method: 'PUT',
    });
    document.location.href = 'home.html';
});