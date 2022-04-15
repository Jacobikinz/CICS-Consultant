import { Quiz } from './quiz.js';
let quiz = new Quiz("guest");
let user = undefined;

async function isLoggedIn() {
    return (sessionStorage.getItem('status') != null);
}

if (isLoggedIn()) {
    const response = await fetch('/getUser', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (response.status === 200) {
        user = await response.json();
        console.log(user);
        console.log(user.email + " retrieved");
    }
    if (user) {
        quiz.answers = user.quiz;
    }
}

const questions = [];
questions.push(document.getElementById('CS-courses-dd'));
questions.push(document.getElementById('math-courses-dd'));
questions.push(document.getElementById('science-courses-dd'));

async function saveUpdate() {
    const response = await fetch('/newInfo', {
        method: 'PUT',
        body: JSON.stringify({
            oldemail: user.email,
            newemail: user.email,
            quiz: quiz.json
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

async function ddUpdateQuiz(e, i) {
    let selectedvals = [];
    for (let i = 0; i < e.length; i++) {
        let curroption = e.options[i];
        if (curroption.selected === true) {
            selectedvals.push(curroption.label);
        }
    }
    console.log(selectedvals);
    const json = quiz.json;
    json.questions[i].selected = selectedvals;
    quiz.answers = json;
    console.log(quiz.json);
    if (user) {
        await saveUpdate();
    }
}

for (let i = 0; i < questions.length; i++) {
    questions[i].addEventListener("change", e => ddUpdateQuiz(questions[i], i));
}