module.exports = {
    init: function()
    { 
        if(!Memory.rooms)
        {
            Memory.rooms = {};
        }

        for(var name in global.room)
        {
            let newRoom = Game.rooms[name];
            
            if(!newRoom)
            {
                return;
            }
            
            if (!Memory.rooms[newRoom.name]) 
            {
                Memory.rooms[newRoom.name] = {};
            }

            Memory.rooms[newRoom.name].aktivPrioSpawn = false;
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
        }
    }
}