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
            console.log(name);
                      
            if (!Memory.rooms[name]) 
            {
                Memory.rooms[name] = {};
            }

            Memory.rooms[name].aktivPrioSpawn = Memory.rooms[name].aktivPrioSpawn ? true : false;
            Memory.rooms[name].hasLinks = Memory.rooms[name].hasLinks? true : false;
            
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
        }
        if(msg != "")
            console.log(msg);
    }
}