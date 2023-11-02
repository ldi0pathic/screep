const creepBase = require('./creep.base');
require('./config');
const role = "wally";

module.exports = {
    sayJob: function() { this.creep.say('🔧') },
    doJob: function (creep) {
        creepBase.checkHarvest(creep,RESOURCE_ENERGY);

        if (creep.memory.harvest) {
            creep.memory.wall = null;
            if(creepBase.harvest(creep)) return;
            return;
        } 

        if(creepBase.checkInvasion(creep)) return;
        if(creepBase.goToWorkroom(creep)) return;
        if(creepBase.checkWorkroomPrioSpawn(creep)) return;
        if(this._repair(creep)) return;

        creepBase.upgradeController(creep);
    },
    _repair: function(creep){
        if(!creep.memory.wall)
        {
             const sortedWalls = global.room[creep.memory.workroom].walls
                .map(id => Game.getObjectById(id))
                .filter(wall => wall && wall.hits < wall.hitsMax)
                .sort((a, b) => a.hits - b.hits);
                
            if (sortedWalls.length > 0) {
                creep.memory.wall = sortedWalls[0].id;
            }
        }
        if(creep.memory.wall)
        {
           var targetWall = Game.getObjectById(creep.memory.wall);

           if(!targetWall)
           {
                creep.memory.wall = null;
                return true;
           }
            const repairResult = creep.repair(targetWall );

            if (repairResult === ERR_NOT_IN_RANGE) {
                creep.moveTo(targetWall, { visualizePathStyle: { stroke: '#ffffff' } });
                return true;
            }

            return repairResult == OK;
        }
    },
    _getProfil: function(spawn)
    {
        const totalCost =  BODYPART_COST[WORK] + BODYPART_COST[CARRY] + BODYPART_COST[MOVE];
        var maxEnergy = spawn.room.energyCapacityAvailable;
        const numberOfSets = Math.min(6,Math.floor(maxEnergy / totalCost));
        if(numberOfSets == 0)
        {
            return [WORK,CARRY,CARRY,MOVE,MOVE];
        }
        return Array((numberOfSets)).fill(WORK).concat(Array((numberOfSets)).fill(CARRY).concat(Array((numberOfSets)).fill(MOVE)));
    },
    spawn: function(spawn,workroom)
    {
        if(!global.room[workroom].walls)
            return false;

        if(spawn.room.name != workroom && !Memory.rooms[workroom].claimed)
            return false;

        var count = _.filter(Game.creeps, (creep) => creep.memory.role == role && 
                                                    creep.memory.workroom == workroom && 
                                                    creep.memory.home == spawn.room.name).length;
                                
        if (global.room[workroom].maxwallRepairer <= count)
            return false;
           
        let walls = global.room[workroom].walls
            .map(id => Game.getObjectById(id))
            .filter(wall => wall && wall.hits < (wall.hitsMax * (global.prio.hits[wall.structuretype] || 0.5)));
        
        if(walls.length == 0)
            return false;

        if(spawn.room.name == workroom)
        {
            //Wenn keine Energiereserven vorhanden, kein Wallbuilder spawnen! 
            var storage = Game.rooms[workroom].storage;
            if(storage && storage.store[RESOURCE_ENERGY] < 10000)
                return false;           
        }
            
        var p = this._getProfil(spawn);
           
        return creepBase.spawn(spawn, p, role + '_' + Game.time,{ role: role, workroom: workroom, home: spawn.room.name});
    },
   
};