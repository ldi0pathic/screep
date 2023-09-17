const creepBaseTransport = require('./creep.base.transport');
const creepBaseGoTo = require('./creep.base.goto');


module.exports = 
{
    checkHarvest: function(creep)
    {
        if (!creep.memory.harvest && creep.store[RESOURCE_ENERGY] === 0) 
        {
            creep.memory.harvest = true;
            creep.say('🛒');
        }
        if (creep.memory.harvest && creep.store.getFreeCapacity() === 0) 
        {
            creep.memory.harvest = false;
        }
    },
    harvest: function(creep)
    {
        if(!creep.memory.harvest)
            return;
        
        if(this.harvestRoomStorage(creep))
            return;

        if(this.harvestRoomContainer(creep))
            return;

        if(this.harvestRoomEnergySource(creep))
            return;

        this.goToMyHome(creep);    
    },
    harvestRoomStorage: function(creep)
    {
        let storage = creep.room.storage;
        if (storage && storage.store[RESOURCE_ENERGY] > 0) 
        {
            if (creep.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) 
            {
                creep.moveTo(storage);
            }
            return true;
        }
        return false;
    },
    harvestRoomContainer: function(creep)
    {
        const containers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (
                    structure.structureType === STRUCTURE_CONTAINER ||
                    structure.structureType === STRUCTURE_STORAGE
                    ) && structure.store[RESOURCE_ENERGY] > 0
                ;
            }
        });

        if (containers.length > 0) 
        {
            const closestContainer = creep.pos.findClosestByRange(containers);
            if (creep.withdraw(closestContainer, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) 
            {
                creep.moveTo(closestContainer);
            }
            return true;
        }
        return false;
    },
    harvestMyContainer: function(creep)
    {
        if(creep.memory.workroom != creep.room.name || creep.memory.container == '')
            return false;

        var container = Game.getObjectById(creep.memory.container);

        if (container) 
        {
            if(container.store[RESOURCE_ENERGY] < 50)
            {
                if(creep.store.getUsedCapacity() > creep.store.getFreeCapacity())
                {
                      creep.memory.harvest = false;
                      return false;
                }
                
                if(this.goToRoomFlag(creep))
                    return true;
            }

            var state = creep.withdraw(container, RESOURCE_ENERGY);
            if (state === ERR_NOT_IN_RANGE) 
            {
                creep.moveTo(container);
            }
            return true;
        }
        return false;
    },
    harvestRoomEnergySource: function(creep)
    {
        //prio3 selber abbauen
        if(this.canHarvestEnergy(creep))
        {
            const source = creep.pos.findClosestByRange(FIND_SOURCES);
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) 
            {
                creep.moveTo(source);
            }
            return true;
        }
        return false;  
    },
    canHarvestEnergy:function(creep) {
        return creep.getActiveBodyparts(WORK) > 0;
    },
    calcProfil:function(creepProfile) 
    {
        let energyCost = 0;
        for (const bodyPart of creepProfile) {
            energyCost += BODYPART_COST[bodyPart];
        }
        return energyCost;
    },
    goToMyHome:   function(creep){return creepBaseGoTo.goToMyHome(creep)},
    goToRoomFlag: function(creep){return creepBaseGoTo.goToRoomFlag(creep)},
    goToWorkroom: function(creep){return creepBaseGoTo.goToWorkroom(creep)},
    TransportEnergyToHomeSpawn: function(creep){ return creepBaseTransport.TransportEnergyToHomeSpawn(creep);},
    TransportEnergyToHomeTower: function(creep) {return creepBaseTransport.TransportEnergyToHomeTower(creep);},  
};