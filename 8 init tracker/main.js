/**
 * for now keep it simple: all entities are boss entities.
 * coming soon: we lock multi turns only for bosses,
 * and do Lairs, which dont roll turns. they just have their set number.
  */

class entityBaseData

(n, i, t)
{
    name: n,
        initMod
:
    i,
        turns
:
    t
}

class nonBossEntity

(n, i) = {
    entity: entity(n, i, 1);
}

class lairActionEntity

(n, i)
{
    entity = entity(n, 0, 1)
}

var numDice = 1;
var diceFaces = 2;

class turnObject
(entity) = {
    entity: entity,
    rolledinit =
    turnOrder =
    tempTurnOrder =
    downed = false;
}

function getRandomInit(turnObject) {
    i = turnObject.entity.initMod;
    for (var i = 0; i < numDice; i++) {
        i += Math.floor(Math.random() * diceFaces)
    }
    return i;
}

var whosGoing = 1; // or whatever the first num in the array is.

function rollTurn(turn) {
    //go thru all active entities. make a turn object for each
    //first, all boss entities. roll an init for each turn they have
    //next, normal enemies , and players
    //finally, grab static inits of Lair actions.

    //calculate the turn order of all the active entities, aka their indices
    //set temp turn order = turn order
}


function goNextTurn() {
    //play swoosh sfx
    //next turn data = this turn data
    restartThisTurn();
    rollTurn(nextTurn);
}
function next(){
    if (whosGoing >= thisTurn.length) goNextTurn()
    else whosGoing++;
    //update visuals
}
function previous(){
    if (whosGoing <= 1) return;
    whosGoing--;
    //update visuals
}
function restoreTurn(turn){
    //reset temp turn order to turn order
}
function restartThisTurn{
    whosGoing = 1;
    //update css...
}

// when dragging stuff around on top we can change the displayed turn order
//also while dragging on the pause screen we can reorder.
function dragToReorder{

}
//when clicking on bottom we can down or raise an entity
function downUp{
    //on click:
    turnObject.downed = !turnObject.downed;
    if (turnObject.downed) {
        //play sfx explode / splat, depending on if enemey or player
        //CSS update? grey out in initline, rotate 45 degrees in field
    }
    else{
        //play heal up sfx
        //css update: no grey overlay, rotate back to upright
    }
}

/**
 * these are the counters that show on the pause screen
 * they determine active entities. so on creation we actually fill all these arrays out
 * with blank entities...
 * TODO: drag and drop rearrange the
 */
var numEnemies
var numFriends


var badSide = { //this is data for stuff on the pause screen
    var Enemies = [],
    var LairActions = [] //max 4
}
var Friends = [] ;//max 8. data for stuff on the pause screen

var thisTurn = [];
var nextTurn = [];