const _ = require('lodash');

var newRoom =
{
    add: function(name)
    {
        if(!Memory.rooms)
        {
            Memory.rooms = {};
        }

        let newRoom = Game.rooms[name];
        
        if(!newRoom)
        {
            return;
        }
        
        if (!Memory.rooms[newRoom.name]) 
        {
            Memory.rooms[newRoom.name] = {};
        }
        
        if (!Memory.rooms[newRoom.name].sources) 
        {
            Memory.rooms[newRoom.name].sources = {};
        }
        
      

        let sources = newRoom.find(FIND_SOURCES);
        let needContOfMiners = 0;
        for (let source of sources) 
        {
            let containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
                filter: { structureType: STRUCTURE_CONTAINER }
            });

            Memory.rooms[newRoom.name].sources[source.id] = {};
            Memory.rooms[newRoom.name].sources[source.id].containers = {};
           
            for(var c = 0; c < containers.length; c++)
            {
                if(!Memory.rooms[newRoom.name].sources[source.id].containers[containers[c].id])
                {
                    Memory.rooms[newRoom.name].sources[source.id].containers[containers[c].id] = { aktiv: containers[c].isActive() };
                    
                    if(containers[c].isActive())
                    {
                      needContOfMiners++;
                    }
                }
            }
        }
        
        let minerals = newRoom.find(FIND_MINERALS);
        if(newRoom.controller.my && newRoom.controller.level >= 6)
        {
              if (!Memory.rooms[newRoom.name].minerals) 
                {
                    Memory.rooms[newRoom.name].minerals = {};
                }
            for (let mineral of minerals) 
            {
                let containers = mineral.pos.findInRange(FIND_STRUCTURES, 1, {
                    filter: { structureType: STRUCTURE_CONTAINER }
                });
    
                Memory.rooms[newRoom.name].minerals[mineral.id] = {};
                console.log(mineral.mineralType);
                Memory.rooms[newRoom.name].minerals[mineral.id].type = mineral.mineralType;
                Memory.rooms[newRoom.name].minerals[mineral.id].containers = {};
               
                for(var c = 0; c < containers.length; c++)
                {
                    if(!Memory.rooms[newRoom.name].minerals[mineral.id].containers[containers[c].id])
                    {
                        Memory.rooms[newRoom.name].minerals[mineral.id].containers[containers[c].id] = { aktiv: containers[c].isActive() };
                        
                        if(containers[c].isActive())
                        {
                          needContOfMiners++;
                        }
                    }
                }
            }
        }
        
        Memory.rooms[newRoom.name].sendMiner = Memory.rooms[newRoom.name].sendMiner? true: false;
        Memory.rooms[newRoom.name].contOfMiner = Memory.rooms[newRoom.name].sendMiner ? needContOfMiners : 0;
        Memory.rooms[newRoom.name].sendDebitor = Memory.rooms[newRoom.name].sendDebitor ? true: false;
        Memory.rooms[newRoom.name].mulDebitor = Memory.rooms[newRoom.name].mulDebitor? Memory.rooms[newRoom.name].mulDebitor : 1;
        Memory.rooms[newRoom.name].sendBuilder = Memory.rooms[newRoom.name].sendBuilder ? true : false;
        Memory.rooms[newRoom.name].mainSpawn =  Memory.rooms[newRoom.name].mainSpawn ?  Memory.rooms[newRoom.name].mainSpawn : 'E58N7';
        Memory.rooms[newRoom.name].defend = Memory.rooms[newRoom.name].defend ? true: false;
        Memory.rooms[newRoom.name].claim = Memory.rooms[newRoom.name].claim ? true: false;
       
    }
}



module.exports = newRoom;