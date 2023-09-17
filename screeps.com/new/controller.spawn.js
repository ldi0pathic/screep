const jobs = {
    debitor: require('./creep.debitor')
}

module.exports = {
    
    clear: function() {
        for(var name in Memory.creeps) 
        {
            if(!Game.creeps[name]) 
            {
                delete Memory.creeps[name];
            }
        }
    },
    spawn: function()
    {
        for(var spawnName in Game.spawns)
        {
            var spawn = Game.spawns[spawnName];
            
            if(spawn.spawning) 
                continue;

           if(jobs.debitor.spawn(spawn,spawn.room.name))
            continue;


        }
    }
}