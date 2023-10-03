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
                
                if(c > (count*5))
                {
                    Memory.prioAttack = false;
                     return;
                }
               Memory.prioAttack = true; 
                    
                // Erstelle einen bewaffneten Creep
                let spawn = Game.spawns['P1']; // Ersetze 'Spawn1' durch den Namen deines Spawns
                let r = spawn.spawnCreep(profil, 'defender' + Game.time, { memory: { role: 'defender', target:roomName} });
    
                if (r === OK) {
                    console.log(`P1: Verteidiger für Raum ${roomName} erstellt.`);
                }
                
                let spawn2 = Game.spawns['P2']; // Ersetze 'Spawn1' durch den Namen deines Spawns
                let r2 = spawn2.spawnCreep(profil, 'defender' + Game.time, { memory: { role: 'defender', target:roomName } });
    
                if (r2 === OK) {
                    console.log(`P2: Verteidiger für Raum ${roomName} erstellt.`);
                }
                
                 let spawn3 = Game.spawns['P3']; // Ersetze 'Spawn1' durch den Namen deines Spawns
                let r3 = spawn3.spawnCreep(profil, 'defender' + Game.time, { memory: { role: 'defender', target:roomName } });
    
                if (r3 === OK) {
                    console.log(`P3: Verteidiger für Raum ${roomName} erstellt.`);
                }
            }
        }
        
    },

};