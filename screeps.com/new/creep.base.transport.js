module.exports = 
{
    TransportToHomeContainer: function(creep, type)
    {
        if(creep.memory.home != creep.room.name)
            return false;

        var target = creep.pos.findClosestByPath(FIND_STRUCTURES,
            {
                filter: (structure) => {
                    return (
                        structure.structureType === STRUCTURE_CONTAINER 
                    ) && structure.store.getFreeCapacity([type]) > 0;
                }
            });

        if (target) {
            if (creep.transfer(target, type) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            return true;
        }
        return false;
    },
    TransportToHomeTerminal: function(creep, type)
    {
        if(creep.memory.home != creep.room.name)
            return false;

        var target = creep.pos.findClosestByPath(FIND_STRUCTURES,
            {
                filter: (structure) => {
                    return (
                        structure.structureType === STRUCTURE_TERMINAL 
                    ) && structure.store.getFreeCapacity([type]) > 0;
                }
            });

        if (target) {
            if (creep.transfer(target, type) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            return true;
        }
        return false;
    },
    TransportEnergyToHomeSpawn: function(creep)
    {
        if(creep.memory.home != creep.room.name)
            return false;

        var target = creep.pos.findClosestByPath(FIND_STRUCTURES,
            {
                filter: (structure) => {
                    return (
                        structure.structureType === STRUCTURE_SPAWN ||
                        structure.structureType === STRUCTURE_EXTENSION
                    ) && structure.store.getFreeCapacity([RESOURCE_ENERGY]) > 0;
                }
            });

        if (target) {
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            return true;
        }
        return false;
    },
    TransportEnergyToHomeTower: function(creep)
    {
        if(creep.memory.home != creep.room.name)
            return false;
        
        var target = creep.pos.findClosestByPath(FIND_STRUCTURES,
            {
                filter: (structure) => {
                    return (
                        structure.structureType === STRUCTURE_TOWER    
                    ) && structure.store.getFreeCapacity([RESOURCE_ENERGY]) > 0;
                }
            });

        if (target) {
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            return true;
        }
        return false;
    },
    TransportToHomeStorage: function(creep, type)
    {
        if(creep.memory.home != creep.room.name)
            return false;
        
        var target = creep.pos.findClosestByPath(FIND_STRUCTURES,
            {
                filter: (structure) => {
                    return (
                        structure.structureType === STRUCTURE_STORAGE    
                    ) && structure.store.getFreeCapacity([type]) > 0;
                }
            });

        if (target) {
            if (creep.transfer(target, type) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            return true;
        }
        return false;
    }
};