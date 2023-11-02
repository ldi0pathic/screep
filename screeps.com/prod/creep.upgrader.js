const creepBase = require('./creep.base');
require('./config');
const role = "upgrader";

module.exports = {
    sayJob: function() { this.creep.say('🔑') },
    doJob: function (creep) {
        creepBase.checkHarvest(creep, RESOURCE_ENERGY);

        if (creep.memory.harvest) 
        {
            if(global.room[creep.memory.workroom].controllerLink)
            {
                if(creepBase.harvestControllerLink(creep,RESOURCE_ENERGY)) return;
            }
            else
            {
                if(creepBase.harvest(creep)) return;
            }

            if(creep.store.getUsedCapacity() > creep.store.getFreeCapacity())
            {
                creep.memory.harvest = false;
            }

            return;
        } 

        if(creepBase.checkInvasion(creep)) return;
        if(creepBase.goToWorkroom(creep)) return;
        if(creepBase.checkWorkroomPrioSpawn(creep)) return;

        creepBase.upgradeController(creep);
    },
    _getProfil: function(spawn, link)
    {   var numberOfSets = 0;
        
        if(link)
        {
            const totalCost = 3 * BODYPART_COST[WORK] + BODYPART_COST[CARRY] + 2 * BODYPART_COST[MOVE];
            var maxEnergy = spawn.room.energyCapacityAvailable;
            numberOfSets = Math.min(3,Math.floor(maxEnergy / totalCost));
            if(numberOfSets == 0)
            {
                return [WORK,CARRY,MOVE,MOVE];
            }
            return Array((numberOfSets*3)).fill(WORK).concat(Array((numberOfSets)).fill(CARRY).concat(Array((numberOfSets*2)).fill(MOVE)));
        }
        else
        {
            const totalCost = 3 * BODYPART_COST[WORK] + 2 * BODYPART_COST[CARRY] + 2 * BODYPART_COST[MOVE];
            var maxEnergy = spawn.room.energyCapacityAvailable;
            numberOfSets = Math.min(5,Math.floor(maxEnergy / totalCost));
            if(numberOfSets == 0)
            {
                return [WORK,CARRY,CARRY,MOVE,MOVE];
            }
            return Array((numberOfSets*3)).fill(WORK).concat(Array((numberOfSets*2)).fill(CARRY).concat(Array((numberOfSets*2)).fill(MOVE)));
        }   
    },
    spawn: function(spawn,workroom)
    {
        var uppis = global.room[workroom].upgrader
        if(!uppis || uppis < 1)
            return false;

        if(spawn.room.name != workroom && !Memory.rooms[workroom].claimed)
            return false;
           
        var count = _.filter(Game.creeps, (creep) => creep.memory.role == role && 
                                                    creep.memory.workroom == workroom && 
                                                    creep.memory.home == spawn.room.name).length;
                                           
        if ( uppis <= count)
            return false;

        var profil = this._getProfil(spawn, global.room[workroom].controllerLink);

        return creepBase.spawn(spawn, profil, role + '_' + Game.time,{ role: role, workroom: workroom, home: spawn.room.name, repairs:0});
    },
   
};