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
                    let build = source.pos.findInRange(FIND_CONSTRUCTION_SITES, 1, {
                        filter: { structureType: STRUCTURE_CONTAINER }
                    })[0];
                    
                    if(build)
                    {
                        finalLocation = build.pos;
                        creep.memory.pos = build.pos;
                        creep.memory.container = build.id;
                    }
                    else
                    {
                        const sourcePos = source.pos;
                        const adjacentSpots = [];
                        
                        for (let xOffset = -1; xOffset <= 1; xOffset++) {
                            for (let yOffset = -1; yOffset <= 1; yOffset++) {
                                if (xOffset === 0 && yOffset === 0) {
                                    continue;
                                }
                                
                                const x = sourcePos.x + xOffset;
                                const y = sourcePos.y + yOffset;
                                
                                adjacentSpots.push(new RoomPosition(x, y, creep.memory.workroom));
                            }
                        }

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
                delete creep.memory._move;
              
                var source = creep.pos.findClosestByPath(creep.memory.mineEnergy ? FIND_SOURCES : FIND_MINERALS); 
                var state = creep.harvest(source);
                if (state === ERR_NOT_IN_RANGE) 
                {
                    console.log(state);
                    creep.say('⁉');
                }
                else
                {
                    creep.memory.source = source.id;        
                } 
            } 
            else if(!creep.moveTo(new RoomPosition(finalLocation.x, finalLocation.y,finalLocation.roomName) , {reusePath: 5,}) == OK)
            {
                  const blockingCreep = creep.pos.findInRange(FIND_MY_CREEPS, 1, {
                    filter: (otherCreep) => otherCreep.memory.role !== 'miner'
                })[0];
    
                if (blockingCreep) 
                { 
                    blockingCreep.move(TOP_LEFT);
                }
            } 
        }
        else
        {
            if(creep.memory.mineEnergy)
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
            }
            
            let source = Game.getObjectById(creep.memory.source);
            let state = creep.harvest(source);
            if( state != OK)
            {
                if(state == ERR_TIRED)
                {
                    creep.say('😴')
                }
                else
                {
                    creep.say(state+' :('); 
                }
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
            if(!Game.getObjectById(global.room[workroom].energySources[id]))
                continue;

            if(this._spawn(spawn,workroom, global.room[workroom].energySources[id], true))
                return true;
        }

        var controller = Game.rooms[workroom].controller;
        if(controller.my && controller.level >= 6)
        {
            for(var id in global.room[workroom].mineralSources)
            {
               
               if( Game.getObjectById(global.room[workroom].mineralSources[id]).mineralAmount < 1)
                    return false;

                if(this._spawn(spawn,workroom, global.room[workroom].mineralSources[id], false))
                    return true;
            }
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
    _spawn: function (spawn, workroom, source, mineEnergy) {
        var count = _.filter(Game.creeps, (creep) => creep.memory.role == role && 
                                                    creep.memory.workroom == workroom && 
                                                    creep.memory.home == spawn.room.name && 
                                                    creep.memory.source == source).length;

        if (1 <= count)
            return false;

        var profil = this._getProfil(spawn);
        var newName = role + '_' + Game.time;
        if (spawn.spawnCreep(profil, newName, { dryRun: true }) === 0) {
            spawn.spawnCreep(profil, newName, { memory: { role: role, workroom: workroom, home: spawn.room.name, source: source, mineEnergy:mineEnergy } });
            console.log("[" + spawn.room.name + "|" + workroom + "] spawn " + newName + " cost: " + creepBase.calcProfil(profil));
            Memory.rooms[spawn.room.name].aktivPrioSpawn = false;
            return true;
        }
        Memory.rooms[spawn.room.name].aktivPrioSpawn = true;
        return true;
    },
};
