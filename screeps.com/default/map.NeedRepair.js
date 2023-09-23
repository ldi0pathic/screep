 function getPriority(structureType) 
    {
        const priorities =
        {
            [STRUCTURE_TOWER]: 0.6,       
            [STRUCTURE_STORAGE]: 0.75,     
            [STRUCTURE_CONTAINER]: 0.75,    
            [STRUCTURE_WALL]: 0.0005,
            [STRUCTURE_RAMPART]: 0.1,
          
        };
        return priorities[structureType] || 0.5;
    };

module.exports = 
{
   
    
    check: function(roomName)
    {
        let room = Game.rooms[roomName];
       
        if (!room) {return; }
        
        if (!Memory.rooms[roomName].structuresToRepair) 
        {
            Memory.rooms[roomName].structuresToRepair = {};
        }
        
        if(!Memory.rooms[roomName].sendBuilder)
        {
            return;
        }
        
         //prüfe aktuallität der Daten
        if(Memory.rooms[roomName].structuresToRepair)
        {
            for (let id in Memory.rooms[roomName].structuresToRepair) 
            {
                let structure = Game.getObjectById(id);
               
                if(!structure || structure.hits === structure.hitsMax)
                {
                    delete Memory.rooms[roomName].structuresToRepair[id];
                }
                else
                {
                    Memory.rooms[roomName].structuresToRepair[structure.id].progress = ((structure.hits / structure.hitsMax) * 100)
                }
            }
        }
        
        {
            const structuresToRepair = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.hits < getPriority(structure.structureType) * structure.hitsMax)
                }});
    
            for (let structure of structuresToRepair) 
            {
                if (!Memory.rooms[roomName].structuresToRepair[structure.id]) 
                {
                    Memory.rooms[roomName].structuresToRepair[structure.id] = 
                    {
                        id:structure.id,
                        x: structure.pos.x,
                        y: structure.pos.y,
                        structureType: structure.structureType,
                        progress: ((structure.hits / structure.hitsMax) * 100)
                    };
                }
            } 
        }
        
    }
};