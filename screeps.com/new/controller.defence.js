module.exports = {
    check: function()
    { 
        for(var name in global.room)
        {  
            if(! global.room[name].sendDefender)
                continue;
            
            var room = Game.rooms[global.room[name].room];

            if(!room)
                continue;

            var hostiles = room.find(FIND_HOSTILE_CREEPS);
            var core = room.find(FIND_HOSTILE_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_INVADER_CORE});

            Memory.rooms[name].needDefence = hostiles.length > 0;
            Memory.rooms[name].invaderCore = core.length > 0;
        }
    },
};