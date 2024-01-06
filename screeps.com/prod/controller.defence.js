module.exports = {
    check: function()
    { 
        for(var name in global.room)
        {  
            if(! global.room[name].sendDefender)
                continue;

            if((Game.time + 10) > Memory.rooms[name].invaderCoreEndTick )
            {
                Memory.rooms[name].invaderCore = false;
            }
            
            if((Game.time + 10) > Memory.rooms[name].needDefenceEndTick )
            {
                Memory.rooms[name].needDefence = false;
            }
            
            var room = Game.rooms[global.room[name].room];

            if(!room)
                continue;

            var hostiles = room.find(FIND_HOSTILE_CREEPS);
            var core = room.find(FIND_HOSTILE_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_INVADER_CORE});
            var nukes = room.find(FIND_NUKES);

            Memory.rooms[name].needDefence = hostiles.length > 0;
            if(hostiles.length > (global.room[name].minHostile || 1))
            {
                let maxLifeTime = 0;

                for (var creep of hostiles) {
                    if (creep.ticksToLive !== undefined && creep.ticksToLive > maxLifeTime) {
                        maxLifeTime = creep.ticksToLive;
                    }
                }
                Memory.rooms[name].needDefenceEndTick = Game.time + maxLifeTime;
            }
            
            Memory.rooms[name].invaderCore = core.length > 0;
            if(core.length > 0)
            {
                Memory.rooms[name].claimed = false;
                var timeRemaining = 0;
                for(var effect in core[0].effects) //todo gibt es cores mit meheren effekten? addieren sich diese? 
                {
                    var remainingTicks = core[0].effects[effect].ticksRemaining;
                    var totalTicks = core[0].effects[effect].ticks;
                    time = totalTicks - remainingTicks;
                    if(time > timeRemaining)
                    {
                        timeRemaining = timeRemaining;
                    }
                }
                Memory.rooms[name].invaderCoreEndTick = Game.time + timeRemaining;
            }    

            if(nukes.length > 0 )
            {
                var msg = "";
                Memory.rooms[name].nukepos = [];
                for(var nuke of nukes)
                {
                    msg += "Raum "+nuke.room+ " wird in "+nuke.timeToLand+" ticks von Raum "+nuke.launchRoomName+" aus genuked!\r\n";
                   
                    if(!Memory.rooms[name].nukepos.includes(nuke.pos))
                        Memory.rooms[name].nukepos.push(nuke.pos);
                }

                if(msg.length > 0 && !Memory.rooms[name].nuke)
                    Game.notify(msg);   
            }
            else
            {  if (Memory.rooms[name].nukepos) 
                    Memory.rooms[name].nukepos = [];
            }
           
            Memory.rooms[name].nuke = nukes.length > 0;
        }
    },
    tower: function()
    {
        for(var name in global.room)
        {  
            var room = Game.rooms[name];
            if(!room ||  !room.controller || !room.controller.my|| !Memory.rooms[name].tower || Memory.rooms[name].tower.length == 0)
                continue;  

            if(Memory.rooms[name].needDefence)
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
    
                    for(var towerid of Memory.rooms[name].tower)
                    {
                            var tower = Game.getObjectById(towerid);
                            if(tower)
                                tower.attack(hostileCreeps[0]);
                    }
                    
                }
                else
                {
                    Memory.rooms[name].needDefence = false;
                }
            }   
            else if( Game.time %3 == 2)
            {
                var damagedStructures = room.find(FIND_STRUCTURES,
                {
                    filter: (structure) => 
                    {
                        return (structure.hits < (global.prio.hits[structure.structureType] || 0.5) * structure.hitsMax)
                    }
                });

                if(damagedStructures.length > 0) 
                {
                    damagedStructures.sort((a, b) => {
                        const priorityA = global.prio.repair[a.structureType] || 10;
                        const priorityB = global.prio.repair[b.structureType] || 10;

                        const damageA = a.hitsMax - a.hits;
                        const damageB = b.hitsMax - b.hits;
                    
                        const scoreA = priorityA * damageA;
                        const scoreB = priorityB * damageB;
                        return scoreA - scoreB;
                    });

                    for(var towerid of Memory.rooms[name].tower)
                    { 
                        var tower = Game.getObjectById(towerid);
                        if(tower)
                            tower.repair(damagedStructures[0]);
                    }
                    
                }
            }
        }
    }
};