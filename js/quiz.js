//To save to database: use getter to get a JSON version of the class
//To retrieve from database: create new Quiz() and use setter with JSON from database

class Quiz {
    constructor(name) {
        this.email = email;
        // Questions in the quiz
        //answers have categories; add up # of each category to calculate quiz result
        this.questions = [{
                id: 0,
                q: "What computer science courses have you taken?",
                a: [{ id: 0, text: "CS_121" },
                    { id: 1, text: "CS_186" },
                    { id: 2, text: "CS_250" },
                ],
                selected: undefined
            },
            {
                id: 1,
                q: "Out of the CS classes you chose, which ones have you enjoyed the most?",
                //TODO add logic to only use the selected classes from question 0
                a: [{ id: 0, text: "CS_121", category: "category" },
                    { id: 1, text: "CS_186", category: "category" },
                    { id: 2, text: "CS_250", category: "category" },
                ],
                selected: undefined
            },
        ];
    }

    isComplete() {
        //find number of incomplete questions, return true if there are 0
        return questions.filter(question => question.selected ? false : true).length < 1;
    }

    get json() {
        return {
            email: this.email,
            questions: this.questions
        };
    }

    set answers(json) {
        this.email = json.email;
        this.questions = json.questions;
    }

}