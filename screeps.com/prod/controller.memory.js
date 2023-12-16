module.exports = {
    init: function()
    { 
        if(Memory.init)
            return;

        if(!Memory.rooms)
        {
            Memory.rooms = {};
        }

        for(var name in global.room)
        {
            if (!Memory.rooms[name]) 
            {
                Memory.rooms[name] = {};
            }

            Memory.rooms[name].aktivPrioSpawn = Memory.rooms[name].aktivPrioSpawn ? true : false;
            Memory.rooms[name].hasLinks = Memory.rooms[name].hasLinks? true : false;
            Memory.rooms[name].needDefence = Memory.rooms[name].needDefence ? true: false;
            Memory.rooms[name].invaderCore =  Memory.rooms[name].invaderCore ? true : false;
            Memory.rooms[name].nuke =  Memory.rooms[name].nuke ? true : false;
        
            Memory.init = true;
        }
    },
    writeStatus: function()
    {
        var msg = "";
        for(var room in Memory.rooms)
        {
           if(Memory.rooms[room].aktivPrioSpawn)
           {
                msg += "PrioSpawn im Raum "+room+"\n";
           }
           if(Memory.rooms[room].needDefence)
           {
                msg += "Angriff im Raum "+room+"\n";
           }
           if(Memory.rooms[room].invaderCore)
           {
                msg += "Core im Raum "+room+"\n";
           }
        }
        if(msg != "")
            console.log(msg);
    },
    FindAndSaveRoomWalls: function()
    {
        if(!Memory.rooms)
        {
            Memory.rooms = {};
        }

        for(var name in global.room)
        {
            if(global.room[name].maxwallRepairer < 1)
                continue;

            if (!Memory.rooms[name]) 
            {
                Memory.rooms[name] = {};
            }


            var room = Game.rooms[global.room[name].room];

            var walls = room.find(FIND_STRUCTURES,  {filter: (structure) => 
                {
                    return  (structure.structureType === STRUCTURE_WALL || 
                    structure.structureType === STRUCTURE_RAMPART) 
                }});
           
            Memory.rooms[name].wally = walls.map( w => {
                return w.id
            });
            console.log("done :)")
            
        }
    }
};