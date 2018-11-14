
let theCourse = null;
let playerNum = 0;


class TeeType{
    constructor(id,yards, meters,handi,par){
        this.id = id;
        this.myYards = yards;
        this.myMeters = meters;
        this.handi = handi;
        this.myPar = par;
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
    console.log('hello there');
    promise = loadCourse(courseID);
    promise.then((response)=>{
        theCourse = response;
    });
}

function chooseTee(type){
    tee.id = type;
    for (let i = 0; i < 18; i++){
        tee.myMeters.push(theCourse.data.holes[i].teeBoxes[type].meters);
        tee.myYards.push(theCourse.data.holes[i].teeBoxes[type].yards);
        tee.handi.push(theCourse.data.holes[i].teeBoxes[type].hcp);
        tee.myPar.push(theCourse.data.holes[i].teeBoxes[type].par);
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
    changeActive(){
        if (this.active){
            this.active = false;
        }
        else{
            this.active = true;
        }
    }
    totalScore(){
        for(let i=0;i<this.holes.length;i++){
            this.score += this.holes[i];
        }
    }
}
console.log('code has loaded');


function drawPage(){
    for (let i = 0; i < 18; i++){
        document.getElementById(`${i+1}yard`).innerHTML = tee.myYards[i];
        document.getElementById(`${i+1}handi`).innerHTML = tee.handi[i];
        document.getElementById(`${i+1}par`).innerHTML = tee.myPar[i];
    }
}
