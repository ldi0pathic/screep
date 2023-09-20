const creepBase = require('./creep.base');
require('./config');
const role = "debitor";
module.exports =
{
    sayJob() { this.creep.say('🚛') },
    doJob: function (creep) {
        creepBase.checkHarvest(creep);

        if (creep.memory.harvest) {
            if(creepBase.goToWorkroom(creep)) return;
            if(creepBase.harvestMyContainer(creep)) return;
            if(creepBase.harvestRoomContainer(creep)) return;

            return;
        }

        if(creepBase.goToMyHome(creep))return;
        if(creepBase.TransportEnergyToHomeSpawn(creep))return;
        if(creepBase.TransportEnergyToHomeTower(creep))return;
        if(creepBase.TransportEnergyToHomeStorage(creep))return;
    },
    /**
     * 
     * @param {StructureSpawn} spawn 
     */
    getProfil(spawn) {
        var max = parseInt(spawn.room.energyCapacityAvailable / 100);
        return Array(max).fill(CARRY).concat(Array(max).fill(MOVE));
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

        if(this._spawn(spawn,workroom,'')) //Freelancer B)
            return true;

        return false;  
    },
    /**
     * 
     * @param {StructureSpawn} spawn 
     * @param {String} workroom 
     * @param {String} container
     */
    _spawn: function (spawn, workroom, source) {

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

        var profil = this.getProfil(spawn);
        var newName = role + '_' + Game.time;
        if (spawn.spawnCreep(profil, newName, { dryRun: true }) === 0) {
            spawn.spawnCreep(profil, newName, { memory: { role: role, workroom: workroom, home: spawn.room.name, container: containerId } });
            console.log("[" + spawn.room.name + "|" + workroom + "] spawn " + newName + " cost: " + creepBase.calcProfil(profil));
            return true;
        }
        return false;
    },
}