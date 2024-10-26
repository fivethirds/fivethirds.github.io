/* TODO: 
- User input for nq, minYear and maxYear
- Progress bar showing number of questions answered
- Restart button after score is shown
- Questions review when score is shown - see which answers were correct
*/

const body = document.body;

var Questions = [];
var userAnswers = [];

const max = 2023;
const min = 2004;

let minYear = min;
let maxYear = max;
let nq = 1;

let currQuestion = 0
let score = 0

let numOptions = 8;


home();


function home() {
	body.innerHTML = "";

	let heart = document.createElement('img');
	heart.setAttribute("id", "backgroundImage");
	heart.src = "euroquizzerbg3.png";
	heart.className = "background";
	body.append(heart);

	// document.body.style.backgroundImage = "url('euroquizzerbg3.png')";
	// document.body.style.backgroundSize = "1400px";

	let logo = document.createElement('div');
	logo.className = "logo";
	logo.style = "margin-bottom:0px; padding-bottom:0px;"
	logo.setAttribute("id", "logo");
	
	body.append(logo);

	let logotext = document.createElement('img');
	logotext.setAttribute("id", "logotext");
	logotext.className = "large";
	logotext.src = "euroquizzertextwhite2.png";
	logo.appendChild(logotext);

	// let test = document.createElement('p');
	// test.textContent = "sldf";
	// logo.append(test);

	let settingsPanel1 = document.createElement('div');
	settingsPanel1.className = "settingsPanel";
	settingsPanel1.setAttribute("id", "settingsPanel1");
	body.append(settingsPanel1);
	// settingsPanel.textContent = "sldkfj";

	let settingsPanel2 = document.createElement('div');
	settingsPanel2.className = "settingsPanel";
	settingsPanel2.setAttribute("id", "settingsPanel2");
	body.append(settingsPanel2);	

	let minInputText = document.createElement('p');
	minInputText.setAttribute("id", "minInputText");
	minInputText.innerHTML = `Minimum Year <br>`;
	settingsPanel1.appendChild(minInputText);

	let minInput = document.createElement('input');
	minInput.type = 'number';
	minInput.setAttribute("id", "minInput");
	minInput.placeholder = `ex. 2004`;
	minInputText.appendChild(minInput);

	let maxInputText = document.createElement('p');
	maxInputText.setAttribute("id", "maxInputText");
	maxInputText.innerHTML = `Maximum Year <br>`;
	settingsPanel1.appendChild(maxInputText);

	let maxInput = document.createElement('input');
	maxInput.type = 'number';
	maxInput.setAttribute("id", "maxInput");
	maxInput.placeholder = `ex. 2023`;
	maxInputText.appendChild(maxInput);

	let nqInputText = document.createElement('p');
	nqInputText.setAttribute("id", "nqInputText");
	nqInputText.textContent = "Number of Questions";
	// nqInputText.textContent += "";
	settingsPanel2.appendChild(nqInputText);

	let nqInput = document.createElement('input');
	nqInput.type = 'number';
	nqInput.setAttribute("id", "nqInput");
	nqInput.placeholder = `ex. 25`;
	nqInputText.appendChild(nqInput);

	let noInputText = document.createElement('p');
	noInputText.setAttribute("id", "noInputText");
	noInputText.textContent = "Number of Options";
	settingsPanel2.appendChild(noInputText);

	let noInput = document.createElement('input');
	noInput.type = 'number';
	noInput.setAttribute("id", "noInput");
	noInput.placeholder = `ex. 6`;
	noInputText.appendChild(noInput);



	minInput.addEventListener("change", (event) => {
		minYear = event.target.value;
		console.log("min year updated");
	});

	maxInput.addEventListener("change", (event) => {
		maxYear = event.target.value;
		console.log("max year updated");
	});
	
	nqInput.addEventListener("change", (event) => {
		nq = event.target.value;
		console.log("number of questions updated");
	});

	noInput.addEventListener("change", (event) => {
		numOptions = event.target.value;
		console.log("number of options updated");
	});

	let bbb = document.createElement('button');
	bbb.setAttribute("id","start");
	bbb.classList.add('start');
	bbb.textContent = `Begin Quiz`;
	bbb.setAttribute("onClick", "javascript: startQuiz(nq,minYear,maxYear);")
	body.appendChild(bbb);
}

function startQuiz(num, min, max) {
	body.innerHTML = "";
	
	let heart = document.createElement('img');
	heart.setAttribute("id", "backgroundImage");
	heart.src = "euroquizzerbg3.png";
	heart.className = "background";
	body.append(heart);

	if(min > 2023 || min > max || max < 2004) {
		return;
	}

	//clear information from previous quiz
	currQuestion = 0;
	score = 0;
	Questions = [];
	userAnswers = [];

	let p = document.createElement('div');
	p.setAttribute("id", "panel");
	p.className = "panel";
	body.append(p);

	p.innerHTML = "";

	//Create Header
	let hh = document.createElement('h1');
	hh.setAttribute("id", "head");
	hh.textContent = `Quiz: Eurovision Acts from ${min} to ${max}`;
	p.appendChild(hh);

	//Create Question div
	let qq = document.createElement('div');
	qq.setAttribute("id","ques");
	qq.className = "question";
	p.appendChild(qq);

	//Create Options div
	let oo = document.createElement('div');
	oo.setAttribute("id", "opt");
	oo.className = "options";
	p.appendChild(oo);

	//Create submit button
	let bb = document.createElement('button');
	bb.setAttribute("id","btn");
	bb.textContent = `Next`;
	bb.setAttribute("onClick", "javascript: checkAns();")
	p.appendChild(bb);

	generateQuestions(num, min, max);
	loadQues();
}

function generateQuestions(nq, minYear, maxYear) {

	//create songPool based on year boundaries
	var songPool = new Map([]);
	songs.forEach((values,keys) => {
		let y = keys[1];
		if(minYear <= y && maxYear >= y) {
			songPool.set(keys, values);
		}
	})
	
	//select songs from songPool based on desired number of questions
	var selectedSongs = new Map([]);
	const arr = Array.from(songPool.keys());
	var usedIndices = [];
	while(selectedSongs.size < nq) {
		let r = Math.floor(Math.random()*arr.length);
		if(!usedIndices.includes(r)) {
			let k = arr[r];
			let v = songPool.get(arr[r]);
			selectedSongs.set(k,v);
			usedIndices.push(r);
		}
	}

	//make each selected song into a question
	selectedSongs.forEach((values, keys) => {
		// console.log(values[1], keys[0])
		let n = {
			q: "Which act represented " + keys[0] + " in " + keys[1] + "?",
			a: [
				// { text:"", isCorrect:false },
				// { text:"", isCorrect:false },
				// { text:"", isCorrect:false },
				// { text:"", isCorrect:false },
			]
		}

		for(let i = 0; i < numOptions; i+=1) {
			let o = { text:"", isCorrect:false };
			n.a.push(o);
		}

		let r = Math.floor(Math.random()*numOptions);
		n.a[r].isCorrect = true;
		n.a[r].text = values[1] + " by " + values[0];

		//generate random wrong answers
		let index = arr.indexOf(keys);
		arr.splice(index, 1); //remove the correct answer from pool of possible wrong answers
		var s = new Set([]);
		for(let i = 0; i < n.a.length; i+=1) {
			if(i!=r) {
				let found = false;
				while(!found) {
					let r1 = Math.floor(Math.random()*arr.length);
					if(!s.has(r1)) {
						n.a[i].text = songs.get(arr[r1])[1] + " by " + songs.get(arr[r1])[0];
						found = true;
						s.add(r1);
						console.log(r1 + " " + arr[r1]);
					}
				}
			}
		}
		arr.splice(index,0,keys); //put correct answer back in
		Questions.push(n);
	})
}



function loadQues() {
	const question = document.getElementById("ques")
	const opt = document.getElementById("opt")

	question.textContent = Questions[currQuestion].q;
	opt.innerHTML = "";

	for (let i = 0; i < Questions[currQuestion].a.length; i++) {
		const choicesdiv = document.createElement("div");
		choicesdiv.style = "height:100%;"
		// choicesdiv.className = "div";
		const choice = document.createElement("input"); //circle thing
		const choiceLabel = document.createElement("label"); // actual text next to circle thing
		id = `choice${i}`
		choice.setAttribute("id", id);
		choiceLabel.setAttribute("for", id);

		choice.type = "radio";
		choice.name = "answer";
		choice.value = i;

		choiceLabel.textContent = Questions[currQuestion].a[i].text;

		// choiceLabel.insertBefore(choice, choiceLabel.firstChild);
		choicesdiv.appendChild(choice);
		choicesdiv.appendChild(choiceLabel);
		opt.appendChild(choicesdiv);
	}
}

function loadScore() {
	let p = document.getElementById("panel");
	p.innerHTML = "";

	let sc = document.createElement('h2');
    sc.setAttribute("id", "score");
	sc.textContent = `You scored ${score} out of ${Questions.length}`
	p.appendChild(sc);

	let bb = document.createElement('button');
	bb.setAttribute("id","reset");
	bb.textContent = `Home`;
	bb.setAttribute("onClick", "javascript: home()")
	p.appendChild(bb);

	let p1 = document.createElement('panel');
	p1.className = "panel";
	p1.style = "margin-top:0px;"
	p1.setAttribute("id", "panel1");
	body.appendChild(p1);

	let rv = document.createElement('h1');
	rv.setAttribute("id", "review");
	rv.textContent = "Review";
	rv.style = "margin-bottom:0px;"
	p1.appendChild(rv);

	for(let i = 0; i < Questions.length; i++) {
		loadReviewQues(i);
	}

}

function loadReviewQues(i) {
	let p = document.getElementById("panel1");

	let qq = document.createElement('div');
	qq.setAttribute("id","ques");
	qq.className = "question";
	qq.textContent = Questions[i].q;
	qq.style = "padding-top:5%;"
	p.appendChild(qq);

	let oo = document.createElement('div');
	oo.setAttribute("id", "opt");
	oo.className = "options";
	p.appendChild(oo);	

	for (let j = 0; j < Questions[i].a.length; j++) {
		const choiceLabel = document.createElement("label");
		choiceLabel.textContent = Questions[i].a[j].text;
		if(j==userAnswers[i]) {
			choiceLabel.style = "box-shadow: inset 0.2em 0.2em rgb(180, 50, 50), inset -0.2em -0.2em rgb(180, 50, 50); color:rgb(56, 53, 120);"
		}
		if(Questions[i].a[j].isCorrect) {
			choiceLabel.style = "box-shadow: inset 0.2em 0.2em rgb(50, 140, 80), inset -0.2em -0.2em rgb(50, 140, 80);"
		}
		oo.appendChild(choiceLabel);
	}
}

function nextQuestion() {
	for(let i = 0; i < userAnswers.length; i++) console.log(userAnswers[i]);
	if (currQuestion < Questions.length - 1) {
		currQuestion++;
		loadQues();
	} else {
		loadScore();
	}
}

function checkAns() {
	const selectedAns = parseInt(document.querySelector('input[name="answer"]:checked').value);

	userAnswers.push(selectedAns);// excludes the 'isCorrect' part

	if (Questions[currQuestion].a[selectedAns].isCorrect) {
		score++;
		console.log("Correct")
		nextQuestion();
	} else {
		nextQuestion();
	}
}
