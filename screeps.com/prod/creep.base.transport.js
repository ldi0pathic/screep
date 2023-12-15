module.exports = 
{
    _Transfer: function(creep, target, type)
    {
        if (target) {
            switch (creep.transfer(target, type))
            {
                case ERR_NOT_IN_RANGE:
                    creep.moveTo(target, {reusePath: 5});
                    return true;

                case OK:
                    return true;

                default:
                    return false;
            }
        }
        return false;
    },
    CheckIsFreelancer: function(creep)
    {
        return creep.memory.container == '';
    },
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

        return this._Transfer(creep, target, type);    
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

        return this._Transfer(creep, target, type);    
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

        return this._Transfer(creep, target, type);    
    },
    TransportEnergyToHomeSpawn: function(creep)
    {    
        if(creep.memory.home != creep.room.name || 
           creep.store[RESOURCE_ENERGY] == 0)
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
         
        return this._Transfer(creep, target, RESOURCE_ENERGY);    
    },
    TransportEnergyToHomeTower: function(creep)
    {
        if(creep.memory.home != creep.room.name || 
           creep.store[RESOURCE_ENERGY] == 0)
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
            return this._Transfer(creep, towers[0], RESOURCE_ENERGY);    
        }
        return false;
    },
    TransportToHomeStorage: function(creep)
    { 
        if(creep.memory.home != creep.room.name || creep.memory.fromStorage)
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
                this._Transfer(creep, target, resourceType);    
            } 
            return true;
        }
        return false;
    }
};