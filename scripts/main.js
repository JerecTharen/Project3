
let theCourse = null;
let playerNum = 0;
let firstDraw = true;
let drawHoleInfo = [];

class TeeType{
    constructor(id,yards, meters,handi,par){
        this.id = id;
        this.myYards = yards;
        this.myMeters = meters;
        this.handi = handi;
        this.myPar = par;
        this.totalPar = 0;
        this.totalYards = 0;
        this.parInTotal = 0;
        this.parOutTotal = 0;
        this.yardsInTotal = 0;
        this.yardsOutTotal = 0;
    }
    caclTotalPar(){
        for (let i = 0; i < this.myPar.length; i++){
            this.totalPar += this.myPar[i];
        }
    }
    calcOutPar(){
        for (let i = 0; i < 9; i++){
            this.parOutTotal += this.myPar[i];
        }
    }
    calcInPar(){
        for (let i = 9; i < this.myPar.length; i++){
            this.parInTotal += this.myPar[i];
        }
    }
    calcTotalYards(){
        for (let i = 0; i< this.myYards.length;i++){
            this.totalYards += this.myYards[i];
        }
    }
    calcOutYards(){
        for (let i = 0; i < 9; i++){
            this.yardsOutTotal += this.myYards[i];
        }
    }
    calcInYards(){
        for (let i = 9; i < this.myYards.length; i++){
            this.yardsInTotal += this.myYards[i];
        }
    }
}
let tee = new TeeType(null,[],[],[],[]);


let coursesRequest = new Promise((resolve,reject)=>{
    $.ajax({
        url:'https://golf-courses-api.herokuapp.com/courses',
        type: 'GET',
        success: (response,status)=>{
            console.log(response);
            let returnCode = '<option value="default">--DEFAULT--</option>';
            for (let i = 0; i < response.courses.length;i++){
                returnCode += `<option value="${response.courses[i].id}">${response.courses[i].name}</option>`;
            }
            document.getElementById('courseDrop').innerHTML = returnCode;
        }
    })
});

let promise;
function loadCourse(courseID){
    return new Promise((resolve,reject)=>{
        $.ajax({
            url: `https://golf-courses-api.herokuapp.com/courses/${courseID}`,
            // url: 'https://golf-courses-api.herokuapp.com/courses/18300',
            type: 'GET',
            success: (response,status) => {
                console.log('connection established');
                console.log(response);
                resolve(response);
            },
            error: (err)=>{
                reject(err);
            }
        })
    });
}

function chooseCourse(courseID){
    // console.log('hello there');
    promise = loadCourse(courseID);
    promise.then((response)=>{
        theCourse = response;
    });
}

function chooseTee(type){
    tee = new TeeType(null,[],[],[],[]);
    tee.id = type;
    for (let i = 0; i < 18; i++){
        tee.myMeters.push(theCourse.data.holes[i].teeBoxes[type].meters);
        tee.myYards.push(theCourse.data.holes[i].teeBoxes[type].yards);
        tee.handi.push(theCourse.data.holes[i].teeBoxes[type].hcp);
        tee.myPar.push(theCourse.data.holes[i].teeBoxes[type].par);
    }
    tee.caclTotalPar();
    tee.calcTotalYards();
    tee.calcInPar();
    tee.calcOutPar();
    tee.calcOutYards();
    tee.calcInYards();

    firstDraw = true;
    if (drawHoleInfo[0] !== undefined){
        for (let initalIter = 0; initalIter < 18; initalIter++){
            document.getElementById(`col${initalIter+1}`).innerHTML = drawHoleInfo[initalIter];
        }
    }
    if(tee.id !== null){
        for (let i = 0; i < 18; i++){
            document.getElementById(`${i+1}yard`).innerHTML = tee.myYards[i];
            document.getElementById(`${i+1}handi`).innerHTML = tee.handi[i];
            document.getElementById(`${i+1}par`).innerHTML = tee.myPar[i];
        }
    }
    drawPage();
}



let currentID = 0;
class AllPlayers{
    constructor(players,hole){
        this.players = players;
        this.currentHole = hole;
    }
    forwardHole(){
        this.currentHole += 1;
    }
    backHole(){
        this.currentHole -= 1;
    }
    addPlayer(name,pID,holes,isActive,score){
        this.players.push(new Player(name,pID,holes,isActive,score));
        playerNum++;
    }
    removePlayer(pID){
        for (let i=0;i<this.players.length;i++){
            if (this.players[i].pID === pID){
                this.players.splice(i,1);
            }
        }
    }
}

class Player{
    constructor(name,pID,holes,isActive,score){
        this.name = name;
        this.id = pID;
        this.holes = holes;
        this.active = isActive;
        this.score = score;
    }
    setScore(hole,value){
        this.holes[hole] = Number(value);
        drawPage();
        this.messageCheck();
    }
    changeActive(){
        if (this.active){
            this.active = false;
        }
        else{
            this.active = true;
        }
    }
    totalScore(){
        this.score = 0;
        for(let i=0;i<this.holes.length;i++){
            this.score += Number(this.holes[i]);
        }
        return this.score;
    }
    inScore(){
        let result = 0;
        for(let i =9; i < 18; i++){
            result += Number(this.holes[i]);
        }
        return result;
    }
    outScore(){
        let result = 0;
        for (let i=0; i < 9; i++){
            result += Number(this.holes[i]);
        }
        return result;
    }
    messageCheck(){
        let test = 0;
        for (let i = 0; i < this.holes.length;i++){
            if (this.holes[i] != 0 || this.holes[i] != ''){
                test += 1;
            }
        }
        if (test >= 18){
            if(this.score - tee.totalPar > 0){
                document.getElementById('messageSpace').innerHTML = `<h3>Good try ${this.name}!</h3>`;
                showMessageSpace();
            }
            else if (this.score - tee.totalPar == 0){
                document.getElementById('messageSpace').innerHTML = `<h3>Wow, you got PAR ${this.name}, great job!</h3>`;
                showMessageSpace();
            }
            else{
                document.getElementById('messageSpace').innerHTML = `<h3>Your under PAR! Looks like you're ready to go pro ${this.name}!</h3>`;
                showMessageSpace();
            }
        }
    }
}
console.log('code has loaded');

let players = new AllPlayers([],0);


function drawPage(){
    if(tee.id !== null){
        for (let i = 0; i < 18; i++){
            document.getElementById(`${i+1}yard`).innerHTML = tee.myYards[i];
            document.getElementById(`${i+1}handi`).innerHTML = tee.handi[i];
            document.getElementById(`${i+1}par`).innerHTML = tee.myPar[i];
        }
    }
    if(firstDraw){
        for (let y = 0; y < 18; y++){
            drawHoleInfo[y] = document.getElementById(`col${y+1}`).innerHTML;
        }
        firstDraw = false;
    }
    document.getElementById('col0').innerHTML = `<p>Hole:</p><p>Yardage:</p><p>Handicap:</p><p>PAR</p>`;
    document.getElementById('col02').innerHTML = `<p>Hole:</p><p>Yardage:</p><p>Handicap:</p><p>PAR</p>`;
    for (let x = 0; x < players.players.length;x++){
        document.getElementById('col0').innerHTML += `<p>${players.players[x].name}</p>`;
        document.getElementById('col02').innerHTML += `<p>${players.players[x].name}</p>`;
    }
    for (let initalIter = 0; initalIter < 18; initalIter++){
        document.getElementById(`col${initalIter+1}`).innerHTML = drawHoleInfo[initalIter];
    }
    for (let pIteration = 0; pIteration < players.players.length; pIteration ++){
        for (let hIteration = 0; hIteration < 18; hIteration++){
            document.getElementById(`col${hIteration+1}`).innerHTML += `<input onchange="players.players[${pIteration}].setScore(${hIteration},this.value)" type="number" id="p${pIteration}h${hIteration}">`;
            document.getElementById(`p${pIteration}h${hIteration}`).value = players.players[pIteration].holes[hIteration];
        }
    }
    document.getElementById('outTotal').innerHTML = `<p>Out Scores</p><p id="yardOutTotal">${tee.yardsOutTotal}</p><p>--</p><p id="parOutTotal">${tee.parOutTotal}</p>`;
    document.getElementById('inTotal').innerHTML = `<p>In Scores</p><p id="yardInTotal">${tee.yardsInTotal}</p><p>--</p><p id="parInTotal">${tee.parInTotal}</p>`;
    document.getElementById('subTotal').innerHTML = `<p>SubTotal</p><p class="yardTotal">${tee.totalYards}</p><p>--</p><p class="parTotal">${tee.totalPar}</p>`;
    document.getElementById('totalRelToPar').innerHTML = `<p>Total</p><p class="yardOutTotal"${tee.totalYards}</p><p>--</p><p class="parOutTotal">${tee.totalPar}</p>`;

    for (let totalIter = 0; totalIter < players.players.length; totalIter++){
        document.getElementById('outTotal').innerHTML += `<p>${players.players[totalIter].outScore()}</p>`;
        document.getElementById('inTotal').innerHTML +=  `<p>${players.players[totalIter].inScore()}</p>`;
        document.getElementById('subTotal').innerHTML +=  `<p>${players.players[totalIter].totalScore()}</p>`;
        document.getElementById('totalRelToPar').innerHTML +=  `<p>${players.players[totalIter].totalScore()- tee.totalPar}</p>`;

    }
}


function showAddPlayer(){
    document.getElementById('modalSpace').style.display ='block';
    document.getElementById('addplayerSpace').style.display = 'block';
    document.getElementsByClassName('containsAll')[0].style.filter = 'blur(5px)';
}
function addPlayer(){
    let name = document.getElementById('playerName');
    if (name.value == 0 || name.value == ''){
        let messageSpace = document.getElementById('messageSpace');
        messageSpace.style.display = 'block';
        messageSpace.innerHTML = '<h3>You did not enter a correct name</h3>';

    }
    else{
        players.addPlayer(name.value,playerNum,[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],false,0);
        hideAddPlayer();
        drawPage();
        hideMessageSpace();
        name.value = '';
    }
}
function hideAddPlayer(){
    document.getElementById('modalSpace').style.display ='none';
    document.getElementById('addplayerSpace').style.display = 'none';
    document.getElementsByClassName('containsAll')[0].style.filter = 'blur(0px)';
}
function hideMessageSpace(){
    document.getElementById('messageSpace').style.display = 'none';
}

function showMessageSpace(){
    document.getElementById('modalSpace').style.display = 'block';
    document.getElementById('messageSpace').style.display = 'block';
    document.getElementsByClassName('containsAll')[0].style.filter = 'blur(5px)';
}
