const { isFunction } = require('lodash');
const creepBase = require('./creep.base');
require('./config');
const role = "miner";

module.exports = {

    _clearMemory : function(creep)
    {
        delete creep.memory.pos;
        delete creep.memory._move;
        delete creep.memory.path;
        delete creep.memory.pathTarget;
        delete creep.memory.lastPos;
        delete creep.memory.dontMove;
    },
    /** @param {Creep} creep **/
    doJob: function(creep) 
    {     
        if(creepBase.checkInvasion(creep)) {
            creep.memory.onPosition = false;
            return;
        };
       
        if(!creep.memory.onPosition)
        {
            if(creepBase.goToWorkroom(creep)) return;
           
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
                    if((creep.room.controller.my && creep.room.controller.level < 4) || !creep.room.controller.my || !creep.memory.mineEnergy)
                    {
                        creep.memory.onPosition = true;
                        this._clearMemory(creep);

                        if(!creep.memory.mineEnergy)
                        {
                            var terminal = creep.pos.findInRange(FIND_STRUCTURES,1, {
                                filter: (s) => s.structureType === STRUCTURE_TERMINAL
                            })[0];

                            if(terminal)
                            {
                                creep.memory.terminal = terminal.id;
                            }
                        }
                        return;
                    }

                    const link = creep.pos.findInRange(FIND_STRUCTURES,1, {
                        filter: (s) => s.structureType === STRUCTURE_LINK
                    })[0];

                    if(link)
                    {
                        creep.memory.link = link.id;
                        creep.memory.onPosition = true;
                        this._clearMemory(creep);
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
                            this._clearMemory(creep);
              
                        }
                        else if(creep.room.controller.level >= 6 && creep.memory.mineEnergy)
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
                        else
                        {
                            creep.memory.onPosition = true;
                            this._clearMemory(creep);
                            return; 
                        }
                    }
                } 
            } 
            else 
                creepBase.moveByMemory(creep, new RoomPosition(finalLocation.x, finalLocation.y,finalLocation.roomName))
        }
        else
        { 
            let source = Game.getObjectById(creep.memory.source);
            var container = Game.getObjectById(creep.memory.container);
            
            if(creep.memory.mineEnergy)
            {     
                if(container)
                {
                    if(container.store.getUsedCapacity() == 0 && source.energy <= 1)
                    {
                        creep.say('😴')
                        return;
                    }

                    if(creep.store.getFreeCapacity() > 0 && container.progressTotal == undefined && container.store.getUsedCapacity() > 0)
                    {   
                        creep.withdraw(container, RESOURCE_ENERGY);                     
                    }
    
                    if(container.progressTotal != undefined && container.progressTotal > container.progress)
                    {
                        creep.say('🛠');
                        creep.build(container); 
                    }
                    else if(container.progressTotal == undefined && container.hits < container.hitsMax)
                    {   
                        creep.say('🔧');   
                        creep.repair(container);     
                    }
                    else if(container.store.getFreeCapacity() == 0 && !creep.memory.link)
                    {
                        creep.say('🚯');
                        return;
                    }
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
/*
                if(!creep.memory.link)
                {
                    const link = creep.pos.findInRange(FIND_STRUCTURES,1, {
                        filter: (s) => s.structureType === STRUCTURE_LINK
                    })[0];

                    if(link)
                    {
                        creep.memory.link = link.id;
                    }
                }
*/

                if( creep.memory.link && creep.store.getFreeCapacity() == 0)
                {
                    var link = Game.getObjectById( creep.memory.link);

                   if(creep.transfer(link,RESOURCE_ENERGY) == ERR_FULL)
                   {     
                        var target;
                        if(creep.room.storage && creep.room.storage.store.getUsedCapacity() > creep.room.storage.store.getFreeCapacity())
                        {
                            target = Game.getObjectById(global.room[creep.room.name].controllerLink);   
                        }
                        else
                        {
                            target = Game.getObjectById(global.room[creep.room.name].targetLinks[[Math.floor((Math.random()*global.room[creep.room.name].targetLinks.length))]]);   
                        }
          
                        if(target && target.store.getFreeCapacity(RESOURCE_ENERGY) > 50)
                        {
                            link.transferEnergy(target);
                        }    
                   }
                }     
            }
            else
            {
                if(container)
                {
                    if(creep.store.getFreeCapacity() > 0 && container.store.getUsedCapacity() > 0)
                    {   
                        creep.withdraw(container, source.mineral);                     
                    }
    
                   
                    if(container.store.getFreeCapacity() == 0 && !creep.memory.terminal)
                    {
                        creep.say('🚯');
                        return;
                    }
                }

                if( creep.memory.terminal && creep.store.getFreeCapacity() == 0)
                {
                    var terminal = Game.getObjectById(creep.memory.terminal);
                    if(terminal && creep.transfer( terminal,source.mineral) == ERR_FULL)
                    {
                        //todo markausführung
                    }
                }

                if(creep.memory.extactor)
                {
                    var extactor = Game.getObjectById(creep.memory.extactor);
                    if(extactor && extactor.cooldown > 0)
                    {
                        creep.say('😴')
                        return;
                    }
                }
                else
                {
                    let extr = creep.pos.findInRange(FIND_MY_STRUCTURES, 1, {
                        filter: { structureType: STRUCTURE_EXTRACTOR }
                    })[0];
                    if(extr)
                        creep.memory.extactor = extr.id;
                }
            }
            
            if( source.energy && source.energy <= 1 || source.mineralAmount && source.mineralAmount < 1 )
            { 
                creep.say('😴')
                return;
            }
                
            var state = creep.harvest(source);
        
            if( state != OK)
            {
                if(state == ERR_TIRED || state == ERR_NOT_ENOUGH_ENERGY)
                {
                    creep.say('😴')
                }
                else if(state == ERR_NO_BODYPART)
                {
                    creep.suicide();
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
    _getProfil: function(spawn, workroom) {
        var maxEnergy = spawn.room.energyCapacityAvailable;
        const maxWorkParts = Math.floor((maxEnergy-150) / BODYPART_COST[WORK]);
      
        const numberOfWorkParts = Math.min(maxWorkParts, 9);
        
        let profil = Array(numberOfWorkParts).fill(WORK);
        
        profil.push(CARRY);
        profil.push(CARRY);
        profil.push(MOVE);
        
        var rest = Math.floor((maxEnergy-1000) / 50);
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
        global.logWorkroom(workroom,'Miner Spawn start');
        if(!global.room[workroom].sendMiner)
            return false;

        if(spawn.room.name != workroom && !Memory.rooms[workroom].claimed && !global.room[workroom].claim)
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
       
        var time = 100;
        if(workroom == spawn.room.name)
        {
            time = 50;
        }
        var count = _.filter(Game.creeps, (creep) => creep.memory.role == role && 
                                                    creep.memory.workroom == workroom && 
                                                    creep.memory.home == spawn.room.name && 
                                                    creep.memory.source == source && 
                                                    (creep.ticksToLive > time || creep.spawning)
                                                    ).length;

        if (1 <= count)
        {
            Memory.rooms[spawn.room.name].aktivPrioSpawn = false;
            return false;
        }
           
        if(!creepBase.spawn(spawn, this._getProfil(spawn, workroom), role + '_' + Game.time,{ role: role, workroom: workroom, home: spawn.room.name, source: source, mineEnergy:mineEnergy }))
        {
            Memory.rooms[spawn.room.name].aktivPrioSpawn = true;
            Memory.rooms[spawn.room.name].aktivPrioSpawnCount = Memory.rooms[spawn.room.name].aktivPrioSpawnCount +1;

            if(Memory.rooms[spawn.room.name].aktivPrioSpawnCount > 25)
            {
               if(_.filter(Game.creeps, (creep) => creep.memory.role == role && 
                                                    creep.memory.workroom == workroom && 
                                                    creep.memory.home == spawn.room.name ).length > 0)
                return false;

                console.log("Spawn NotfallMiner!!!")
                creepBase.spawn(spawn, [WORK,CARRY,MOVE], role + '_' + Game.time,{ role: role, workroom: workroom, home: spawn.room.name, source: source, mineEnergy:mineEnergy })
                Memory.rooms[spawn.room.name].aktivPrioSpawnCount = 0;
                return true;
            }
            return false;        
        }
       
        Memory.rooms[spawn.room.name].aktivPrioSpawnCount = 0;
        return true;
    },
};