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

// dynamically create DOM elements
const quiz_container = document.getElementById('quiz-container');

async function renderQuiz() {
    // delete body
    while (quiz_container.firstChild) {
        quiz_container.removeChild(quiz_container.firstChild);
    }

    // create quiz
    for (const question of quiz.questions) {
        // create div, header
        const question_div = document.createElement("div");
        const question_header = document.createElement("header");
        const header_type = document.createElement("H3");
        const header_text = document.createTextNode(question.q);
        header_type.appendChild(header_text);
        question_header.appendChild(header_type);
        question_div.appendChild(question_header);

        // create table
        const question_table = document.createElement("table");
        const table_body = document.createElement("tbody");
        const row = document.createElement("tr");

        const unselected = document.createElement("td");
        unselected.appendChild(document.createTextNode("Options:"));
        unselected.appendChild(document.createElement("br"));
        row.appendChild(unselected);

        const selected = document.createElement("td");
        selected.appendChild(document.createTextNode("Selected:"));
        selected.appendChild(document.createElement("br"));
        row.appendChild(selected);

        table_body.appendChild(row);
        question_table.appendChild(table_body);
        question_div.appendChild(question_table);

        // populate table
        for (const a of question.a) {
            const button = document.createElement("button");
            const button_text = document.createTextNode(a.text);
            button.appendChild(button_text);
            button.addEventListener("click", () => {
                if (question.selected.some(e => e.id === a.id)) {
                    question.selected = question.selected.filter(e => e.id !== a.id);
                } else {
                    question.selected.push(a);
                }
                renderQuiz();
            });

            if (question.selected.some(e => e.id === a.id)) {
                selected.appendChild(button);
            } else {
                unselected.appendChild(button);
            }
        }

        quiz_container.appendChild(question_div);
    }
    
    if (user) {
        await saveUpdate();
    }
}

renderQuiz();

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

/*
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

moveButton

for (let i = 0; i < questions.length; i++) {
    questions[i].addEventListener("change", e => ddUpdateQuiz(questions[i], i));
}
*/