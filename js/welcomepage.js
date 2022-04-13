import { Quiz } from './quiz.js';
let quiz = new Quiz("email");

let x = document.getElementById('CS-courses-dd');

console.log(x);

function updateQuiz(e) {
    let selectedvals = [];
    for (let i = 0; i < x.length; i++) {
        let curroption = x.options[i];
        if (curroption.selected === true) {
            selectedvals.push(curroption.label);
        }
    }
    console.log(selectedvals);
    const json = quiz.json;
    json.questions[0].selected = selectedvals;
    quiz.answers = json;
    console.log(quiz.json);
}

x.addEventListener("change", updateQuiz);