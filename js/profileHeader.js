const profileButton = document.getElementById('profilebutton');

profileButton.addEventListener('click', (e) => {
    document.location.href = 'profile.html';
});

const signoutButton = document.getElementById('signoutbutton');

signoutButton.addEventListener('click', async (e) => {
    document.cookie = "{}";
    const response = await fetch(`/signoutUser`, {
    method: 'PUT',
    });
    const data = await response.json();
    console.log(data);
    document.location.href = 'home.html';
});