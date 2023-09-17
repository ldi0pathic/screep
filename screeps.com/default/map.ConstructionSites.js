module.exports = 
{
    check: function(roomName)
    {
        let room = Game.rooms[roomName];
       
        if (!room) {return; }
        
        if (!Memory.rooms[roomName].constructionSites) 
        {
            Memory.rooms[roomName].constructionSites = {};
        }
        
        if(!Memory.rooms[roomName].sendBuilder)
        {
            return;
        }
        
        //prüfe aktuallität der Daten
        if(Memory.rooms[roomName].constructionSites)
        {
            for (let id in Memory.rooms[roomName].constructionSites) 
            {
                let structure = Game.getObjectById(id);
               
                if(! structure || structure.progressTotal == undefined)
                {
                    delete Memory.rooms[roomName].constructionSites[id];
                }
                else
                {
                    Memory.rooms[roomName].constructionSites[structure.id].progress = ((structure.progress / structure.progressTotal) * 100)
                }
            }
        }
        
        {
            let constructionSites = room.find(FIND_CONSTRUCTION_SITES);
    
            for (let structure of constructionSites) 
            {
                if (!Memory.rooms[roomName].constructionSites[structure.id]) 
                {
                    Memory.rooms[roomName].constructionSites[structure.id] = 
                    {
                        id:structure.id,
                        x: structure.pos.x,
                        y: structure.pos.y,
                        structureType: structure.structureType,
                        progress: ((structure.progress / structure.progressTotal) * 100)
                    };
                }
            } 
        }
    }
}






