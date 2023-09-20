const creepBase = require('./creep.base');
require('./config');
const role = "repairer";

module.exports = {
    sayJob: function() { this.creep.say('🔨') },
    doJob: function (creep) {
        creepBase.checkHarvest(creep);

        if (creep.memory.harvest) {
            creep.memory.repairs = 0;

            if(creepBase.harvest(creep)) return;

            return;
        } 
        
        if(creepBase.goToWorkroom(creep)) return;
        if(this._repairPrio(creep)) return;
        if(this._repair(creep)) return;
        this._upgradeController(creep);
    },
    /**
     * 
     * @param {StructureSpawn} spawn 
     */
    _getProfil(spawn) {
        var max = parseInt(spawn.room.energyCapacityAvailable / 100);
        return Array(max).fill(CARRY).concat(Array(max).fill(MOVE));
    },
    _getPriority: function(structureType) {
        return global.prio.repair[structureType] || 99;
    },
    _getMinHitRange: function(structureType) {
        return global.prio.hits[structureType] || 0.5;
    },
    _repairPrio: function(creep){
        if(!creep.memory.prioId)
        {
            for(var id in global.room[creep.memory.workroom].buildings)
            {
                var buildingId = global.room[creep.memory.workroom].buildings[id];
                var building = Game.getObjectById(buildingId);

                if(building.hits < building.hitsMax*0.9)
                {
                    creep.memory.prioId = buildingId;
                    return true;
                }
            }
        }
        else
        {
            let target = Game.getObjectById(creep.memory.prioId);
                
            if (target && target.hits < target.hitsMax) 
            {
                let state = creep.repair(target);
                
                if (state === ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                } 
                return true;   
            } 
            creep.memory.repairs = 0;
            creep.memory.prioId = null;
        }
        return false;
    },
    _repair: function(creep){
        if(!creep.memory.id)
        {
            let structuresToRepair = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.hits < this._getMinHitRange(structure.structureType) * structure.hitsMax)
            }});

          
            if(structuresToRepair.length > 0)
            {
                var structs = structuresToRepair.map(site => ({
                    site,
                    progress: site.progress,
                    priority: this._getPriority(site.structureType)
                }))
                .sort((a, b) => {
                    if (a.priority === b.priority) {
                        return b.progress - a.progress;
                    }
                    return a.priority - b.priority;
                });

                creep.memory.id = structs[0].site.id;  
                return true;
            }
        }
        else
        {
            let target = Game.getObjectById(creep.memory.id);
                
            if (target && target.hits < target.hitsMax) 
            {
                let state = creep.repair(target);
                
                if (state === ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                } 
                return true;   
            } 
            creep.memory.repairs = 0;
            creep.memory.id = null;
        }
        return false;
    },
    _upgradeController: function(creep)
    {
        if(!creep.room.controller.my)
            return;
        
        const state = creep.upgradeController(creep.room.controller);
        if (state === ERR_NOT_IN_RANGE ) {
            creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
        }  
        return;
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
        
        var minRepairer = global.room[workroom].repairer
        if(minRepairer < 1)
            return false;
           
        var count = _.filter(Game.creeps, (creep) => creep.memory.role == role && 
                                                    creep.memory.workroom == workroom && 
                                                    creep.memory.home == spawn.room.name).length;

                                                   
        if ( minRepairer<= count)
            return false;

        var profil = this._getProfil(spawn);
        var newName = role + '_' + Game.time;
        if (spawn.spawnCreep(profil, newName, { dryRun: true }) === 0) {
            spawn.spawnCreep(profil, newName, { memory: { role: role, workroom: workroom, home: spawn.room.name} });
            console.log("[" + spawn.room.name + "|" + workroom + "] spawn " + newName + " cost: " + creepBase.calcProfil(profil));
            return true;
        }

        return false;  
    },
   
};