$.ajax({
    url: '../data/course.JSON',
    type: 'GET',
    success: (resolve,reject) => {
        console.log('connection established');
    }
});
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
        if (this.active === true){
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