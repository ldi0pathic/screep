const creepBase = require('./creep.base');
require('./config');
const role = "debitor";
module.exports =
{
    sayJob() { this.creep.say('🚛') },
    doJob: function (creep) {

        if(!creep.memory.mineral)
            creep.memory.mineral = RESOURCE_ENERGY;

        creepBase.checkHarvest(creep, creep.memory.mineral,function()
        {
            if(creep.memory.home == creep.memory.workroom)
                return;
                    
            if(!Memory.rooms[creep.memory.workroom].needDebitorSize)
            {
                if(creep.memory.distance > 0)
                {
                    
                    if(!Memory.rooms[creep.memory.workroom].distances)
                        Memory.rooms[creep.memory.workroom].distances = [];

                    Memory.rooms[creep.memory.workroom].distances.push(creep.memory.distance)
                    creep.memory.distance = 0
                }   
            }  
        },
        function()
        {
            if(creep.memory.home == creep.memory.workroom)
            return;

            if(!Memory.rooms[creep.memory.workroom].needDebitorSize)
            {
                if(creep.memory.distance > 0)
                {
                    if(!Memory.rooms[creep.memory.workroom].distances)
                        Memory.rooms[creep.memory.workroom].distances = [];
                    
                    Memory.rooms[creep.memory.workroom].distances.push(creep.memory.distance)
                    creep.memory.distance = 0
                }  
            } 
        });

        creep.memory.distance = creep.memory.distance + 1;

        if (creep.memory.harvest) {
          
            if(creepBase.goToWorkroom(creep)) return;
            
            if(creepBase.harvestSpawnLink(creep,creep.memory.mineral))return;
            if(creepBase.harvestMyContainer(creep, creep.memory.mineral)) return;   
            if(creep.memory.container == '' && creep.room.name == creep.memory.workroom && creep.room.energyAvailable < (creep.room.energyCapacityAvailable * 0.75))
            {
                if(creepBase.harvestRoomStorage(creep,creep.memory.mineral)) return;
            }  
            if(creepBase.harvestRoomDrops(creep,creep.memory.mineral)) return;
            if(creepBase.harvestRoomTombstones(creep,creep.memory.mineral)) return;
            if(creepBase.harvestRoomRuins(creep,creep.memory.mineral)) return;    
           
            if(creep.store.getUsedCapacity() > creep.store.getFreeCapacity())
            {
                creep.memory.harvest = false;
            }

            if(creepBase.harvestRoomStorage(creep,creep.memory.mineral)) return;

            if(creep.room.energyAvailable < 300)
            {
                if(creepBase.harvestRoomContainer(creep,creep.memory.mineral,0.01)) return;   

                if(creep.store.getUsedCapacity() > 0)
                {
                    creep.memory.harvest = false;
                }
            }
            return;
        }

        if(creepBase.goToMyHome(creep))return;

        if(creep.memory.mineral != RESOURCE_ENERGY)
        {
            if(creepBase.TransportToHomeTerminal(creep,creep.memory.mineral))return;   
            if(creepBase.TransportToHomeStorage(creep, creep.memory.mineral))return;
            return;     
        }   
        else if(creep.memory.home == creep.memory.workroom)
        {
            if(creepBase.TransportEnergyToHomeSpawn(creep))return;
            if(creepBase.TransportEnergyToHomeTower(creep))return;
            if(creepBase.TransportToHomeStorage(creep, creep.memory.mineral))return;
        }
        else
        {
            if(creepBase.TransportToHomeStorage(creep, creep.memory.mineral))return;
            if(creepBase.TransportEnergyToHomeTower(creep))return;
            if(creepBase.TransportEnergyToHomeSpawn(creep))return;
        }

        if(creepBase.TransportToHomeContainer(creep, creep.memory.mineral))return;
        
        return;        
    },
    /**
     * 
     * @param {StructureSpawn} spawn 
     */
    getProfil(spawn, workroom, mineraltype,containerId) 
    {
        if(mineraltype == RESOURCE_ENERGY)
        {
            if(spawn.room.name != workroom)
            {
                var carry = Memory.rooms[workroom].needDebitorSize;
                var c = 1;
                if(!carry)
                {
                    var distances = Memory.rooms[workroom].distances;
                    var length = Math.ceil(distances.length *0.5)
                    var meridian = distances.sort(function(a, b) {
                            return a - b;
                        })[length];
                    carry = Math.ceil((2*meridian) / 5)
                    var max = Math.min(25, parseInt(spawn.room.energyCapacityAvailable / 100));
                   
                    if( max >= carry)
                    {
                        Memory.rooms[workroom].needDebitors = 1;     
                    }
                    else
                    {
                        console.log(carry);
                        c = Memory.rooms[workroom].needDebitors =  Math.ceil(carry/max);
                        carry = Math.ceil(carry/c);        
                    }
                    if(length > 30)
                    {
                        Memory.rooms[workroom].needDebitorSize = carry;
                        delete Memory.rooms[workroom].distances;
                    }
                } 
                return Array(carry).fill(CARRY).concat(Array(carry).fill(MOVE));
            }
            
            if(containerId == '' || spawn.room.name != workroom)
            {
                var max = Math.min(Math.max(parseInt(spawn.room.energyCapacityAvailable/ 100),1),16);  
                return Array(max).fill(CARRY).concat(Array(max).fill(MOVE));
            }
         
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

        if(spawn.room.name != workroom && !Memory.rooms[workroom].claimed)
            return false;
       
        if(global.room[workroom].sendMiner)
        {
            if(!Memory.rooms[workroom].hasLinks || !global.room[workroom].useLinks )    
            { 
                for(var id in global.room[workroom].energySources)
                {
                    if(!Game.getObjectById(global.room[workroom].energySources[id]))
                        continue;
                     
                    if(this._spawn(spawn,workroom, global.room[workroom].energySources[id],RESOURCE_ENERGY))
                        return true;
                }
            }

            var room = Game.rooms[workroom]
            if(room && room.controller && room.controller.my && room.controller.level >= 6)
            {
                for(var id in global.room[workroom].mineralSources)
                {
                    var mineral = Game.getObjectById(global.room[workroom].mineralSources[id]);
                    if(!mineral || mineral.mineralAmount < 1) //nur wenn die mineralquelle derzeit aktiv ist
                        return false;

                    if(this._spawn(spawn,workroom, global.room[workroom].mineralSources[id], mineral.mineralType))
                        return true;
                }
            }
        }

        if(!global.room[workroom].sendFreeDebitor)
            return false;

        if(this._spawn(spawn,workroom,'',RESOURCE_ENERGY)) //Freelancer B)
            return true;

        return false;  
    },
    /**
     * 
     * @param {StructureSpawn} spawn 
     * @param {String} workroom 
     * @param {String} container
     * @param {String} mineraltype
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
                return  false;
           
            containerId = container[0].id;

            var count = _.filter(Game.creeps, (creep) => creep.memory.role == role && 
                                                        creep.memory.workroom == workroom && 
                                                        creep.memory.home == spawn.room.name && 
                                                        creep.memory.container == containerId).length;
                                           
            if(!Memory.rooms[workroom].needDebitors)
                Memory.rooms[workroom].needDebitors = 1;

            if (Memory.rooms[workroom].needDebitors <= count)
                return false;
           
            let link = container[0].pos.findInRange(FIND_STRUCTURES, 1, {
                filter: { structureType: STRUCTURE_LINK }
            });

            if(link.length > 0)
            {
                Memory.rooms[workroom].hasLinks = true; 

                if(Memory.rooms[workroom].useLinks)
                    return false;      
            }             
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

        var profil = this.getProfil(spawn, workroom, mineraltype, containerId);
        
        //wenn im aktuellen raum kein Debitor ist
        
       if(!creepBase.spawn(spawn,profil, role + '_' + Game.time, { role: role, harvest: true, workroom: workroom, home: spawn.room.name, mineral: mineraltype, container: containerId }))
       {
            if(_.filter(Game.creeps, (creep) => creep.memory.role == role && creep.memory.workroom == workroom).length == 0 && spawn.room.name == workroom)
            {
                console.log('Notfallspawn '+role);
                var min = Math.min(Math.max(parseInt(spawn.room.energyAvailable/ 100),1),16);  
                profil = Array(min).fill(CARRY).concat(Array(min).fill(MOVE));
                containerId = '';
                mineraltype = RESOURCE_ENERGY;
                return creepBase.spawn(spawn,profil, role + '_' + Game.time, { role: role, harvest: true, workroom: workroom, home: spawn.room.name, mineral: mineraltype, container: containerId })
            }
            return false;
       }
       return true;
    },
}