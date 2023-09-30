const creepBase = require('./creep.base');
require('./config');
const role = "upgrader";

module.exports = {
    sayJob: function() { this.creep.say('🔑') },
    doJob: function (creep) {
        creepBase.checkHarvest(creep);

        if (creep.memory.harvest) {
            if(creepBase.harvest(creep)) return;

            return;
        } 

        if(creepBase.goToWorkroom(creep)) return;
        if(creepBase.checkWorkroomPrioSpawn(creep)) return;

        creepBase.upgradeController(creep);
    },
    _getProfil: function(spawn)
    {
        const totalCost = 3 * BODYPART_COST[WORK] + 2 * BODYPART_COST[CARRY] + 2 * BODYPART_COST[MOVE];
        var maxEnergy = spawn.room.energyCapacityAvailable;
        const numberOfSets = Math.floor(maxEnergy / totalCost);
        if(numberOfSets == 0)
        {
            return [WORK,CARRY,CARRY,MOVE,MOVE];
        }
        return Array((numberOfSets*3)).fill(WORK).concat(Array((numberOfSets*2)).fill(CARRY).concat(Array((numberOfSets*2)).fill(MOVE)));
    },
    spawn: function(spawn,workroom)
    {
        var uppis = global.room[workroom].upgrader
        if(!uppis || uppis < 1)
            return false;
           
        var count = _.filter(Game.creeps, (creep) => creep.memory.role == role && 
                                                    creep.memory.workroom == workroom && 
                                                    creep.memory.home == spawn.room.name).length;

                                                   
        if ( uppis <= count)
            return false;

        var profil = this._getProfil(spawn);
        var newName = role + '_' + Game.time;
        if (spawn.spawnCreep(profil, newName, { dryRun: true }) === 0) {
            spawn.spawnCreep(profil, newName, { memory: { role: role, workroom: workroom, home: spawn.room.name, repairs:0} });
            console.log("[" + spawn.room.name + "|" + workroom + "] spawn " + newName + " cost: " + creepBase.calcProfil(profil));
            return true;
        }

        return false;  
    },
   
};