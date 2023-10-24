const  timer = require('./controller.timing');
const jobs = require('./creep.jobs');

module.exports.loop = function () {

    var towers = ['65328a90cd129d63b16777c1','6534fcc0e834a829d189898d','64fc6a640286a021f3e07364','64f483648bfafd0f57771802','6519806365d810feb3057d57','65216e233f4dce97e75b50f3','65043f57f265d290da2a0899','65369ba3951a2e9751279f67','65372b6b2fab58e38472e156','6537df14951a2e4b1927f381']
    
    
    for(var t in towers)
    {
        var tower = Game.getObjectById(towers[t]);
   
        if(tower) 
        {
           
          var hostileCreeps = tower.room.find(FIND_HOSTILE_CREEPS);

            if (hostileCreeps.length > 0) {
                // Sortiere die feindlichen Creeps nach ihren Bodypart-Kosten in absteigender Reihenfolge
                hostileCreeps.sort(function (a, b) {
                    var costA = a.body.reduce(function (total, part) {
                        return total + BODYPART_COST[part.type];
                    }, 0);
    
                    var costB = b.body.reduce(function (total, part) {
                        return total + BODYPART_COST[part.type];
                    }, 0);
    
                    return costB - costA;
                });
    
                // Greife den teuersten feindlichen Creep an
                tower.attack(hostileCreeps[0]);
            }
            else if(tower.store.getUsedCapacity([RESOURCE_ENERGY]) > tower.store.getFreeCapacity([RESOURCE_ENERGY]))
            {
                var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => 
                                   {
                                       const priority = global.prio.hits[structure.structureType] || 0.5;
                                       return priority && structure.hits < structure.hitsMax * priority;
                                   }
                               });
                   if(closestDamagedStructure) {
                       tower.repair(closestDamagedStructure);
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