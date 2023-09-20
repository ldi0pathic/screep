module.exports = {
    run: function (creep) {
        // Überprüfe, ob das Flag "startAttack" auf "true" gesetzt ist
        return;
            if (creep.memory.target !== creep.room.name) 
            {
                creep.say('⏩')
                creep.moveTo(new RoomPosition(25, 25, creep.memory.target), { visualizePathStyle: { stroke: '#ffffff' } });
                return;
            }
            else
            {
                creep.say('hey')
                var controller = creep.room.controller;
                //console.log(controller.my)
                 if (controller && !controller.my) {
                
                var state = creep.attackController(controller);
                //console.log(state)
                    if ( state === ERR_NOT_IN_RANGE) 
                    {
                        creep.say('🪓')
                        creep.moveTo(controller, { visualizePathStyle: { stroke: '#ff0000' } });
                    }
                    else
                    {
                        creep.signController(controller,"Signed by Idiopathic :o)")
                    }
                 }
            
            }
       
    },
     spawn: function(spawn,room)
    {
       var body = [CLAIM,CLAIM, MOVE]
       if (!Game.creeps['ATT_'+room]) {
        
         if( spawn.spawnCreep(body, 'ATT_'+room,{dryRun: true}) === 0)
            {
                spawn.spawnCreep(body, 'ATT_'+room, {memory: {role: 'attacker',  target: room, spawn:spawn.name}});
                console.log(spawn.name+'spawn Attacker_'+room+' für Raum'+room+' cost: '+calcProfil(body));
                return true;
            }
         return false;
       }
      
    },
};

function calcProfil(creepProfile) {
    let energyCost = 0;

    for (const bodyPart of creepProfile) {
        energyCost += BODYPART_COST[bodyPart];
    }

    return energyCost;
}