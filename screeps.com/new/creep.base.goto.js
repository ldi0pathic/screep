module.exports = 
{  
    goToMyHome: function(creep)
    {
        if (creep.memory.home && creep.room.name !== creep.memory.home) 
        {
            const exitDir = creep.room.findExitTo(creep.memory.home);
            const exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit, {reusePath: 5});
            return true;
        }
        return false;
    },
    goToRoomFlag:function(creep)
    {
        const flags = creep.room.find(FIND_FLAGS);
        if (flags.length > 0)
        {
            creep.moveTo(flags[0], {reusePath: 5});
            return true;
        }
        return false;
    },
    goToWorkroom:function(creep)
    {
        if(creep.memory.workroom && creep.memory.workroom != creep.room.name)
        {
            var room = new RoomPosition(25, 25, creep.memory.workroom); 
            creep.moveTo(room, {reusePath: 5});
            return true;
        }
        return false;
    },
};