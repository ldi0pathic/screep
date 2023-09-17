var carry = require('role.carry');
const structurePriorities = {
        [STRUCTURE_WALL]: 0.0005,
        [STRUCTURE_CONTAINER]: 0.75,
        [STRUCTURE_RAMPART]: 0.03
    };
    
var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep)
    {
        carry.checkCarry(creep);
         
        if(creep.memory.carry && creep.room.energyAvailable == creep.room.energyCapacityAvailable ) 
        { 
           var target = creep.pos.findClosestByPath(FIND_STRUCTURES, 
            {
                filter: (structure) => 
                {
                    return (
                                structure.structureType === STRUCTURE_LINK      || 
                                structure.structureType === STRUCTURE_SPAWN     || 
                                structure.structureType === STRUCTURE_EXTENSION || 
                                structure.structureType === STRUCTURE_STORAGE   || 
                                (
                                    structure.structureType === STRUCTURE_TOWER && 
                                    structure.store.getUsedCapacity([RESOURCE_ENERGY]) < (structure.store.getCapacity([RESOURCE_ENERGY])*0.75)
                                )
                            ) && structure.store.getFreeCapacity([RESOURCE_ENERGY]) > 0 ;
                }
            });

            if(target) 
            { 
                var state = creep.transfer(target, RESOURCE_ENERGY);
                if( state == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                return;
            }
            else
            {
                 const upgraderTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < structure.hitsMax
                    });
        
                if (upgraderTarget) {
                    if (creep.repair(upgraderTarget) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(upgraderTarget);
                    }
                    return;
                }
            }
            
            const updateState = creep.upgradeController(creep.room.controller);
            if (updateState === OK) {
                // Erfolgreich aktualisiert, keine weiteren Maßnahmen erforderlich.
                return;
            }
        
            if (updateState === ERR_NOT_IN_RANGE || updateState === ERR_NOT_OWNER) {
                creep.moveTo(Game.spawns['P1'].room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
            }  
        }
        else if(creep.memory.carry) 
        {
             var target = creep.pos.findClosestByPath(FIND_STRUCTURES, 
            {
                filter: (structure) => 
                {
                    return (
                        structure.structureType === STRUCTURE_SPAWN     || 
                        structure.structureType === STRUCTURE_EXTENSION 
                        ) && structure.store.getFreeCapacity([RESOURCE_ENERGY]) > 0 ;
                }
            });

            if(target) 
            {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                return;
            }
        }
    }
};

module.exports = roleHarvester;