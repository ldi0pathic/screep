const creepBase = require('./creep.base');
require('./config');
const role = "miner";

module.exports = {

    /** @param {Creep} creep **/
    doJob: function(creep) 
    {
        if(!creep.memory.onPosition)
        {
            if(creep.memory.workroom != creep.room.name)
            {
                var room = new RoomPosition(25, 25, creep.memory.workroom); 
                creep.moveTo(room, {visualizePathStyle: {stroke: '#ffffff'},reusePath: 10});
                return;
            }
            
            let finalLocation;
            if(!creep.memory.pos)
            {
               var source = Game.getObjectById(creep.memory.source);

                let container = source.pos.findInRange(FIND_STRUCTURES, 1, {
                    filter: { structureType: STRUCTURE_CONTAINER }
                })[0];
                
                
                if(container)
                {
                    finalLocation = container.pos;
                    creep.memory.pos = container.pos;
                    creep.memory.container = container.id;
                } 
                else
                {
                     let c = creep.room.find(FIND_CONSTRUCTION_SITES, 
                    {
                        filter: (x) => 
                        {
                            return x.structureType == STRUCTURE_CONTAINER;
                        },
                    });
                    
                    if(c.length > 0)
                    {
                        finalLocation = c[0].pos;
                        creep.memory.pos = c[0].pos;
                        creep.memory.container = c[0].id;
                    }
                    else
                    {
                        const sourcePos = source.pos;
        
                        // Berechne die benachbarten Plätze zur Energy Source
                        const adjacentSpots = [];
                        
                        for (let xOffset = -1; xOffset <= 1; xOffset++) {
                            for (let yOffset = -1; yOffset <= 1; yOffset++) {
                                if (xOffset === 0 && yOffset === 0) {
                                    // Überspringe die Position der Energy Source selbst
                                    continue;
                                }
                                
                                const x = sourcePos.x + xOffset;
                                const y = sourcePos.y + yOffset;
                                
                                adjacentSpots.push(new RoomPosition(x, y, creep.memory.workroom));
                            }
                        }
                        
                        // Überprüfe, ob ein Bauarbeiter den Container platzieren kann
                        for (const spot of adjacentSpots) {
                            if (spot.createConstructionSite(STRUCTURE_CONTAINER) === OK) {
                                return;
                            }
                        }
                    }
                }
            }
            else
            {
               finalLocation = creep.memory.pos;
            }
            
            if (creep.pos.x == creep.memory.pos.x && creep.pos.y == creep.memory.pos.y) 
            {
              creep.memory.onPosition = true;
              delete creep.memory.pos;
              
              var source = creep.pos.findClosestByPath(FIND_SOURCES);
              if (creep.harvest(source) === ERR_NOT_IN_RANGE) 
              {
                creep.say('⁉');
              }
              else
              {
                  creep.memory.miningSource = source.id;
              }
              
            } 
            else if(!creep.moveTo(new RoomPosition(finalLocation.x, finalLocation.y,finalLocation.roomName) , {visualizePathStyle: {stroke: '#ffaa00'},reusePath: 10,}) == OK)
            {
                  const blockingCreep = creep.pos.findInRange(FIND_MY_CREEPS, 1, {
                    filter: (otherCreep) => otherCreep.memory.role !== 'miner'
                })[0];
    
                if (blockingCreep) 
                {
                    // Der Miner ist blockiert, fordern Sie den blockierenden Creep auf, sich zu bewegen
                    const direction = creep.pos.getDirectionTo(blockingCreep);
                    const oppositeDirection = (direction + 3) % 8 + 1; // Berechnen Sie die entgegengesetzte Richtung
                    creep.say('\'-.-')
                    // Bewegen Sie den blockierenden Creep in die entgegengesetzte Richtung
                    blockingCreep.move(oppositeDirection);
                }
            } 
        }
        else
        {
            const container = Game.getObjectById(creep.memory.container);
            
            if(container && container.progressTotal == undefined && container.hits < container.hitsMax && !Memory.prioEnergie)
            {
                creep.say('🛠');
                creep.repair(container);
            }
            else if(container && container.progressTotal != undefined && container.progressTotal > container.progress && !Memory.prioEnergie)
            {
                creep.say('🛠');
                creep.build(container); 
            }
            
            const source = Game.getObjectById(creep.memory.miningSource);
            if(creep.harvest(source) != OK)
            {
               creep.say('⁉'); 
            }
        }
    },
    sayJob() { this.creep.say('⛏') },
     /**
     * 
     * @param {StructureSpawn} spawn 
     */
    _getProfil: function(spawn) {
        var maxEnergy = spawn.room.energyCapacityAvailable;
        const maxWorkParts = Math.floor((maxEnergy-100) / BODYPART_COST[WORK]);
      
        const numberOfWorkParts = Math.min(maxWorkParts, 5);
        
        let profil = Array(numberOfWorkParts).fill(WORK);
        
        profil.push(CARRY);
        profil.push(MOVE);
        
        var rest = Math.floor((maxEnergy-800) / 50);
        rest = Math.min(rest, 3);

        if(rest < 1) rest = 0;

        return profil.concat(Array(rest).fill(MOVE));;
    },
   /**
    * 
    * @param {StructureSpawn} spawn 
    * @param {String} workroom 
    * @returns 
    */
    spawn: function(spawn,workroom)
    {
        if(!global.room[workroom].sendMiner)
            return false;

        for(var id in global.room[workroom].energySources)
        {
            if(this._spawn(spawn,workroom, global.room[workroom].energySources[id]))
                return true;
        }

        return false;  
    },
    /**
     * 
     * @param {StructureSpawn} spawn 
     * @param {String} workroom 
     * @param {String} source 
     * @returns 
     */
    _spawn: function (spawn, workroom, source) {
        var count = _.filter(Game.creeps, (creep) => creep.memory.role == role && 
                                                    creep.memory.workroom == workroom && 
                                                    creep.memory.home == spawn.room.name && 
                                                    creep.memory.source == source).length;

        if (1 <= count)
            return false;

        var profil = this._getProfil(spawn);
        var newName = role + '_' + Game.time;
        if (spawn.spawnCreep(profil, newName, { dryRun: true }) === 0) {
            spawn.spawnCreep(profil, newName, { memory: { role: role, workroom: workroom, home: spawn.room.name, source: source } });
            console.log("[" + spawn.room.name + "|" + workroom + "] spawn " + newName + " cost: " + creepBase.calcProfil(profil));
            return true;
        }
        return false;
    },
};
