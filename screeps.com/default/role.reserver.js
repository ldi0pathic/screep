/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.reserver');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    spawn: function(spawn,room)
    {
        const body = [CLAIM, CLAIM, MOVE,MOVE];
       if (!Game.creeps[room]) {
        
         if( spawn.spawnCreep(body, room,{dryRun: true}) === 0)
            {
                spawn.spawnCreep(body, room, {memory: {role: 'reserver',  target: room, spawn:spawn.name}});
                console.log(spawn.name+'spawn '+room+' für Raum'+room+' cost: '+calcProfil(body));
                return true;
            }
         return false;
       }
      
    },
    run: function(creep)
    {
        if (creep.memory.target && creep.memory.target !== creep.room.name) 
    	{
    		creep.say('⏩')
    		creep.moveTo(new RoomPosition(25, 25, creep.memory.target), { visualizePathStyle: { stroke: '#ffffff' } });
    		return;
    	}
    	else
    	{
    	    
    	    const controller = Game.rooms[creep.memory.target].controller;
    	    
    	    

            if (controller) {
                
                if(creep.name == 'E58N6')
                {
                    	var s = creep.claimController(controller);
                    	creep.say(s);
                    	return;
                }
                var state = creep.reserveController(controller);
                if (state === ERR_NOT_IN_RANGE) {
                    creep.moveTo(controller, { visualizePathStyle: { stroke: "#ffaa00" } });
                }
                else if(state == ERR_INVALID_TARGET)
                {
                    creep.say('🪓')
                    var s = creep.attackController(controller);
                }
               
               
                //creep.signController(controller,'⚔')
            }
    	}
    }

};
function calcProfil(creepProfile) {
    let energyCost = 0;

    for (const bodyPart of creepProfile) {
        energyCost += BODYPART_COST[bodyPart];
    }

    return energyCost;
}