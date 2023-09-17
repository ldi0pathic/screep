module.exports = {
    run: function (roomName) 
    {
        
        var room = Game.rooms[roomName];
        if(room && Memory.rooms[roomName].defend)
        {
           
            
            const hostiles = room.find(FIND_HOSTILE_CREEPS);
            //console.log(roomName+'>>>'+hostiles.length)
            if (hostiles.length > 0) {
                
                var c = _.filter(Game.creeps, (creep) => creep.memory.role == 'defender' && creep.memory.target == roomName).length;
                
                if(c > (hostiles.length*3))
                {
                    Memory.prioAttack = false;
                     return;
                }
                Memory.prioAttack = true;
                    
                // Erstelle einen bewaffneten Creep
                let spawn = Game.spawns['P1']; // Ersetze 'Spawn1' durch den Namen deines Spawns
                let r = spawn.spawnCreep([TOUGH,TOUGH,ATTACK, ATTACK,RANGED_ATTACK, MOVE, MOVE, MOVE], 'defender' + Game.time, { memory: { role: 'defender', target:roomName} });
    
                if (r === OK) {
                    console.log(`P1: Verteidiger für Raum ${roomName} erstellt.`);
                }
                
                let spawn2 = Game.spawns['P2']; // Ersetze 'Spawn1' durch den Namen deines Spawns
                let r2 = spawn2.spawnCreep([TOUGH,TOUGH,ATTACK, ATTACK,RANGED_ATTACK, MOVE, MOVE, MOVE], 'defender' + Game.time, { memory: { role: 'defender', target:roomName } });
    
                if (r2 === OK) {
                    console.log(`P2: Verteidiger für Raum ${roomName} erstellt.`);
                }
            }
        }
        
    },

};