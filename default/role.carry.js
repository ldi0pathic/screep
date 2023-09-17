var carry =
{
     /** @param {Creep} creep **/
    checkCarry: function(creep) 
    {
        return newer(creep);
    }
}
function older(creep)
{
        if(creep.memory.carry && creep.store[RESOURCE_ENERGY] == 0) 
        {  
            if(creep.hits < 100)
            {
                creep.role = '';
                creep.suicide();
            }
          
            creep.memory.carry = false;
            return;
        }
        
        if(!creep.memory.carry && creep.store.getFreeCapacity() == 0) 
        {
            creep.memory.carry = true;
        }
        
        if(!creep.memory.carry)
        {
       /*     var drop = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES,
            {
                filter: (res) => {
                    return res.resourceType === RESOURCE_ENERGY;
                }
            } );
            
            if(drop)
            {
               if(creep.pickup(drop) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(drop, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                return; 
            }*/
            
            var container = creep.pos.findClosestByPath(FIND_STRUCTURES, 
            {
                filter: (s) => {
                        return (
                            s.structureType === STRUCTURE_CONTAINER || 
                            s.structureType === STRUCTURE_STORAGE 
                            ) && s.store.getUsedCapacity(RESOURCE_ENERGY) >= 50;
                    }
            });
        
            if(container)
            { 
                if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
                   
                }
            }
            else
            {
                var source = creep.pos.findClosestByPath(FIND_SOURCES);
                if (creep.harvest(source) === ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
        
        return creep.memory.carry;
}
function newer(creep)
{
    if (creep.memory.carry) {
        if (creep.store[RESOURCE_ENERGY] === 0) {
            if (Memory.prioEnergie) {
                creep.memory.carry = false;
            } else {
                if (creep.hits < 100) {
                    creep.suicide()
                }
                creep.memory.carry = false;
            }
            return creep.memory.carry;
        }
    } else {
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
            creep.memory.carry = true;
            return creep.memory.carry;
        }

        if (!creep.memory.carry) {
           

            const container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => (
                    (s.structureType === STRUCTURE_CONTAINER || s.structureType === STRUCTURE_STORAGE) &&
                    s.store.getUsedCapacity(RESOURCE_ENERGY) >= creep.store.getFreeCapacity(RESOURCE_ENERGY)
                )
            });

            if (container) {
                if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, { visualizePathStyle: { stroke: '#ffaa00' } });
                }
                return creep.memory.carry;
            }

            const source = creep.pos.findClosestByPath(FIND_SOURCES);
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    }
    return creep.memory.carry;
}

module.exports = carry;