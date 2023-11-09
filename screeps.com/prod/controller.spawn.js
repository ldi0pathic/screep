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
                var workroom = global.room[room].room;
             
                if(global.room[workroom].sendDefender && (Memory.rooms[workroom].needDefence || Memory.rooms[workroom].invaderCore))
                {
                    jobs.defender.spawn(spawn,workroom);       
                    continue;   
                }
             
                if( global.room[room].spawnRoom != spawn.room.name)
                    continue;

                if(Memory.rooms[workroom].invaderCore)
                    continue;

                for(var job in jobs)
                {     
                    if(jobs[job].spawn(spawn,workroom))
                        break;
                }

                if(spawn.spawning) 
                    break;
             }   
        }
    }
}