module.exports = {
    run: function (creep) {
        // Überprüfe, ob das Flag "startAttack" auf "true" gesetzt ist
        if (Memory.startAttack) 
        {
            if (creep.memory.target !== creep.room.name) 
            {
                creep.say('⏩')
                creep.moveTo(new RoomPosition(25, 25, creep.memory.target), { visualizePathStyle: { stroke: '#ffffff' } });
                return;
            }
            else
            {
                const hostileCreep = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

                if (hostileCreep) {
                    // Greife den nächstgelegenen feindlichen Creep an
                    if (creep.attack(hostileCreep) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(hostileCreep, { visualizePathStyle: { stroke: '#ff0000' } });
                    }
                    return;
                } 
                
                var controller = creep.room.controller;
                
                 if (controller && !controller.my) {
                
                    if (creep.attackController(controller) === ERR_NOT_IN_RANGE) 
                    {
                        creep.say('🪓')
                        creep.moveTo(controller, { visualizePathStyle: { stroke: '#ff0000' } });
                    }
                 }
            
            }
        } else {
            // Wenn das Flag "startAttack" auf "false" gesetzt wurde, kehre zum Spawn zurück
            const spawn = Game.spawns['P1'];
            if (creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(spawn, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
    }
};