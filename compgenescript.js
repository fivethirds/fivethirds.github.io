//TODO: add coefficient of inbreeding
//calculated as half the genetic similarity of one's parents
let people = [];
let n = 0; //0 = add, 1 = delete, 2 = analyze

let descendentsArray = [[0]];
let coancestryArray = [];
let COIsFound = false;
let COIArray = [];

let addingChildren = false;
let lc = null;

let findingGS = false;
let lgs = null;

let mode = 0;

const ns = 17;

// for(let i = 0; i < n; i++) {
//     let person = {
//         parents:[],
//         children:[]
//     }
//     people.push(person);
// }

function getGeneration(n, g) {
    let person = people[n];
    if(g<0) {
        let pars = person.parents;
        for(let i = 0; i < pars.length; i++) {
            let parent = pars[i];
            console.log(`Getting ${parent}s ${g+1}th gen`);
            getGeneration(parent, g+1);
        }
        if(pars.length < 1) console.log(`Could not retrieve ancesters through ${n}`);
    }
    else if(g == 0) {
        console.log(`${n}`);
    }else {
        let chil = person.children;
        for(let i = 0; i < chil.length; i++) {
            let child = chil[i];
            console.log(`Getting ${child}s ${g-1}th gen`);
            getGeneration(child, g-1);
        }
        if(chil.length < 1) console.log(`Could not retrieve descendants through ${n}`);
    }
}

let cc = [];
let v = [];
let s = 0; //similarity 
for(let i = 0; i < n; i++)  {
    v.push(false);
}


function uncorrectedCOR(st, t, curPath, visited, dir, total) { // add up/down directions. 0 = up, 1 = down
    if(st==t) {
        curPath.push(st);
        // console.log(`${curPath}`);
        let result = 0.5 ** (curPath.length - 1); 
        curPath.pop();
        // console.log(`total from ${st} to ${t} is ${result}`);
        return result;
    }

    if(visited[st])return 0;

    let node = people[st]; let target = people[t];
    let chil = node.children;
    let pars = node.parents;
    visited[st] = true;
    curPath.push(st);

    if(dir == 0) {
        for(let i = 0; i < pars.length; i++) {
            total += uncorrectedCOR(pars[i], t, curPath, visited, 0, 0);
            // console.log(`added from ${pars[i]} to ${t}, total is now ${total}`);
        }    
    }

    for(let i = 0; i < chil.length; i++) { 
        total += uncorrectedCOR(chil[i], t, curPath, visited, 1, 0);
        // console.log(`added from ${chil[i]} to ${t}, total is now ${total}`);

    }
    curPath.pop();
    visited[st] = false;
    // console.log(`total from ${st} to ${t} is ${total}`);
    return total;
}

function coancestry(st, t, curPath, visited, dir, f, total) {
        if(st==t) {
            curPath.push(st);
            // console.log(`${curPath}`);
            if(dir===0) {
                if(!COIsFound) f = COI(st);
                else f = COIArray[st];
            }
            // console.log(`ancestor's COI was ${f}`);            
            let result = (1+f) * 0.5 ** (curPath.length); 
            curPath.pop();
            return result;
        }
    
        if(visited[st])return 0;
    
        let node = people[st]; let target = people[t];
        let chil = node.children;
        let pars = node.parents;
        visited[st] = true;
        curPath.push(st);
    
        if(dir == 0) {
            for(let i = 0; i < pars.length; i++) total += coancestry(pars[i], t, curPath, visited, 0, 0, 0);    
        }
    
        for(let i = 0; i < chil.length; i++)  {
            if(dir === 0 ) {
                if(!COIsFound) total += coancestry(chil[i], t, curPath, visited, 1, COI(st), 0);
                else total += coancestry(chil[i], t, curPath, visited, 1, COIArray[st], 0);
            }
            else total += coancestry(chil[i], t, curPath, visited, 1, f, 0);
        }
        curPath.pop();
        visited[st] = false;
        return total;
}

function COI(a) {
    if(people[a].parents.length < 2) {
        return 0;
    }
    let r = null;
    if(coancestryArray[people[a].parents[0]][people[a].parents[1]] != null) {
        // console.log("coancestry already found");
        r = coancestryArray[people[a].parents[0]][people[a].parents[1]];
    }
    else {
        let vv = [];
        let ccc = [];
        for(let i = 0; i < n; i++) vv.push(false);
        r = coancestry(people[a].parents[0], people[a].parents[1], ccc, vv, 0, 0, 0);
        coancestryArray[people[a].parents[0]][people[a].parents[1]] = r;
    }
    return r;
}

function getAllCOIs() {
    COIArray = [];
    for(let i = 0; i < n; i++) {
        COIArray.push(COI(i));
    }
    COIsFound = true;
    colorBySum();
}

function getQ(a) { // only use when COIs are already found
    let result = 0;
    for(let i = 0; i < people[a].parents.length; i++) {
        result += 0.25 * COIArray[people[a].parents[i]];
    }
    result += 0.5*COIArray[a];
    return result;
}

function colorByCOI() { // not in use - i don't think COI is a good measure to color by 
    for(let i = 0; i < n; i++) {
        let red = 255 - COIArray[i] * 255;
        console.log(red);
        strokeColor = 'rgb(' + 255 + ',' + red +','+ red + ')'
        circlesArray[i].getChildren()[0].fill(strokeColor);
    }
}

function colorBySum() {
    for(let i = 0; i < n; i++) {
        let temp = COIArray[i] * 0.5;
        for(let j = 0; j < people[i].parents.length; j++) {
            temp += COIArray[people[i].parents[j]] * 0.25;
        }
        let red = 255-temp*255;
        strokeColor = 'rgb(' + 255 + ',' + red +','+ red + ')';
        circlesArray[i].getChildren()[0].fill(strokeColor);
    }
}

function resetColors() {
    for(let i = 0; i < n; i++) {
        circlesArray[i].getChildren()[0].fill('white');
        circlesArray[i].getChildren()[0].stroke('black');

    }
    
}

function correctedCOR(a, b) {
    let Fa = COI(a);
    let Fb = COI(b);
    let vv = [];
        let ccc = [];
    let co = coancestry(a,b, ccc, vv, 0, 0, 0);
    // console.log(Fa);
    // console.log(Fb);
    return (2*co)/(Math.sqrt(1+Fa)*Math.sqrt(1+Fb));
}

function makeCoancestryArray() {
    coancestryArray = [];
    for(let i = 0; i < n; i++) {
        let temp = [];
        for(let j = 0; j < n; j++) temp.push(null);
        coancestryArray.push(temp);
    }
}

//NEW TERRITORY - UNCHECKED FUNCTIONS_____________________________________________________________________________________________________________________

function findDescendents(i) { //still be optomized - todo later. this is basically a DFS
    //use a foundDescendents array
    if(people[i].children.length == 0) return;
    else {
        for(let j = 0; j < people[i].children.length; j++) {
            if(people[i].children[j]<i) {
                for(let k = 0; k < descendentsArray[0].length; k++) {
                    if(descendentsArray[people[i].children[j]][k] == 1) descendentsArray[i][k] = 1;
                }
            }
            else  {
            findDescendents(people[i].children[j]);
                for(let k = 0; k < descendentsArray[people[i].children[j]].length; k++) {
                    if(descendentsArray[people[i].children[j]][k] == 1) descendentsArray[i][k] = 1;
                }
            }
            descendentsArray[i][people[i].children[j]] = 1;
        }
    }
}

//WORKZONE ___________________________________________________________________________________________________________________________________________________________________________________

function findAllDescendents() {
    let descendentsFound = [];
    for(let i = 0; i < n; i++) {
        descendentsFound.push(false);
    }
    for(let i = 0; i < n; i++) {
        findDescendents2(i);
    }

    function findDescendents2(i) { // WORK ON THIS!
        console.log(`finding descendents of ${i}...`);
        if(descendentsFound[i]) return;
        if(people[i].children.length == 0)  {
            descendentsFound[i] = true;
            return;
        }
        for(let j = 0; j < people[i].children.length; j++) {
            descendentsArray[i][people[i].children[j]] = 1;
            if(!descendentsFound[people[i].children[j]]) {
                findDescendents2(people[i].children[j]);
            }
            for(let k = 0; k < n; k++) {
                if(descendentsArray[j][k] == 1) descendentsArray[i][k] = 1;
            }
        } 
        descendentsFound[i] = true;
        console.log(`descendents of ${i} found!`);
    
    }
}

//WORKZONE END ___________________________________________________________________________________________________________________________________________________________________________________


function resetDescendents() {
    for(let i = 0; i < descendentsArray.length; i++) {
        for(let j = 0; j < descendentsArray.length; j++) {
            descendentsArray[i][j] = 0;
        }
    }
}

function updateDescendents(i,j) {
    for(let k = 0; k < descendentsArray[j].length; k++) {
        if(descendentsArray[j][k] == 1) {
            for(let m = 0; m < descendentsArray[0].length; m++) {
                if(descendentsArray[m][i] == 1) {
                    descendentsArray[m][k] = 1;
                }
            }
            descendentsArray[i][k] = 1;
        }  
    }

    for(let m = 0; m < descendentsArray[0].length; m++) {
        if(descendentsArray[m][i] == 1) {
            descendentsArray[m][j] = 1;
        }
    }
    descendentsArray[i][j] = 1;
    
}


function expandDescendentsArray() {
    if(n>1) {
        for(let i = 0; i < n-1; i++) {
            descendentsArray[i].push(0);
        }
        let temp = [];
        for(let i = 0; i < n; i++) {
            temp.push(0);
        }
        descendentsArray.push(temp);
    }
}

//END UNCHECKED ZONE________________________________________________________________________________________________________________________________________________

function addPair(p, c) {
    let parent = people[p];
    let child = people[c];
    parent.children.push(c);
    child.parents.push(p);
}


//Konva Section

var stage = new Konva.Stage({
    container: 'container',
    width: window.innerWidth * 1.5,
    height: window.innerHeight*2,    
});


function resizeCanvas() {
    stage.width(window.innerWidth*1.5);
    stage.height(window.innerHeight*2);
    stage.batchDraw(); // Redraw the canvas
  }
  

stage.on('contextmenu', (e) => { //prevents right clicks
    e.evt.preventDefault();
});

var layer = new Konva.Layer();
stage.add(layer);
var circlesArray = []; //array of nodes
var linesArray = []; //array of edges
linesArray = [[null]]; //since we begin with n=0

function reportLines() {
    for(let i = 0; i < linesArray.length; i++) {
        console.log(`Line from ${i}`);
        for(let j = 0; j < linesArray[0].length; j++) {
            if(linesArray[i][j] != null) console.log(`points to ${j}`)
        }
    }
}

function expandLinesArray() { //when n increases, update dimensions of the array of (possible) edges   
    if(n>1) {
    for(let i = 0; i < n-1; i++) {
        let nn = null;
        linesArray[i].push(nn);
    }

    let temp = [];
    for(let i = 0; i < n; i++) {
        temp.push(null);
    }
    linesArray.push(temp);
    }
}

function decLinesArray(i) { //removes the edges incident to the node at index i
        for(let j = 0; j < linesArray.length; j++) { //removes arrows pointing into i
            if(linesArray[j][i] instanceof Konva.Arrow) linesArray[j][i].destroy();
            linesArray[j].splice(i,1);
        }
        for(let j = 0; j < linesArray[i].length; j++) { //removes arrows pointing out of i
            if(linesArray[i][j] instanceof Konva.Arrow) linesArray[i][j].destroy();
        }
        linesArray.splice(i,1); //resizes array
    
}

function decCirclesArray(i) { // removes the node at index i from the circlesArray array
    circlesArray[i].destroy();
    circlesArray.splice(i,1);
    for(let j = i; j < circlesArray.length; j++) {
        circlesArray[j].getChildren()[1].text(`${j}`); //re-numbers the remaining circles
    }
}

function decDescendentsArray(i) {
    for(let j = 0; j < descendentsArray.length; j++) {
        descendentsArray[j].splice(i,1);
    }
    descendentsArray.splice(i,1);
}

function removeFromPeople(i) { //completely removes the person at index i from the people array
    people.splice(i,1);
    for(let j = 0; j < people.length; j++) { //removes i from other people's children lists
        for(let k = 0; k < people[j].children.length; k++) {
            if(people[j].children[k] == i) {
                people[j].children.splice(k,1);
                break;
            }
        }
        for(let k = 0; k < people[j].parents.length; k++) { //removes i from other people's parent lists
            if(people[j].parents[k] == i) {
                people[j].parents.splice(k,1);
                break;
            }
        }
    }

    for(let j = 0; j < people.length; j++) { // re-indexes peoples' children who had indices greater than i
        for(let k = 0; k < people[j].children.length; k++) {
            if(people[j].children[k] > i) {
                people[j].children[k] --;
            }
        }
        for(let k = 0; k < people[j].parents.length; k++) { // re-indexes peoples' parents who had indices greater than i
            if(people[j].parents[k] > i) {
                people[j].parents[k] --;
            }
        }
    }
}

function reType(i) {
    let par = people[i];
    for(let j = 0; j < par.children.length; j++) {
        let child = people[par.children[j]];
        if(child.parents.length === 1) {
            child.type = 0;
        }
    }
}

function makeNode(i, xx, yy) {
    n++;

    var node = new Konva.Group({
        x:xx,
        y:yy,
        draggable:true,
    });
    node.add(new Konva.Circle({ // circle part of the node
        x:0,
        y:0,
        radius:ns,
        fill:'white',
        stroke:'black',
        strokeWidth:4,
    }));
    node.add(new Konva.Text({ // number part of the node
        text:i,
        fill:'black',
        x:-1*ns/2,
        y:-1*ns/2,
        padding:2,
        fontSize:20
    }));

    layer.add(node);
    circlesArray.push(node);

    let person = { //new person currently doesn't have parents or children
        parents:[],
        children:[],
        type:0
    }
    people.push(person); // people array (non Konva) keeps track of everyone's parents/children
}

function showDescendents(i, c) {
    for(let j = 0; j < descendentsArray[i].length; j++) {
        if(descendentsArray[i][j] == 1) {
            circlesArray[j].getChildren()[0].stroke(c);
        }
    }
}

function showAscendents(i) {
    for(let j = 0; j < descendentsArray.length; j++) {
        if(descendentsArray[j][i] == 1) {
            circlesArray[j].getChildren()[0].stroke('cyan');
        }
    }
}

function setArrowHandlers(a, b) {
    let arr = linesArray[a][b];
    if(arr instanceof Konva.Arrow) {
        if(mode == 1) {
            console.log("arrow removal on");
            arr.on('click', ra);
        }
        else {
            console.log("arrow removal off");
            arr.off('click');
        }
    }

    function ra(e) {
        linesArray[a][b].destroy();
        linesArray[a][b] = null;
        let cIndex = people[a].children.indexOf(b);
        people[a].children.splice(cIndex, 1);
        let pIndex = people[b].parents.indexOf(a);
        people[b].parents.splice(pIndex, 1);
        drawLines();
        updateMoving();
        resetDescendents();
        for(let i = 0; i < n; i++) {
            findDescendents(i);
        }

        console.log("arrow removed");
    }
}

function setNodeHandlers(id) { // id is index in circlesArray and people
    let node = circlesArray[id]; //node at index id
    let c = node.getChildren()[0]; //actual circle

    if(mode == 1) {
        node.off('click');
        node.on('click', rs);
    } else if(mode == 0) {
        node.off('click');
        node.on('click', ac);
    } else if(mode == 2) {
        node.off('click');
        node.on('click', gs);
    }
    
    function ac(e) { // adding children - this function is used when mode is 0
        let c = node.getChildren()[0]; //the circle part of our clicked node
        if(!addingChildren) {
            c.stroke('gray');
            addingChildren = true;
            lc = id; // lc: node looking for child; an integer representing the index of the future parent node in both people and circlesArray
        } 
        
        else {
            if(id != lc ) {
                if((people[id].children == null || !people[id].children.includes(lc)) && (people[lc].children == null || !people[lc].children.includes(id)) && (descendentsArray[id][lc] != 1) && (people[id].parents.length < 2)) { //check that there is no existing parent-child relationship between id and lc
                    let par = people[lc];
                    let chil = people[id];
                    par.children.push(id);
                    chil.parents.push(lc);
                    if(people[id].type === 0) {
                        people[id].type = 1;
                    }

                    addingChildren = false; // get out of adding children mode
                    circlesArray[lc].getChildren()[0].stroke('black'); //turn the parent's circle back to black
                    updateDescendents(lc, id);
                    updateMoving(); //makes sure that our new parent-child connection follows when the parent or child is moved
                    drawLines(); //draw our new lines
                }
            }
            else {//if the same node was clicked twice, add no new connections, but take it out of adding children mode
                addingChildren = false;
                circlesArray[lc].getChildren()[0].stroke('black');
            }
        } 
        e.cancelBubble = true; //don't consider a click on a node to be a click on the canvas/stage
    }   

    function rs(e) {
        addingChildren = false;
        if(lc != null) {
            circlesArray[lc].getChildren()[0].stroke('black');
        }
        lc = null;
        n--;
        decCirclesArray(id);
        reType(id);
        removeFromPeople(id);
        if(n>0) decLinesArray(id);
        updateMoving();
        for(let i = 0; i < people.length; i++) {
            setNodeHandlers(i); // realign handlers based on new node ids
        }
        if(n > 0)decDescendentsArray(id);
        resetDescendents();
        for(let i = 0; i < people.length; i++) {
            findDescendents(i);
        }
    }

    function gs(e) {
        let c = node.getChildren()[0];
        console.log(COIArray[id]);

        if(!findingGS) rightBottom.innerHTML = "";

        if(lgs != id) {
            const rightBottom = document.getElementById("rightBottom");
            let profile = document.createElement('div');
            profile.className = "profile";
            rightBottom.appendChild(profile);

            let name = document.createElement('h2');
            name.textContent = `person ${id}`;
            profile.appendChild(name);

            let stats = document.createElement('p');
            stats.innerHTML = "coefficient of inbreeding: <b>" + COIArray[id].toFixed(4) + "</b> <br> Q coefficient: <b>" + getQ(id).toFixed(4) + "</b>";

            profile.appendChild(stats);

            if(findingGS) {
                let relation = document.createElement('div');
                relation.className = "profile";
                relation.innerHTML = "uncorrected COR: <b>" + uncorrectedCOR(lgs, id, cc, v, 0, 0).toFixed(4) + "</b> <br>";
                relation.innerHTML += "corrected COR: <b>" + correctedCOR(lgs, id).toFixed(4) + "</b> <br>";
                relation.innerHTML += "coancestry: <b>" + coancestry(lgs, id, cc, v, 0, 0, 0).toFixed(4) + "</b>";
                rightBottom.appendChild(relation);
            }
        }


        if(!findingGS) {
            showDescendents(id, "rgb(20, 50, 200)");
            c.stroke('gray');
            lgs = id;
            findingGS = true;
        }
        else {
            // console.log(`uncorrected COR: ${uncorrectedCOR(lgs, id, cc, v, 0, 0)}`);
            console.log(`coancestry: ${coancestry(lgs, id, cc, v, 0, 0, 0)}`);
            console.log(`corrected COR: ${correctedCOR(lgs,id)}`);
            // console.log(`looking for genetic similarity between ${lgs} and ${id}`);
            circlesArray[lgs].getChildren()[0].stroke('black');
            showDescendents(lgs, 'black');

            lgs = null;
            findingGS = false;
        }
    }
}

function drawLines() { //update drawing of edges. this is called whenever a new edge is added
    for(let i = 0; i < n; i++) {
        for (let j = 0; j < people[i].children.length; j++) {
            let child = people[i].children[j];
            if(!(linesArray[i][child] instanceof Konva.Arrow)) { //checking that there is not already an arrow between the two in linesArray
                let par = people[i];

                linesArray[i][child] = new Konva.Arrow({ //making a new line between the newly added parent-child pair
                    points:[circlesArray[i].getX(), circlesArray[i].getY(), circlesArray[child].getX(), circlesArray[child].getY()],
                    stroke:"red",
                    pointerLength:30,
                    fill:"red"
                });

                layer.add(linesArray[i][child]);
                linesArray[i][child].moveToBottom(); // keeps edges beneath the nodes
            }
        }
    }
}

function updateMoving() { //makes sure that for each node, when it is dragged, arrows from its parents and children follow it. called when a new node or edge is added
    for(let i = 0; i < n; i++) {
        circlesArray[i].on('dragmove',() => {
            if(i < n) {
                for(let j = 0; j < people[i].children.length; j++) { // makes sure all arrows from a node to its children follow when moved
                    linesArray[i][people[i].children[j]].points()[0] = circlesArray[i].getX();
                    linesArray[i][people[i].children[j]].points()[1] = circlesArray[i].getY();
                }
                for(let j = 0; j < people[i].parents.length; j++) {
                    linesArray[people[i].parents[j]][i].points()[2] = circlesArray[i].getX(); // makes sure all arrows to a node from its parent follow when moved
                    linesArray[people[i].parents[j]][i].points()[3] = circlesArray[i].getY();
                }
            }
        });
    }
}

function handleClick0(e) {
    let xx = parseFloat(stage.getPointerPosition().x);
        let yy = parseFloat(stage.getPointerPosition().y);
        makeNode(n, xx, yy);
        setNodeHandlers(n-1);
        expandLinesArray(); // since n changed (in makeNode), we need to update the size of our linesArray
        expandDescendentsArray();
        updateMoving();
}

if(mode == 0) {
    stage.on('click', handleClick0);
}

window.addEventListener('keydown', e => { // TODO: Set arrow handlers
    if(e.which===77) {
        if(mode == 0)  {
            mode = 1;
            stage.off('click', handleClick0);
            for(let i = 0; i < circlesArray.length; i++) {
                setNodeHandlers(i);
            }
            for(let i = 0; i < linesArray.length; i++) {
                for(let j = 0; j < linesArray[0].length; j++) {
                    setArrowHandlers(i, j);
                }
            }
            resetColors();
            addingChildren = false;
            lc = null;
            document.getElementById("label").textContent = "Delete components";
        }
        else if(mode == 1) {
            mode = 2;
            for(let i = 0; i < circlesArray.length; i++) {
                setNodeHandlers(i);
            }
            for(let i = 0; i < linesArray.length; i++) {
                for(let j = 0; j < linesArray[0].length; j++) {
                    setArrowHandlers(i, j);
                }
            }
            makeCoancestryArray();
            getAllCOIs();
            document.getElementById("label").textContent = "Analyze";

        }
        else if(mode == 2) {
            mode = 0; 
            stage.on('click', handleClick0);
            const rightBottom = document.getElementById("rightBottom");
            rightBottom.innerHTML = "";
            COIsFound = false;
            for(let i = 0; i < circlesArray.length; i++) {
                setNodeHandlers(i);
            }
            for(let i = 0; i < linesArray.length; i++) {
                for(let j = 0; j < linesArray[0].length; j++) {
                    setArrowHandlers(i, j);
                }
            }
            resetColors();
            findingGS = false;
            lgs = null;
            document.getElementById("label").textContent = "Add components";

        }
    }
});
