module.exports = {
    run: function (creep) {
        
        if(!creep.memory.target)
            creep.role = '';
            
        if(creep.memory.target != creep.room.name)
         {
             var room = new RoomPosition(25, 25, creep.memory.target); 
             creep.moveTo(room, {visualizePathStyle: {stroke: '#ffffff'}});
         }
         else
         {
              const enemies = creep.room.find(FIND_HOSTILE_CREEPS);

                if (enemies.length > 0) {
                    // Wähle das nächstgelegene feindliche Creep aus
                    const target = creep.pos.findClosestByRange(enemies);

                    // Greife das feindliche Creep an
                    const result = creep.attack(target);
                    creep.rangedAttack(target);

                    if (result === OK) {
                        console.log(`${creep.name} greift ${target.name} an.`);
                    }
                    else
                    {
                        creep.say('✊')
                        creep.moveTo(target);
                    }
                }
                else
                {
                    const flags = Game.rooms[creep.room.name].find(FIND_FLAGS);
                    if (flags.length > 0)
                    {
                        creep.moveTo(flags[0],{ visualizePathStyle: { stroke: '#ffffff' } });
                        return;
                    }
                }
                
                if (creep.getActiveBodyparts(ATTACK) === 0) {
                        // Falls keine ATTACK-Körperteile mehr vorhanden sind, führe den Selbstmordbefehl aus
                        creep.say('💥 Bye!');
                        creep.suicide();
                    }
         }
    },
};