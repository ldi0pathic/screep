var carry = require('role.carry');
var role = 'wally';
var maxSpawn = 2;
const bodyPartCosts = {
        WORK: BODYPART_COST[WORK],
        CARRY: BODYPART_COST[CARRY],
        MOVE: BODYPART_COST[MOVE],
    };
module.exports = {
    run: function(creep) {
        // Liste der Wall-IDs, die repariert werden sollen
        //const targetWallIds = ['651c24cbca05f398e79ec9f6','651c274d66e8a0ee71c37820','651c2a097484a47801d13fe9','651c24cbca05f398e79ec9f6','651c274d66e8a0ee71c37820','651c24f7f4660a6e5b49b783','651c23c63085924a28ed4c5e','62059f01a6913fbf31e8cb56','62058377ca7d2d0e94453681','6257e82234865ad3ee670704','651787ab43ffc307779e7028','651780d1e7ad816ee36abdab','6205837417753b1dc1948afa','651786327d4de84f1c71d636', '6517870c7aa421287cb2698f','651786f5ed3100748def55d0','651786d31cb6f66594ff4d6d','65178121cb5f90fc0701217b','651784fdfa7469e81b525939','65178615f050f54a1e6ca286','651787ab43ffc307779e7028','651780aadec6014f27373075','6517865491cfa5dd00f9ca49','6517c20e43ffc37e789e7fda','6517c2c0bfcd9c23386dd415'];
        
         carry.checkCarry(creep);

        if (!creep.memory.carry) {
            creep.memory.wall = null;
            return; 
        }
        
        if(!creep.memory.wall)
        {
            const wallsAndRamparts = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                        (structure.structureType === STRUCTURE_WALL || structure.structureType === STRUCTURE_RAMPART) &&
                        structure.hits < 5000000
                    );
                }
            });
            const sortedWalls = wallsAndRamparts.sort((a, b) => a.hits - b.hits);

            if (sortedWalls.length > 0) {
                creep.memory.wall = sortedWalls[0].id;
            }
        }
        if(creep.memory.wall)
        {
           var targetWall = Game.getObjectById(creep.memory.wall);

           if(!targetWall)
            creep.memory.wall = null;

           var result = creep.repair(targetWall );
            
            if (result === ERR_NOT_IN_RANGE) {
                creep.moveTo(targetWall, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
        
    },
     spawn: function(spawn, target)
    {
        var c = _.filter(Game.creeps, (creep) => creep.memory.role == role && creep.memory.target == target).length;
        var max = maxSpawn;
        
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
