module.exports = 
{  
    goToMyHome: function(creep)
    {
        if (creep.memory.home && creep.room.name !== creep.memory.home) 
        {
            var room = new RoomPosition(25, 25, creep.memory.home); 
            return this.moveByMemory(creep, room);
        }
        return false;
    },
    goToRoomFlag:function(creep)
    {
        if(creep.memory.workroom != creep.memory.home)
        {
            const flags = creep.room.find(FIND_FLAGS);
            if (flags.length > 0 && !creep.pos.inRangeTo(flags[0].pos, 2))
            {
                return this.moveByMemory(creep, flags[0].pos);;
            }
        }
        return false;
    },
    goToWorkroom:function(creep)
    {
        if(creep.memory.workroom && creep.memory.workroom != creep.room.name)
        {
            var room = new RoomPosition(25, 25, creep.memory.workroom); 
            return this.moveByMemory(creep, room);
        }
        return false;
    },

    moveByMemory: function(creep, target)
    {
        if(creep.pos.isEqualTo(target))
        {
            delete creep.memory.path;
            delete creep.memory.pathTarget;
            delete creep.memory.dontMove;
            delete creep.memory.lastPos;
            return false;
        }

        if( creep.memory.dontMove > 3 )
        {
            var path = creep.pos.findPathTo(target, { ignoreCreeps: false }); 
            serializedPath = Room.serializePath(path);
            creep.memory.path = serializedPath;

            creep.memory.dontMove = 0;
               
            return true; 
        }

        var serializedPath;
        var t = creep.memory.pathTarget;
        var p = creep.memory.path;
      
        if(p && t && t.roomName && target.isEqualTo(new RoomPosition(t.x, t.y, t.roomName)) )
        {
            serializedPath = p;
        }
        else
        {
            var path = creep.pos.findPathTo(target, { ignoreCreeps: true }); 
            serializedPath = Room.serializePath(path);
            creep.memory.path = serializedPath;

            creep.memory.pathTarget = {};
            creep.memory.pathTarget.x = target.x;
            creep.memory.pathTarget.y = target.y;
            creep.memory.pathTarget.roomName = target.roomName;
        }

        

        var state = creep.moveByPath(serializedPath);
        //creep.say(state);
        switch(state)
        {
            case OK: 
            case ERR_TIRED:
            {
                if(creep.memory.lastPos && creep.memory.lastPos.x == creep.pos.x && creep.memory.lastPos.y == creep.pos.y )
                {
                    creep.memory.dontMove = creep.memory.dontMove +1;  
                }
                else
                {
                    creep.memory.lastPos = {};
                    creep.memory.lastPos.x = creep.pos.x;
                    creep.memory.lastPos.y = creep.pos.y;
                }

                return true;
            }

            case ERR_INVALID_ARGS:
            case ERR_NO_BODYPART:
            case ERR_NOT_FOUND:
            {
                delete creep.memory.path;
                delete creep.memory.pathTarget;
                delete creep.memory.dontMove;
                delete creep.memory.lastPos;
                return true; //damit er sein script für diesen Tick beendet
            } 

            default: 
            return false;
        }
    }
};