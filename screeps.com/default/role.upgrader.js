var carry = require('role.carry');

const maxSpawn = 1;
const role = 'uppi';
const bodyPartCosts = {
        WORK: BODYPART_COST[WORK],
        CARRY: BODYPART_COST[CARRY],
        MOVE: BODYPART_COST[MOVE],
    };

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) 
    {   
        carry.checkCarry(creep);

        if (!creep.memory.carry) {
            return; 
        }
        
    	if (creep.memory.target && creep.memory.target !== creep.room.name) 
    	{
    		creep.say('⏩')
    		creep.moveTo(new RoomPosition(25, 25, creep.memory.target), { visualizePathStyle: { stroke: '#ffffff' } });
    		return;
    	}
    
        const updateState = creep.upgradeController(creep.room.controller);
        if (updateState === OK) {
            // Erfolgreich aktualisiert, keine weiteren Maßnahmen erforderlich.
            return;
        }
    
        if (updateState === ERR_NOT_IN_RANGE || updateState === ERR_NOT_OWNER) {
            creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
        }  
    },
    
    spawn: function(spawn, target)
    {
        var c = _.filter(Game.creeps, (creep) => creep.memory.role == role && creep.memory.target == target).length;
        var max = maxSpawn;
        
        if(target == 'E58N7' )
        {
            max = 3;
        }
          if(target == 'E58N6')
        {
            max = 2;
        }
        
        if(c < max) 
        {
            var newName = role + '_' + Game.time;
            
            var maxEnergy = spawn.room.energyCapacityAvailable;
           
            const fullBodyCost = bodyPartCosts.WORK + bodyPartCosts.CARRY + bodyPartCosts.MOVE;
           
            const maxWorkParts = Math.floor((maxEnergy / fullBodyCost)); // Maximal 50 Teile pro Creep
          
            const numberOfWorkParts = Math.max(1, maxWorkParts);
            const numberOfCarryParts = Math.floor(numberOfWorkParts / 2);
            const numberOfMoveParts = numberOfCarryParts
            
            const profil = [];
            for (let i = 0; i < numberOfWorkParts; i++) {
                profil.push(WORK);
            }
            for (let i = 0; i < numberOfCarryParts; i++) {
                profil.push(CARRY);
            }
            for (let i = 0; i < numberOfMoveParts; i++) {
                profil.push(MOVE);
            }
           
            if( spawn.spawnCreep(profil, newName,{dryRun: true}) === 0)
            {
                spawn.spawnCreep(profil, newName, {memory: {role: role, carry: false, target: target, spawn:spawn.name}});
                console.log(spawn.name+'spawn '+newName+' für Raum'+spawn.room.name+' cost: '+calcProfil(profil));
                return true;
            }
           
        }
         return false;
    },
    
};
function calcProfil(creepProfile) {
    let energyCost = 0;

    for (const bodyPart of creepProfile) {
        energyCost += BODYPART_COST[bodyPart];
    }

    return energyCost;
}

module.exports = roleUpgrader;