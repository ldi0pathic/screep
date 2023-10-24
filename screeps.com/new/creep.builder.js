const creepBase = require('./creep.base');
require('./config');
const role = "builder";

module.exports = {
    sayJob: function() { this.creep.say('🔨') },
    doJob: function (creep) {
        creepBase.checkHarvest(creep, RESOURCE_ENERGY);

        if (creep.memory.harvest) {
            creep.memory.repId = null;
            if(creepBase.harvest(creep)) return;

            if(creep.store.getUsedCapacity() > creep.store.getFreeCapacity())
            {
                creep.memory.harvest = false;
            }
            
            if(creepBase.harvestSpawnLink(creep,creep.memory.mineral))return;

            return;
        } 
        
        if(creepBase.goToWorkroom(creep)) return;
        if(creepBase.checkWorkroomPrioSpawn(creep)) return;

        if(this._build(creep)) return;

        creepBase.upgradeController(creep);
    },
    _getPriority: function(structureType) {
        return global.prio.build[structureType] || 99;
    },  
    _build: function(creep){
        if(!creep.memory.id && !creep.memory.repId)
        {
            let structuresToBuild = creep.room.find(FIND_CONSTRUCTION_SITES);
 
            if(structuresToBuild.length > 0)
            {
                var structs = structuresToBuild.map(site => ({
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
        else if(!creep.memory.repId)
        {
            let target = Game.getObjectById(creep.memory.id);
            var struc =  '';   
            if (target && target.progressTotal != undefined) 
            {
                let state = creep.build(target);
                struc = target.structureType;
                
                if (state === ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(target);
                } 
                else if(state === OK)
                {        
                    if(struc == STRUCTURE_RAMPART)
                    {
                        let rampart = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return (structure.structureType == STRUCTURE_RAMPART && structure.hits < 10)
                        }});
                        if(rampart)
                        {
                            creep.memory.repId = rampart.id;
                            creep.memory.id = null;        
                        }
                    }
                }
                return true;   
            }
            else
            {
                creep.memory.id = null;   
            }       
        }
        else
        {
            let target = Game.getObjectById(creep.memory.repId);
            if(target && target.hits < 1000)
            {
                let state = creep.repair(target)
                if (state === ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(target);
                } 
            } 
            else
            {
                creep.memory.repId = null;   
            } 
            return true;
        }
        return false;
    },
    _getProfil: function(spawn)
    {
        const totalCost = 3 * BODYPART_COST[WORK] + 2 * BODYPART_COST[CARRY] + 3 * BODYPART_COST[MOVE];
        var maxEnergy = spawn.room.energyCapacityAvailable;
        const numberOfSets = Math.min(3,Math.floor(maxEnergy / totalCost));
        if(numberOfSets == 0)
        {
            return [WORK,CARRY,CARRY,MOVE,MOVE];
        }
        return Array((numberOfSets*3)).fill(WORK).concat(Array((numberOfSets*2)).fill(CARRY).concat(Array((numberOfSets*3)).fill(MOVE)));
    },
    spawn: function(spawn,workroom)
    {
        var maxbuilder = global.room[workroom].maxbuilder
        if(!global.room[workroom].sendBuilder || maxbuilder < 1)
            return false;
          
        var count = _.filter(Game.creeps, (creep) => creep.memory.role == role && 
                                                    creep.memory.workroom == workroom && 
                                                    creep.memory.home == spawn.room.name).length;
        if(count == undefined)
            count = 0;
                                        
        if ( maxbuilder <= count)
            return false;

        var sites = Game.rooms[workroom].find(FIND_CONSTRUCTION_SITES).length;

        if(sites == 0 || Math.max(sites / 5, 1) <= count)
            return false;
    
        return creepBase.spawn(spawn, this._getProfil(spawn), role + '_' + Game.time, { role: role, workroom: workroom, home: spawn.room.name});      
    },

   
   
};