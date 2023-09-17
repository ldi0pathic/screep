const prioBuilds = ['64fb3dc4b140246d9bd1f0dd','64faa4011ae98a0ce014fda8','6503899d63cdd5c5b24f986e'];

module.exports = {
    run: function(creep) {
        if (creep.memory.building && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.building = false;
            creep.memory.repairs = creep.memory.repairs+1;
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
               for(var i = 0; i<prioBuilds.length; i++)
               {
                   const target = Game.getObjectById(prioBuilds[i]);
                    if (target && target.progressTotal == undefined && target.hits < target.hitsMax*0.9) 
                    {
                        creep.memory.prioId = prioBuilds[i];
                        console.log('repair prio :)');
                        return;
                    } 
               }
               
               // Wenn der Creep im Baumodus ist, überprüfe, ob er Baustellen im Speicher hat
                let constructionSites = Memory.rooms[creep.room.name].structuresToRepair;
                if (Object.keys(constructionSites).length > 0) 
                {
                  let roomSitesWithPriority = Object.values(constructionSites)
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
   
                    if (roomSitesWithPriority.length > 0) 
                    {
                        creep.memory.prioId = roomSitesWithPriority[0].site.id;
                    }  
                }
                else
                {
                    for (const roomName in Memory.rooms) 
                    {
                        if (roomName !== creep.room.name) 
                        {
                            const otherConstructionSites = Memory.rooms[roomName].structuresToRepair;
                            if (otherConstructionSites && Object.keys(otherConstructionSites).length > 0) 
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
                
                if (target && target.hits < target.hitsMax) 
                {
                    const result = creep.repair(target);
                    
                    if (result === ERR_NOT_IN_RANGE) 
                    {
                        creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                    } 
                    
                    if(creep.memory.repairs < 5)
                    {
                        return; 
                    }
                } 
                creep.memory.repairs = 0;
                creep.memory.prioId = null;
                
           }
        } 
        
        const container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => {
                    return (
                        (s.structureType === STRUCTURE_CONTAINER || s.structureType === STRUCTURE_STORAGE) &&
                        s.store.getUsedCapacity(RESOURCE_ENERGY) > 50
                    );
                }
            });

        if (container) {
            if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(container, { visualizePathStyle: { stroke: '#ffaa00' } });
                return;
            }
        } else {
           
            const source = creep.pos.findClosestByPath(FIND_SOURCES);
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
                return;
            }
            
            creep.moveTo(new RoomPosition(25, 25,Game.spawns.P1.room.name), {visualizePathStyle: {stroke: '#ffffff'},reusePath: 10});
        }
    },
    
    getPriority: function(structureType) {
        // Je niedriger die Priorität, desto wichtiger ist das Gebäude.
        const priorities = {
            [STRUCTURE_RAMPART]: 1,
            [STRUCTURE_EXTENSION]: 1,
            [STRUCTURE_SPAWN]: 2,
            [STRUCTURE_TOWER]: 3,
            [STRUCTURE_STORAGE]: 4,
            [STRUCTURE_CONTAINER]: 5,
            [STRUCTURE_ROAD]:6,
            
        };

        return priorities[structureType] || 7; // Standardpriorität, wenn nicht definiert
    },
};

