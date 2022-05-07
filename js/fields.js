import { setServerLoggedIn } from './multiuser.js';

setServerLoggedIn();

async function getRecommendation() {
    if (await isLoggedIn() === true) {
        const response = await fetch('/loadQuiz', {
            method: 'PUT',
            body: JSON.stringify({
                email: document.cookie.split('=')[1],
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();

        if (data['curr_recommendation'] !== null) {
            const recommendation_div = document.getElementById('recommendation-container');
            const recommendationHeader = document.createElement('h1');
            recommendationHeader.innerText = 'Your Recommended Field is: ' + data['curr_recommendation'];
            recommendation_div.appendChild(recommendationHeader);
        }
    }
}

async function isLoggedIn() {
    let data = null;
    const response = await fetch('/checkLoggedIn', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    data = await response.json();
    return (data === 'true');
}

await getRecommendation();