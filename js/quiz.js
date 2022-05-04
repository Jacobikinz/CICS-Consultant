//To save to database: use getter to get a JSON version of the class
//To retrieve from database: create new Quiz() and use setter with JSON from database

export class Quiz {
    constructor(email, cs_selected, math_selected, science_selected, favorites_selected) {
        this.email = email;
        // Questions in the quiz
        // Answers can have categories; add up # of each category to calculate quiz result
        // Selected must be an array
        //TODO create all questions
        this.questions = [{
                q: "What computer science and informatics courses have you taken?",
                a: [],
                selected: []
            }
        ];
        this.cs_selected = cs_selected;
        this.math_selected = math_selected;
        this.science_selected = science_selected;
        this.favorites_selected = favorites_selected;
    }

    pullFromDB() {
        const cs_questions = this.questions[0];
        if (this.cs_selected !== null) {
            this.cs_selected.forEach((val) => {
                for (let i = 0; i < cs_questions['a'].length; i++) {
                    if (cs_questions['a'][i]['text'] === val) {
                        cs_questions['selected'].push(cs_questions['a'][i]);
                    }
                }
            });
        }
    }

    isComplete() {
        //find number of incomplete questions, return true if there are 0
        return this.questions.filter(question => question.selected ? false : true).length < 1;
    }

    get json() {
        // console.log("here");
        // return {
        //     email: this.email,
        //     questions: this.questions
        // };
        return JSON.parse(JSON.stringify(this));
    }

    //Save answers: use setter with the new JSON
    set answers(json) {
        this.email = json.email;
        this.questions = json.questions;
    }

    //get result if all questions are answered; else undefined
    get result() {
        let categories = {};
        if (this.isComplete()) {
            this.questions.forEach(answer => {
                answer.selected.forEach(selection => {
                    let a = answer.filter(obj => {
                        return obj.text === selection
                    });
                    if (a.length > 0 && a[0].text === selection) {
                        if (categories.hasOwnProperty(selection.category)) {
                            categories[selection.category]++;
                        } else {
                            categories[selection.category] = 1;
                        }
                    }
                });
            });
            return Object.keys(categories).reduce(function(a, b) { return obj[a] > obj[b] ? a : b });
        }
        return undefined;
    }

    async makeCSQuestions() {
        const classes = await fetch("..\\json\\classes.json");
        const classesData = await classes.json();
        this.questions[0]['a'] = [];
        classesData.forEach((elem, index) => {
            // { id: 0, text: "CS 121" }
            this.questions[0]['a'].push({ id: index, text: elem['dept'] + " " + elem['id'] });
        });
    }

}