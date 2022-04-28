import { Quiz } from './quiz.js';


let quiz = null;
if (isLoggedIn()) {
    const response = await fetch('/loadQuiz', {
        method: 'PUT',
        body: JSON.stringify({
            email: JSON.parse(document.cookie)['useremail'],
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);
    quiz = new Quiz(JSON.parse(document.cookie)['useremail'], data['cs_chosen'], data['math_chosen'], data['science_chosen'], data['favorites_chosen']);
    quiz.pullFromDB();
} else {
    quiz = new Quiz("guest", [], [], [], []);
}

// async function isLoggedIn() {
//     return (sessionStorage.getItem('status') != null);
// }

function isLoggedIn() {
    return (document.cookie !== '{}' && document.cookie !== '');
}

// dynamically create quiz frontend
const quiz_container = document.getElementById('quiz-container');

// TODO

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
    
    // console.log(isLoggedIn());
    if (isLoggedIn()) {
        await saveUpdate();
    }
}

renderQuiz();

async function saveUpdate() {
    // console.log(quiz);
    const response = await fetch('/updateQuiz', {
        method: 'PUT',
        body: JSON.stringify({
            email: JSON.parse(document.cookie)['useremail'],
            quiz: quiz.json
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
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