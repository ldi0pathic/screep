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

            Memory.rooms[name].needDefence = hostiles.length > 0;
            if(hostiles.length > 0)
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
        }
    },
};