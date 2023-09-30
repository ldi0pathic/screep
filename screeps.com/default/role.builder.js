module.exports = {
    run: function(creep) {
        if (creep.memory.building && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.building = false;
            creep.say('🔄 Harvest');
        }
        if (!creep.memory.building && creep.store.getFreeCapacity() === 0) {
            creep.memory.building = true;
            creep.say('🚧 Build');
        }

        if (creep.memory.building) 
        {
           if(!creep.memory.prioId)
           { 
              
               //creep.memory.prioId = '65173253fbeacecb3765a85a';
               //return;
               
               // Wenn der Creep im Baumodus ist, überprüfe, ob er Baustellen im Speicher hat
                const constructionSites = Memory.rooms[creep.room.name].constructionSites;
                if (Object.keys(constructionSites).length > 0 && Memory.rooms[creep.room.name].sendBuilder) 
                {
                    const sitesWithPriority = Object.values(constructionSites)
                        .map(site => ({
                            site,
                            progress: site.progress,
                            priority: this.getPriority(site.structureType)
                        }))
                        .sort((a, b) => {
                            if (a.priority === b.priority) {
                                return b.progress - a.progress;
                            }
                            return a.priority - b.priority;
                        });
                        
                        //console.log(JSON.stringify(sitesWithPriority));
                    
                    if (sitesWithPriority.length > 0) 
                    {
                        creep.memory.prioId = sitesWithPriority[0].site.id;
                    }
                }
                else
                {
                    for (const roomName in Memory.rooms) 
                    {
                        if (roomName !== creep.room.name) 
                        {
                            const otherConstructionSites = Memory.rooms[roomName].constructionSites;
                           
                            if (Memory.rooms[roomName].sendBuilder && otherConstructionSites && Object.keys(otherConstructionSites).length > 0) 
                            {
                                creep.say('⏩')
                                creep.moveTo(new RoomPosition(25, 25, roomName), { visualizePathStyle: { stroke: '#ffffff' } });
                                return;
                            }
                        }
                    }
                }
                
           }
           else
           {
              
                const target = Game.getObjectById(creep.memory.prioId);

                if (target && target.progressTotal != undefined) 
                {
                    const result = creep.build(target);

                    if (result === ERR_NOT_IN_RANGE) 
                    {
                       var r =  creep.moveTo(target,{ visualizePathStyle: { stroke: '#ffffff' } });
                    } 
                    return;
                } 
                else 
                {
                    creep.memory.prioId = null;
                }
           }
        } 
        
        const container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => {
                    return (
                        (s.structureType === STRUCTURE_CONTAINER ||
                         s.structureType === STRUCTURE_STORAGE) &&
                        s.store.getUsedCapacity(RESOURCE_ENERGY) > 0
                    );
                }
            });

        if (container) {
            if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(container, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        } else {
            // Wenn kein Container verfügbar ist, ernte von einer Energiequelle
            const source = creep.pos.findClosestByPath(FIND_SOURCES);
            var state = creep.harvest(source);
          creep.say(state)
            if (state === ERR_NOT_IN_RANGE) {
               
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
                return;
            }
           
            //creep.moveTo(new RoomPosition(25, 25,Game.spawns.P1.room.name), {visualizePathStyle: {stroke: '#ffffff'},reusePath: 10});
            
        }
    },
    
    getPriority: function(structureType) {
        // Je niedriger die Priorität, desto wichtiger ist das Gebäude.
        const priorities = {
             [STRUCTURE_RAMPART]: 2,
            [STRUCTURE_EXTENSION]: 2,
            [STRUCTURE_SPAWN]: 1,
            [STRUCTURE_WALL]:2,
            [STRUCTURE_TOWER]: 3,
            [STRUCTURE_STORAGE]: 4,
            [STRUCTURE_CONTAINER]: 5,
        };

        return priorities[structureType] || 6; // Standardpriorität, wenn nicht definiert
    },
};

