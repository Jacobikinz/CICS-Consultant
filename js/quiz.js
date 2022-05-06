// To save to database: use getter to get a JSON version of the class
// To retrieve from database: create new Quiz() and use setter with JSON from database

export class Quiz {
    constructor(email, cs_selected, recommendation) {
        this.email = email;
        // Questions in the quiz
        // Answers can have categories; add up # of each category to calculate quiz result
        // Selected must be an array
        this.questions = [{
            q: 'What computer science and informatics courses have you taken?',
            a: [],
            selected: []
        }
        ];
        this.cs_selected = cs_selected;
        this.recommendation = recommendation;
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
        return JSON.parse(JSON.stringify(this));
    }

    //Save answers: use setter with the new JSON
    set answers(json) {
        this.email = json.email;
        this.questions = json.questions;
    }

    async makeCSQuestions() {
        const classes = await fetch('..\\json\\classes.json');
        const classesData = await classes.json();
        this.questions[0]['a'] = [];
        classesData.forEach((elem, index) => {
            this.questions[0]['a'].push({ id: index, text: elem['dept'] + ' ' + elem['id'] });
        });
    }

}