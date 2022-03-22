let x = document.getElementById('CS-courses-dd');

x.addEventListener("change", function(e) {
    let selectedvals = [];
    for (let i = 0; i < x.length; i++) {
        let curroption = x.options[i];
        if (curroption.selected === true) {
            selectedvals.push(curroption.label);
        }
    }
    console.log(selectedvals);
});