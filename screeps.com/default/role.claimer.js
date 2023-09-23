module.exports = {
    run: function(creep) {
		 if (creep.memory.claiming && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.claiming = false;   
            creep.say('🔄 Harvest');
        }
        if (!creep.memory.claiming && creep.store.getFreeCapacity() === 0) {
            creep.memory.claiming = true;
            creep.say('🐧 claim');
        }
		
		if(creep.memory.claiming)
		{
			if (creep.memory.target !== creep.room.name) 
			{
				creep.say('⏩')
				creep.moveTo(new RoomPosition(25, 25, creep.memory.target), { visualizePathStyle: { stroke: '#ffffff' } });
				return;
			}
			// Überprüfen, ob der Controller im Raum vorhanden ist
			const controller = creep.room.controller;
			if (controller  && ! controller.my) {
				// Überprüfen, ob der Controller 0 oder weniger Hits hat
				if (controller.hits <= 0) {
					// Den Controller beanspruchen
					var s = creep.claimController(controller);
					//console.log(s)
					if (s === ERR_NOT_IN_RANGE) {
						creep.moveTo(controller, { visualizePathStyle: { stroke: '#ffffff' } });
					}
				} else {
					// Den Controller angreifen, um seine Hits auf 0 zu reduzieren
					if (creep.attackController(controller) === ERR_NOT_IN_RANGE) {
						creep.moveTo(controller, { visualizePathStyle: { stroke: '#ffffff' } });
					}
				}
				creep.signController(controller,'Claimed :o)')
			}
			else if(controller && controller.my)
			{
			     var updateState = creep.upgradeController(controller);
				if(updateState == ERR_NOT_IN_RANGE || updateState == ERR_NOT_OWNER) 
				{
					creep.moveTo(controller, {visualizePathStyle: {stroke: '#ffffff'}});
				}
			}
		}
		else
		{
			const container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => {
                    return (
                        (s.structureType === STRUCTURE_CONTAINER || s.structureType === STRUCTURE_STORAGE) &&
                        s.store.getUsedCapacity(RESOURCE_ENERGY) > 0
                    );
                }
            });

			if (container) {
				if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
					creep.moveTo(container, { visualizePathStyle: { stroke: '#ffaa00' } });
					return;
				}
			} else {
			   
				const source = creep.pos.findClosestByPath(FIND_SOURCES);
				if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
					creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
					return;
				}
				
				creep.moveTo(new RoomPosition(25, 25,Game.spawns.P1.room.name), {visualizePathStyle: {stroke: '#ffffff'},reusePath: 10});
			}
		}
    }
};