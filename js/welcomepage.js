import { Quiz } from './quiz.js';
let quiz = new Quiz("email");

const questions = [];
questions.push(document.getElementById('CS-courses-dd'));
questions.push(document.getElementById('math-courses-dd'));
questions.push(document.getElementById('science-courses-dd'));


function ddUpdateQuiz(e, i) {
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
}

for (let i = 0; i < questions.length; i++) {
    questions[i].addEventListener("change", e => ddUpdateQuiz(questions[i], i));
}
