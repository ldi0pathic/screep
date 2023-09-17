module.exports = {
    run: function(creep) {
        // Überprüfe, ob der Creep bereits Drops trägt
        if (creep.memory.collecting && creep.store.getFreeCapacity() === 0) {
            creep.memory.collecting = false;
            creep.say('🚚 Deposit');
        }
        
        // Überprüfe, ob der Creep noch Ressourcen sammeln muss
        if (!creep.memory.collecting && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.collecting = true;
            creep.say('🔍 Collect');
        }
        
        // Wenn der Creep Ressourcen sammeln muss
        if (creep.memory.collecting) {
           creep.say('c');
            // Überprüfe, ob es Drops in der aktuellen Raum gibt
            const drops = creep.room.find(FIND_DROPPED_RESOURCES, {filter: (d) => d.resourceType === RESOURCE_ENERGY});
            
            if (drops.length > 0) {
                var s = creep.pickup(drops[0])
               
                if (s  === ERR_NOT_IN_RANGE) {
                   var c =  creep.moveTo(drops[0], { visualizePathStyle: { stroke: '#ffaa00' } });
                    creep.say(c);
                }
            }
            else 
            {
               
             
                const tombstones = creep.room.find(FIND_TOMBSTONES, {
                    filter: (t) => t.store.getUsedCapacity(RESOURCE_ENERGY) > 0
                });
                if (tombstones.length > 0) {
                    if (creep.withdraw(tombstones[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(tombstones[0], { visualizePathStyle: { stroke: '#ffffff' } });
                    }
                    return;
                }
                
                 const targetRuins = creep.room.find(FIND_RUINS, {
                    filter: (t) => t.store.getUsedCapacity(RESOURCE_ENERGY) > 0
                });
                
                if(targetRuins.length > 0)
                {
                   if (creep.withdraw(targetRuins[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(targetRuins[0], { visualizePathStyle: { stroke: '#ffffff' } });
                    }
                    return;
                }
                
                // Wenn keine Drops gefunden wurden, suche in anderen Räumen
                for (const roomName in Memory.rooms) {
                    if (roomName !== creep.room.name) {
                        const otherRoom = Game.rooms[roomName];
                        if (otherRoom && Memory.rooms[roomName].sendDebitor) {
                            const otherDrops = otherRoom.find(FIND_DROPPED_RESOURCES);
                            if (otherDrops.length > 0) {
                                if (creep.pickup(otherDrops[0]) === ERR_NOT_IN_RANGE) {
                                    if(creep.store[RESOURCE_ENERGY] >= creep.store.getFreeCapacity()){
                                         creep.memory.collecting = false;
                                    }
                                    
                                    creep.moveTo(otherDrops[0], { visualizePathStyle: { stroke: '#ffaa00' } });
                                }
                                return; // Breche die Schleife ab, wenn Drops gefunden wurden
                            }
                        }
                    }
                }
                
            }
        } else {
            // Wenn der Creep Ressourcen ablegen soll, bewege dich zum Storage und übertrage die Ressourcen
            const storage = Game.getObjectById(creep.memory.storage);;
            if (storage) {
                if (creep.transfer(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
            else 
            {
                 var target = creep.pos.findClosestByPath(FIND_STRUCTURES, 
                {
                    filter: (structure) => 
                    {
                        return (
                            structure.structureType === STRUCTURE_SPAWN     || 
                            structure.structureType === STRUCTURE_EXTENSION || 
                            structure.structureType === STRUCTURE_STORAGE   ||
                            (structure.structureType === STRUCTURE_CONTAINER && structure.id != creep.memory.container )||
                            (structure.structureType === STRUCTURE_TOWER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 50))
                            && structure.store.getFreeCapacity([RESOURCE_ENERGY]) > 0 ;
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
                else
                {
                    if(!creep.memory.home)
                    {
                        creep.memory.home = 'E59N9';
                    }
                  var target = Game.rooms[creep.memory.home].find(FIND_STRUCTURES, 
                    {
                        filter: (structure) => 
                        {
                            return (
                                structure.structureType === STRUCTURE_SPAWN     || 
                                structure.structureType === STRUCTURE_EXTENSION || 
                                structure.structureType === STRUCTURE_STORAGE   ||
                                (structure.structureType === STRUCTURE_CONTAINER && structure.id != creep.memory.container )||
                                (structure.structureType === STRUCTURE_TOWER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 50))
                                && structure.store.getFreeCapacity([RESOURCE_ENERGY]) > 0 ;
                        }
                    });
    
                    if(target.length > 0) 
                    {
                        if(creep.transfer(target[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                        {
                            creep.moveTo(target[0], {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                        return;
                    }  
                }
            }
        }
    }
};