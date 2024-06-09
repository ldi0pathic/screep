
module.exports = {
    rebuildRoads: function()
    {
        for(var name in global.room)
        {
            if(!global.room[name].saveRoads)
                continue;

            const roomMemory = Memory.rooms[name];
            if (!roomMemory || !roomMemory.roads) 
                continue;

            for (const roadMemory of roomMemory.roads)
            {
                const road = Game.getObjectById(roadMemory.id);
                if (!road) 
                { 
                    const pos = new RoomPosition(roadMemory.pos.x, roadMemory.pos.y, name);
                    pos.createConstructionSite(STRUCTURE_ROAD);
                    Memory.rooms[name].autobuild = (Memory.rooms[name].autobuild || 0) + 1;
                }
            } 
        }
    }
}