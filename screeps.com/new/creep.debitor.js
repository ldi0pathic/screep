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
     * @param {String} container
     */
    spawn: function (spawn, workroom, container) {
        var count = _.filter(Game.creeps, (creep) => creep.memory.role == role && 
                                                    creep.memory.workroom == workroom && 
                                                    creep.memory.home == spawn.room.name && 
                                                    creep.memory.container == container).length;

        if (global.room[workroom].debitorProSource <= count)
            return false;

        var profil = this.getProfil(spawn);
        var newName = role + '_' + Game.time;
        if (spawn.spawnCreep(profil, newName, { dryRun: true }) === 0) {
            spawn.spawnCreep(profil, newName, { memory: { role: role, workroom: workroom, home: spawn.room.name, container: container } });
            console.log("[" + spawn.room.name + "|" + workroom + "] spawn " + newName + " cost: " + creepBase.calcProfil(profil));
            return true;
        }
        return false;
    },
    /**
    * 
    * @param {StructureSpawn} spawn 
    * @param {String} workroom 
    */
    spawn: function (spawn, workroom) {
        var count = _.filter(Game.creeps, (creep) => creep.memory.role == role && 
                                                    creep.memory.workroom == workroom && 
                                                    creep.memory.home == spawn.room.name && 
                                                    creep.memory.container == '').length;

        if (global.room[workroom].debitorAsFreelancer <= count)
            return false;

        var profil = this.getProfil(spawn);
        var newName = role + '_' + Game.time;
        if (spawn.spawnCreep(profil, newName, { dryRun: true }) === 0) {
            spawn.spawnCreep(profil, newName, { memory: { role: role, workroom: workroom, home: spawn.room.name, container: '' } });
            console.log("[" + spawn.room.name + "|" + workroom + "] spawn " + newName + " cost: " + creepBase.calcProfil(profil));
            return true;
        }
        return false;
    }
}