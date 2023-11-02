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
                if(Memory.rooms[global.room[room].room].needDefence)
                {
                    jobs.defender.spawn(spawn,global.room[room].room);
                    continue;
                }
                
                if( global.room[room].spawnRoom != spawn.room.name)
                    continue;

                if(Memory.rooms[global.room[room].room].invaderCore)
                    continue;

                for(var job in jobs)
                {     
                    if(jobs[job].spawn(spawn,global.room[room].room))
                        break;
                }

                if(spawn.spawning) 
                    break;
             }   
        }
    }
}