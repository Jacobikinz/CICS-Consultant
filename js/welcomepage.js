import { Quiz } from './quiz.js';
import { setServerLoggedIn } from './multiuser.js'

setServerLoggedIn();

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

function isLoggedIn() {
    return (document.cookie !== '{}' && document.cookie !== '');
}

// dynamically create quiz frontend
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


const fields = await fetch("..\\json\\fields.json");
const fieldsData = await fields.json();
console.log(fieldsData);

let userRanked = [];

const selectedButton = document.getElementById('finished-selecting-button');
const rankClassesContainer = document.getElementById('rank-classes-container');
selectedButton.addEventListener('click', async (e) => {
    const instructions = document.createElement('h2');
    instructions.innerText = 'Please Rank All The CS Classes You Have Completed From 1 (hated it) to 5 (loved it)'
    rankClassesContainer.appendChild(instructions);
    quiz.questions[0]['selected'].forEach(element => {
        let className = document.createTextNode(element['text']);
        rankClassesContainer.appendChild(className);
        const radioDiv = document.createElement('div');
        radioDiv.innerHTML =  `
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="${element['text']}-inlineRadioOptions" id="${element['text']}-inlineRadio1" value="${element['text']}-1">
          <label class="form-check-label" for="inlineRadio1">1 (hated the course)</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="${element['text']}-inlineRadioOptions" id="${element['text']}-inlineRadio2" value="${element['text']}-2">
          <label class="form-check-label" for="inlineRadio2">2</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="${element['text']}-inlineRadioOptions" id="${element['text']}-inlineRadio3" value="${element['text']}-3">
          <label class="form-check-label" for="inlineRadio3">3 (neutral)</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="${element['text']}-inlineRadioOptions" id="${element['text']}-inlineRadio4" value="${element['text']}-4">
          <label class="form-check-label" for="inlineRadio3">4</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="${element['text']}-inlineRadioOptions" id="${element['text']}-inlineRadio5" value="${element['text']}-5">
          <label class="form-check-label" for="inlineRadio3">5 (loved the course))</label>
        </div>
        <br> <br>`;
        console.log(`"${element['text']}-1"`)
        rankClassesContainer.appendChild(radioDiv);
    });
    const finishedRankingBttn = document.createElement('button');
    finishedRankingBttn.classList.add('btn', 'btn-warning', 'btn-lg');
    finishedRankingBttn.id = 'finished-ranking-button';
    finishedRankingBttn.innerText = "Click When Finished Ranking Classes";
    rankClassesContainer.appendChild(finishedRankingBttn);
    finishedRankingBttn.addEventListener('click', async (e) => {
        const ele = document.getElementsByTagName('input');
            
        for(let i = 0; i < ele.length; i++) {
            if (ele[i].type="radio") {
                if (ele[i].checked) {
                    console.log(ele[i].value);
                    // document.getElementById("result").innerHTML
                    //         += ele[i].name + " Value: "
                    //         + ele[i].value + "<br>";
                    userRanked.push(ele[i].value);
                }
            }
        }
        console.log(userRanked);

        giveField();
    });
});

function giveField() {
    let scores = {};
    fieldsData.forEach((elem) => {
        scores[elem['field']] = 0;
    });
    console.log(scores);

    userRanked.forEach((elem) => {
        let className = elem.split("-")[0].substring(2).trim();
        let ranking = parseInt(elem.split("-")[1]);
        fieldsData.forEach((field) => {
            field['classes'].forEach((fieldClass) => {
                if (className.localeCompare(fieldClass) === 0) {
                    scores[field['field']] += ranking;
                }
            });
        });
    });
    console.log(scores);
    
}