const creepBase = require('./creep.base');
require('./config');
const role = "claimer";

module.exports = {
    sayJob: function() { this.creep.say('📌') },
    doJob: function (creep) {
        
        if(creepBase.goToWorkroom(creep)) return;

        const controller = Game.rooms[creep.memory.target].controller;

        if (controller) {
            var state = creep.reserveController(controller);
            if (state === ERR_NOT_IN_RANGE) {
                creep.moveTo(controller, { visualizePathStyle: { stroke: "#ffaa00" } });
            }
            else if(state == ERR_INVALID_TARGET)
            {
                creep.say('🪓')
                creep.attackController(controller);
            }

            if(controller.sign.username != creep.owner)
            {
                creep.signController(controller,'⚔')
            }
        }
    },
    _getProfil: function()
    {
       return  [CLAIM, CLAIM, MOVE,MOVE];
    },
    spawn: function(spawn,workroom)
    {
        if(!global.room[workroom].sendClaimer)
            return false;
           
        var count = _.filter(Game.creeps, (creep) => creep.memory.role == role && 
                                                    creep.memory.workroom == workroom).length;
                                  
        if ( 1 <= count)
            return false;

        var profil = this._getProfil();
        var newName = role + '_' + Game.time;
        if (spawn.spawnCreep(profil, newName, { dryRun: true }) === 0) {
            spawn.spawnCreep(profil, newName, { memory: { role: role, workroom: workroom, home: spawn.room.name} });
            console.log("[" + spawn.room.name + "|" + workroom + "] spawn " + newName + " cost: " + creepBase.calcProfil(profil));
            return true;
        }
        return false;  
    },
   
};