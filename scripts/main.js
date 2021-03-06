
let theCourse = null;
let playerNum = 0;
let firstDraw = true;
let drawHoleInfo = [];
let background = [];

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
            for (let x = 0; x < response.courses.length; x++){
                background.push(response.courses[x].image);
            }
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
    if(courseID == 18300){
        document.getElementsByTagName('body')[0].style.backgroundImage = `url("${background[0]}")`;
    }
    else if(courseID == 11819){
        document.getElementsByTagName('body')[0].style.backgroundImage = `url("${background[1]}")`;
    }
    else if(courseID == 19002){
        document.getElementsByTagName('body')[0].style.backgroundImage = `url("${background[2]}")`;
    }
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
            if (this.players[i].id === pID){
                this.players.splice(i,1);
            }
        }
        drawPage();
    }
    editPlayerName(pID,name){
        for (let i=0;i<this.players.length;i++){
            if (this.players[i].id === pID){
                this.players[i].name = name;
            }
        }
        drawPage();
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
        let compPAR = this.score - tee.totalPar;
        for (let i = 0; i < this.holes.length;i++){
            if (this.holes[i] != 0 || this.holes[i] != ''){
                test += 1;
            }
        }
        if (test >= 18){
            if(this.score - tee.totalPar > 0){
                document.getElementById('messageSpace').innerHTML = `<h3>${compPAR} over par, good try ${this.name}!</h3>`;
                showMessageSpace();
            }
            else if (this.score - tee.totalPar == 0){
                document.getElementById('messageSpace').innerHTML = `<h3>${compPAR} - Wow, you got PAR ${this.name}, great job!</h3>`;
                showMessageSpace();
            }
            else{
                document.getElementById('messageSpace').innerHTML = `<h3>You're ${compPAR} under PAR! Looks like you're ready to go pro ${this.name}!</h3>`;
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
        document.getElementById('col0').innerHTML += `<i onclick="startChangeName(${players.players[x].id})" class="fas fa-edit"></i><p><i onclick="players.removePlayer(${players.players[x].id})" class="fas fa-trash-alt"></i> ${players.players[x].name}</p>`;
        document.getElementById('col02').innerHTML += `<p>${players.players[x].name}</p>`;
    }
    for (let initalIter = 0; initalIter < 18; initalIter++){
        document.getElementById(`col${initalIter+1}`).innerHTML = drawHoleInfo[initalIter];
    }
    for (let pIteration = 0; pIteration < players.players.length; pIteration ++){
        for (let hIteration = 0; hIteration < 18; hIteration++){
            document.getElementById(`col${hIteration+1}`).innerHTML += `<input onchange="players.players[${pIteration}].setScore(${hIteration},this.value)" type="number" id="p${pIteration}h${hIteration}">`;
            // document.getElementById(`p${pIteration}h${hIteration}`).value = players.players[pIteration].holes[hIteration];
        }
    }
    for (let pIter2 = 0; pIter2 < players.players.length; pIter2++){
        for (let hIter2 = 0; hIter2 < 18; hIter2++){
            document.getElementById(`p${pIter2}h${hIter2}`).value = players.players[pIter2].holes[hIter2];
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
    hideMessageSpace();
}
function addPlayer(){
    let name = document.getElementById('playerName');
    let nameThere = false;
    for (let i = 0; i < players.players.length; i++){
        if (players.players[i].name == name.value){
            nameThere = true;
        }
    }
    if (name.value == 0 || name.value == ''){
        let messageSpace = document.getElementById('messageSpace');
        messageSpace.style.display = 'block';
        messageSpace.innerHTML = '<h3>You did not enter a correct name</h3>';

    }
    else if(nameThere === true ){
        let messageSpace = document.getElementById('messageSpace');
        messageSpace.innerHTML = '<h3>That Name Already Exists</h3>';
        messageSpace.style.display = 'block';
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
    if(document.getElementById('submitBTN').onclick != 'addPlayer()'){
        document.getElementById('submitBTN').setAttribute('onclick','addPlayer()');
    }
}
function hideMessageSpace(){
    document.getElementById('messageSpace').style.display = 'none';
}

function showMessageSpace(){
    document.getElementById('modalSpace').style.display = 'block';
    document.getElementById('messageSpace').style.display = 'block';
    document.getElementsByClassName('containsAll')[0].style.filter = 'blur(5px)';
}

function changeName(pID){
    let name = document.getElementById('playerName');
    let nameThere = false;
    for (let i = 0; i < players.players.length; i++){
        if (players.players[i].name == name.value){
            nameThere = true;
        }
    }
    if (name.value == 0 || name.value == ''){
        let messageSpace = document.getElementById('messageSpace');
        messageSpace.style.display = 'block';
        messageSpace.innerHTML = '<h3>You did not enter a correct name</h3>';

    }
    else if(nameThere === true ){
        let messageSpace = document.getElementById('messageSpace');
        messageSpace.innerHTML = '<h3>That Name Already Exists</h3>';
        messageSpace.style.display = 'block';
    }
    else{
        players.editPlayerName(pID,name.value);
        hideAddPlayer();
        drawPage();
        hideMessageSpace();
        name.value = '';
        document.getElementById('submitBTN').setAttribute('onclick',`addPlayer()`);
    }
}

function startChangeName(pID){
    document.getElementById('submitBTN').setAttribute('onclick',`changeName(${pID})`);
    showAddPlayer();
}
