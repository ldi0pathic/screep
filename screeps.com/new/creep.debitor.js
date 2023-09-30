const creepBase = require('./creep.base');
require('./config');
const role = "debitor";
module.exports =
{
    sayJob() { this.creep.say('🚛') },
    doJob: function (creep) {
        creepBase.checkHarvest(creep, creep.memory.mineral);

        if (creep.memory.harvest) {
            if(creepBase.goToWorkroom(creep)) return;
            if(creepBase.harvestMyContainer(creep, creep.memory.mineral)) return;
            if(creepBase.harvestRoomContainer(creep,creep.memory.mineral)) return;

            return;
        }

        if(creepBase.goToMyHome(creep))return;

        if(creep.memory.mineral != RESOURCE_ENERGY)
        {
            if(creepBase.TransportToHomeTerminal(creep,creep.memory.mineral))return;
            if(creepBase.TransportToHomeStorage(creep, creep.memory.mineral))return;
        }
        else
        {
            if(creepBase.TransportEnergyToHomeSpawn(creep))return;
            if(creepBase.TransportEnergyToHomeTower(creep))return;
            if(creepBase.TransportToHomeStorage(creep, creep.memory.mineral))return;
        }
      
    },
    /**
     * 
     * @param {StructureSpawn} spawn 
     */
    getProfil(spawn, mineraltype) {
        if(mineraltype == RESOURCE_ENERGY)
        {
            var max = Math.min(25,parseInt(spawn.room.energyCapacityAvailable / 100));
            return Array(max).fill(CARRY).concat(Array(max).fill(MOVE));
        }
        else
        {
            var mineral = 2;
            return Array(mineral).fill(CARRY).concat(Array(mineral).fill(MOVE));
        }
    },
    /**
    * 
    * @param {StructureSpawn} spawn 
    * @param {String} workroom 
    * @returns 
    */
    spawn: function(spawn,workroom)
    {
       
        if(!global.room[workroom].sendDebitor)
            return false;
            
        if(global.room[workroom].sendMiner)
        {
            for(var id in global.room[workroom].energySources)
            {
                if(!Game.getObjectById(global.room[workroom].energySources[id]))
                    continue;
                    
                if(this._spawn(spawn,workroom, global.room[workroom].energySources[id],RESOURCE_ENERGY))
                    return true;
            }

            var controller = Game.rooms[workroom].controller;
            if(controller.my && controller.level >= 6)
            {
                for(var id in global.room[workroom].mineralSources)
                {
                    var mineral = Game.getObjectById(global.room[workroom].mineralSources[id]);
                    if(mineral.mineralAmount < 1) //nur wenn die mineralquelle derzeit aktiv ist
                        return false;

                    if(this._spawn(spawn,workroom, global.room[workroom].mineralSources[id], mineral.mineralType))
                        return true;
                }
            }
        }
        

        if(this._spawn(spawn,workroom,'',RESOURCE_ENERGY)) //Freelancer B)
            return true;

        return false;  
    },
    /**
     * 
     * @param {StructureSpawn} spawn 
     * @param {String} workroom 
     * @param {String} container
     */
    _spawn: function (spawn, workroom, source, mineraltype) 
    { 
        let containerId = ''
        if(source != '')
        {
            var source = Game.getObjectById(source);
            let container = source.pos.findInRange(FIND_STRUCTURES, 1, {
                filter: { structureType: STRUCTURE_CONTAINER }
            });
    
            if(container.length == 0)
            {
                return  this._spawn(spawn,workroom,'');
            }
            containerId = container[0].id;

            var count = _.filter(Game.creeps, (creep) => creep.memory.role == role && 
                                                        creep.memory.workroom == workroom && 
                                                        creep.memory.home == spawn.room.name && 
                                                        creep.memory.container == containerId).length;
                                                      
            if (global.room[workroom].debitorProSource <= count)
                return false;
               
        }
        else
        {
            var count = _.filter(Game.creeps, (creep) => creep.memory.role == role && 
                                                        creep.memory.workroom == workroom && 
                                                        creep.memory.home == spawn.room.name && 
                                                        creep.memory.container == '').length;
            if (global.room[workroom].debitorAsFreelancer <= count)
                return false;

            containerId = '';
        }

        var profil = this.getProfil(spawn, mineraltype);
        
        console.log(profil.length);
        //wenn im aktuellen raum kein Debitor ist
        if(_.filter(Game.creeps, (creep) => creep.memory.role == role && creep.memory.workroom == workroom).length == 0)
        {
            console.log('Notfallspawn '+role);
            var min = Math.max(parseInt(spawn.room.energyAvailable/ 100),1);  
            profil = Array(min).fill(CARRY).concat(Array(min).fill(MOVE));
            containerId = '';
        }
       
        var newName = role + '_' + Game.time;
        var state = spawn.spawnCreep(profil, newName, { dryRun: true })
        if (state == 0) {
            spawn.spawnCreep(profil, newName, { memory: { role: role, workroom: workroom, home: spawn.room.name, container: containerId, mineral: mineraltype} });
            console.log("[" + spawn.room.name + "|" + workroom + "] spawn " + newName + " cost: " + creepBase.calcProfil(profil));
            
            return true;
        }
        console.log('5 :( '+ state);
        return false;
    },
}