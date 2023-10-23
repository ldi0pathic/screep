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
                        var sourcePos = source.pos;
                        var adjacentSpots = [];
                        
                        for (let xOffset = -1; xOffset <= 1; xOffset++) {
                            for (let yOffset = -1; yOffset <= 1; yOffset++) {
                                if (xOffset === 0 && yOffset === 0) {
                                    continue;
                                }
                                
                                var x = sourcePos.x + xOffset;
                                var y = sourcePos.y + yOffset;
                                
                                adjacentSpots.push(new RoomPosition(x, y, creep.memory.workroom));
                            }
                        }

                        for (var spot of adjacentSpots) {
                            if (spot.createConstructionSite(STRUCTURE_CONTAINER) === OK) {
                                return;
                            }
                        }

                        return false;
                    }
                }
            }
            else
            {
               finalLocation = creep.memory.pos;
            }
            
            if (creep.pos.x == creep.memory.pos.x && creep.pos.y == creep.memory.pos.y) 
            {
               
                var source = creep.pos.findClosestByPath(creep.memory.mineEnergy ? FIND_SOURCES : FIND_MINERALS); 
                var state = creep.harvest(source);
                if (state === ERR_NOT_IN_RANGE) 
                { 
                    creep.say('⁉');
                }
                else
                {
                    creep.memory.source = source.id;        
                    if((creep.room.controller.my && creep.room.controller.level < 6) || !creep.room.controller.my)
                    {
                        creep.memory.onPosition = true;
                        delete creep.memory.pos;
                        delete creep.memory._move;
                        return;
                    }

                    const link = creep.pos.findInRange(FIND_STRUCTURES,1, {
                        filter: (s) => s.structureType === STRUCTURE_LINK
                    })[0];

                    if(link)
                    {
                        creep.memory.link = link.id;
                        creep.memory.onPosition = true;
                        delete creep.memory.pos;
                        delete creep.memory._move;
                    }
                    else
                    {
                        let build = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, 1, {
                            filter: { structureType: STRUCTURE_LINK }
                        })[0];

                        if(build)
                        {
                            creep.memory.build = build.id;
                            creep.memory.onPosition = true;
                            delete creep.memory.pos;
                            delete creep.memory._move;
              
                        }
                        else
                        {
                            var creepPos = creep.pos;
                            var adjacentSpots = [];
                        
                            for (let xOffset = -1; xOffset <= 1; xOffset++) {
                                for (let yOffset = -1; yOffset <= 1; yOffset++) {
                                    if (xOffset === 0 && yOffset === 0) {
                                        continue;
                                    }
                                    
                                    var x = creepPos.x + xOffset;
                                    var y = creepPos.y + yOffset;
                                    
                                    adjacentSpots.push(new RoomPosition(x, y, creep.memory.workroom));
                                }
                            }

                            for (var spot of adjacentSpots) {
                                if (spot.createConstructionSite(STRUCTURE_LINK) === OK) {
                                    return;
                                }
                            }
                        }
                    }
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
                var container = Game.getObjectById(creep.memory.container);
                if(container && container.progressTotal == undefined && container.hits < container.hitsMax)
                {   
                    creep.say('🔧');   
                    creep.repair(container);     
                }
                else if(container && container.progressTotal != undefined && container.progressTotal > container.progress)
                {
                    creep.say('🛠');
                    creep.build(container); 
                }

                //link bauen
                if(creep.memory.build)
                {
                    var build = Game.getObjectById(creep.memory.build);

                    if(build && build.progressTotal != undefined && build.progressTotal > build.progress)
                    {
                        creep.say('🛠');
                        creep.build(build); 
                    }
                    else if(!build)
                    {
                        delete creep.memory.build;

                        var link = creep.pos.findInRange(FIND_STRUCTURES,1, {
                            filter: (s) => s.structureType === STRUCTURE_LINK
                        })[0];
    
                        if(link)
                        {
                            creep.memory.link = link.id
                        }
                    }
                }

                if( creep.memory.link && creep.store.getFreeCapacity() == 0)
                {
                    var link = Game.getObjectById( creep.memory.link);

                   if(creep.transfer(link,RESOURCE_ENERGY) == ERR_FULL)
                   {
                        for(var id in global.room[creep.room.name].targetLinks)
                        {               
                            var target = Game.getObjectById(global.room[creep.room.name].targetLinks[id]);   
                            if(target && target.store.getFreeCapacity(RESOURCE_ENERGY) > 50)
                            {
                                link.transferEnergy(target);
                                break;
                            }
                        }
                   }
                }
            }
            
            let source = Game.getObjectById(creep.memory.source);
            let state = creep.harvest(source);
        
            if( state != OK)
            {
                if(state == ERR_TIRED || state == ERR_NOT_ENOUGH_ENERGY)
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

        var room = Game.rooms[workroom];
        if(room && room.controller && room.controller.my && room.controller.level >= 6)
        {
            for(var id in global.room[workroom].mineralSources)
            {
               var mineral =  Game.getObjectById(global.room[workroom].mineralSources[id]);
               if(!mineral || mineral.mineralAmount < 1)
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
        {
            Memory.rooms[spawn.room.name].aktivPrioSpawn = false;
            return false;
        }
           
        Memory.rooms[spawn.room.name].aktivPrioSpawn = !creepBase.spawn(spawn, this._getProfil(spawn), role + '_' + Game.time,{ role: role, workroom: workroom, home: spawn.room.name, source: source, mineEnergy:mineEnergy });

        //creepBase.spawn(spawn, [WORK,CARRY,MOVE], role + '_' + Game.time,{ role: role, workroom: workroom, home: spawn.room.name, source: source, mineEnergy:mineEnergy })
        
        return true;
    },
};
