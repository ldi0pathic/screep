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
                creep.moveTo(target, {reusePath: 5});
            }
            return true;
        }
        return false;
    },
    TransportToHomeTerminal: function(creep, type)
    {
        if(creep.memory.home != creep.room.name)
            return false;

        var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES,
            {
                filter: (structure) => {
                    return (
                        structure.structureType === STRUCTURE_TERMINAL 
                    ) && structure.store[type] < 150000 ;
                }
            });

        if (target) {
            if (creep.transfer(target, type) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {reusePath: 5});
            }
            return true;
        }
        return false;
    },
    TransportToHomeLab: function(creep, type)
    {
        if(creep.memory.home != creep.room.name)
            return false;

        var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES,
            {
                filter: (structure) => {
                    return (
                        structure.structureType === STRUCTURE_LAB 
                    ) && structure.store.getFreeCapacity([type]) > 0;
                }
            });

        if (target) {
            if (creep.transfer(target, type) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {reusePath: 5});
            }
            return true;
        }
        return false;
    },
    TransportEnergyToHomeSpawn: function(creep)
    {
        if(creep.memory.home != creep.room.name|| creep.store[RESOURCE_ENERGY] == 0)
            return false;

        var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES,
            {
                filter: (structure) => {
                    return (
                        structure.structureType === STRUCTURE_SPAWN ||
                        structure.structureType === STRUCTURE_EXTENSION
                    ) && structure.store.getFreeCapacity([RESOURCE_ENERGY]) > 0;
                }
            });
        if (target) {
            var state = creep.transfer(target, RESOURCE_ENERGY);
            if (state == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {reusePath: 5});
            }
            else return false;
           
            return true;
        }
        return false;
    },
    TransportEnergyToHomeTower: function(creep)
    {
        if(creep.memory.home != creep.room.name || creep.store[RESOURCE_ENERGY] == 0)
            return false;
        
        var towers = creep.room.find(FIND_MY_STRUCTURES,
            {
                filter: (structure) => {
                    return (
                        structure.structureType === STRUCTURE_TOWER    
                    ) && structure.store.getFreeCapacity([RESOURCE_ENERGY]) > 100;
                }
            });

        if (towers.length > 0) 
        {
            towers.sort((a, b) => b.store.getFreeCapacity(RESOURCE_ENERGY) - a.store.getFreeCapacity(RESOURCE_ENERGY));

            var state = creep.transfer(towers[0], RESOURCE_ENERGY);
            if (state == ERR_NOT_IN_RANGE) {
                creep.moveTo(towers[0], {reusePath: 5});
            }
            else return false;
            
            return true;
        }
        return false;
    },
    TransportToHomeStorage: function(creep, type)
    { 
        if(creep.memory.home != creep.room.name)
            return false;
        
        var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES,
            {
                filter: (structure) => {
                    return (
                        structure.structureType === STRUCTURE_STORAGE    
                    ) && structure.store.getFreeCapacity() > 0;
                }
            });

        if (target) {
            for (var resourceType in creep.store) {
                if (creep.transfer(target, resourceType) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {reusePath: 5});
                }
            } 
            return true;
        }
        return false;
    }
};