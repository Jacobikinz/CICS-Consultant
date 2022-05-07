const profileButton = document.getElementById('profilebutton');

profileButton.addEventListener('click', async () => {
    if (document.location['pathname'].startsWith('/html/profile')) {
        document.location.href = '../profile.html';
    } else {
        document.location.href = 'profile.html';
    }
});

const signoutButton = document.getElementById('signoutbutton');

signoutButton.addEventListener('click', async () => {
    document.cookie = '';
    await fetch('/signoutUser', {
        method: 'PUT',
    });
    document.location.href = 'home.html';
});