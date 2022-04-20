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
                q: "What computer science courses have you taken?",
                a: [{ id: 0, text: "CS 121" },
                    { id: 1, text: "CS 186" },
                    { id: 2, text: "CS 250" },
                ],
                selected: []
            }, {
                q: "What math courses have you taken?",
                a: [{ id: 0, text: "Math 131" },
                    { id: 1, text: "Math 132" },
                    { id: 2, text: "Math 233" },
                ],
                selected: []
            }, {
                q: "What lab science courses have you taken?",
                a: [{ id: 0, text: "Physics 151" },
                    { id: 1, text: "Physics 152" },
                    { id: 2, text: "Chem 111" },
                    { id: 3, text: "Bio 111" },
                ],
                selected: []
            },
            {
                q: "Out of the CS classes you chose, which ones have you enjoyed the most?",
                //TODO add logic to only use the selected classes from question 0
                a: [{ id: 0, text: "CS 121", category: "category" },
                    { id: 1, text: "CS 186", category: "category" },
                    { id: 2, text: "CS 250", category: "category" },
                ],
                selected: []
            },
        ];
        this.cs_selected = cs_selected;
        this.math_selected = math_selected;
        this.science_selected = science_selected;
        this.favorites_selected = favorites_selected;
    }

    pullFromDB() {
        const cs_questions = this.questions[0];
        this.cs_selected.forEach((val) => {
            for (let i = 0; i < cs_questions['a'].length; i++) {
                if (cs_questions['a'][i]['text'] === val) {
                    cs_questions['selected'].push(cs_questions['a'][i]);
                }
            }
        });

        const math_questions = this.questions[1];
        this.math_selected.forEach((val) => {
            for (let i = 0; i < math_questions['a'].length; i++) {
                if (math_questions['a'][i]['text'] === val) {
                    math_questions['selected'].push(math_questions['a'][i]);
                }
            }
        });

        const science_questions = this.questions[2];
        this.science_selected.forEach((val) => {
            for (let i = 0; i < science_questions['a'].length; i++) {
                if (science_questions['a'][i]['text'] === val) {
                    science_questions['selected'].push(science_questions['a'][i]);
                }
            }
        });

        const fav_questions = this.questions[3];
        this.favorites_selected.forEach((val) => {
            for (let i = 0; i < fav_questions['a'].length; i++) {
                if (fav_questions['a'][i]['text'] === val) {
                    fav_questions['selected'].push(fav_questions['a'][i]);
                }
            }
        });
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

}