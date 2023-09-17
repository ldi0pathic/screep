var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep)
    {
        carry.checkCarry(creep);
         
        if(creep.memory.carry) 
        { 
           var target = creep.pos.findClosestByPath(FIND_STRUCTURES, 
            {
                filter: (structure) => 
                {
                    return (
                              
                                (
                                    structure.structureType === STRUCTURE_TOWER && 
                                    structure.store.getUsedCapacity([RESOURCE_ENERGY]) < (structure.store.getCapacity([RESOURCE_ENERGY]))
                                )
                                )
                      
                }  }); 

            if(target) 
            { 
                var state = creep.transfer(target, RESOURCE_ENERGY);
                if( state == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                return;
            }

            }   
    }
};