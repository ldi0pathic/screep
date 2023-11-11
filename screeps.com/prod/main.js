const  timer = require('./controller.timing');
const jobs = require('./creep.jobs');

module.exports.loop = function () {
    
    for(var name in global.room)
    {  
        var room = Game.rooms[name];

        if(Memory.rooms[name].nuke && Memory.rooms[name].nukepos.length > 0)
        {
            for(var nuke of Memory.rooms[name].nukepos)
            {
                new RoomVisual(name).circle(nuke.x, nuke.y,{fill: 'transparent', radius: 5, stroke: '#ff0000'});
            }     
        }

        if (room && room.controller && room.controller.my) 
        {
            new RoomVisual(name).text(room.energyAvailable+'/'+room.energyCapacityAvailable, 2, 1, {color: 'white', font: 0.8})


            const towers = room.find(FIND_MY_STRUCTURES, {
                filter: { structureType: STRUCTURE_TOWER }
              });

            for(var tower of towers)
            {
                if(tower) 
                {  
                    var hostileCreeps = tower.room.find(FIND_HOSTILE_CREEPS);
          
                    if (hostileCreeps.length > 0) 
                    {
                        // Sortiere die feindlichen Creeps nach ihren Bodypart-Kosten in absteigender Reihenfolge
                        hostileCreeps.sort(function (a, b) 
                        {
                            var costA = a.body.reduce(function (total, part) 
                            {
                                return total + BODYPART_COST[part.type];
                            }, 0);

                            var costB = b.body.reduce(function (total, part) 
                            {
                                return total + BODYPART_COST[part.type];
                            }, 0);

                            return costB - costA;
                        });

                        // Greife den teuersten feindlichen Creep an
                        tower.attack(hostileCreeps[0]);
                    }
                    else if(tower.store.getUsedCapacity([RESOURCE_ENERGY]) * 0.5 > tower.store.getFreeCapacity([RESOURCE_ENERGY]))
                    {
                        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES,
                        {
                            filter: (structure) => 
                            {
                                const priority = global.prio.hits[structure.structureType] || 0.5;
                                return priority && structure.hits < structure.hitsMax * priority;
                            }
                        });
                        if(closestDamagedStructure) 
                        {
                            tower.repair(closestDamagedStructure);
                        }
                    }
                }
            }
        }
    }

    for(var name in Game.creeps) 
    {
        var creep = Game.creeps[name];

        if(!creep)
            continue;

        try 
        {
            if(creep.memory.role)
            {
                jobs[creep.memory.role].doJob(creep);
            }
           
        } 
        catch (error)
        {
            console.log("Job: "+creep.memory.role);
            throw error;
        }
    }

    timer.controll();

}