const creepBaseGoTo = require('./creep.base.goto');
module.exports = 
{
    _Transfer: function(creep, target, type)
    {
        if (target) {
            switch (creep.transfer(target, type))
            {
                case ERR_NOT_IN_RANGE:
                    creepBaseGoTo.moveByMemory(creep, target.pos);
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
    TransportToHomeTerminal: function(creep)
    {
        if(creep.memory.home != creep.room.name)
            return false;

        var target = creep.room.find(FIND_MY_STRUCTURES,
            {
                filter: (structure) => {
                    return (
                        structure.structureType === STRUCTURE_TERMINAL 
                    ) && structure.store.getFreeCapacity() > 0 ;
                }
            });

        if(target.length > 0)
        {
            for (var resourceType in creep.store) 
            {
                //verhindern, das zuviel Energie eingelagert wird :/ 
                if(resourceType == RESOURCE_ENERGY && 
                    target[0].store[RESOURCE_ENERGY] > 50000) 
                    continue;

                this._Transfer(creep, target[0], resourceType);    
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
        if(creep.memory.home != creep.room.name)
            return false;

        //ansonsten werden lnks nicht inden storage geleert :( 
        if(Memory.rooms[creep.memory.workroom].hasLinks && global.room[creep.memory.workroom].spawnLink)
        {
            var link = Game.getObjectById(global.room[creep.memory.home].spawnLink);

            if(link.store[RESOURCE_ENERGY] < 100 && creep.memory.fromStorage)
                return false;
        }
        else if(creep.memory.fromStorage) return false;
            
        var target = creep.room.storage;

        if (target) {
            for (var resourceType in creep.store) {
                this._Transfer(creep, target, resourceType);    
            } 
            return true;
        }
        return false;
    }
};