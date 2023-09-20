const jobs = require('./creep.jobs');

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

             for(var room in global.room)
             {
                if( global.room[room].spawnRoom != spawn.room.name)
                    continue;

                for(var job in jobs)
                {
                    if(jobs[job].spawn(spawn,spawn.room.name))
                        break;
                }

                if(spawn.spawning) 
                    break;
             }   
        }
    }
}