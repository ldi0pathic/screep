module.exports = {
    run: function (roomName) 
    {
        
        var room = Game.rooms[roomName];
        if(room && Memory.rooms[roomName].defend)
        {
           var profil = [TOUGH,TOUGH,MOVE, MOVE, MOVE,MOVE, ATTACK, ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK]
            
            const hostiles = room.find(FIND_HOSTILE_CREEPS);
            
           
            var count = hostiles.length;
           
           
            //console.log(roomName+'>>>'+hostiles.length)
            if (count > 0) {
                
                var c = _.filter(Game.creeps, (creep) => creep.memory.role == 'defender' && creep.memory.target == roomName).length;
                
                if(c > (count*3))
                {
                    Memory.prioAttack = false;
                     return;
                }
               Memory.prioAttack = true; 
               
               for(var name in Game.spawns)
               {
                    let spawn = Game.spawns[name]; 
                    if(spawn)
                    {
                        let r = spawn.spawnCreep(profil, 'defender' + Game.time, { memory: { role: 'defender', target:roomName} });
        
                        if (r === OK) {
                            console.log(name+': Verteidiger für Raum ' +roomName+' erstellt.');
                        }
                    }
               }
            }
        }
        
    },

};