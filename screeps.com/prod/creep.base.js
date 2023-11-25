const creepBaseTransport = require('./creep.base.transport');
const creepBaseGoTo = require('./creep.base.goto');


module.exports =
{
    checkHarvest: function (creep, type, action, action2) {
        if (!creep.memory.harvest && creep.store.getUsedCapacity() === 0) {
            if (typeof (action) == "function")
                action();

            creep.memory.harvest = true;
            creep.say('🛒');
        }
        if (creep.memory.harvest && creep.store.getFreeCapacity() === 0) {
            if (typeof (action2) == "function")
                action();
            creep.memory.harvest = false;
            delete creep.memory.useRoomSource;
        }
    },
    checkInvasion: function (creep) {
        if (Memory.rooms[creep.memory.workroom].needDefence || (Memory.rooms[creep.memory.workroom].invaderCore
            && Game.rooms[creep.memory.workroom]
            && Game.rooms[creep.memory.workroom].controller.reservation.username != creep.owner.username)) {
            creep.say('☎');

            return creepBaseGoTo.goToMyHome(creep);;
        }
        return false;
    },
    harvest: function (creep) {
        if (!creep.memory.harvest)
            return;

        if (this.harvestRoomRuins(creep, RESOURCE_ENERGY))
            return;

        if (this.harvestRoomStorage(creep, RESOURCE_ENERGY))
            return;

        if (this.harvestRoomContainer(creep, RESOURCE_ENERGY, 0.25))
            return;

        if (this.harvestRoomDrops(creep, RESOURCE_ENERGY))
            return;

        if (this.harvestRoomTombstones(creep, RESOURCE_ENERGY))
            return;

        if (this.harvestRoomEnergySource(creep))
            return;

        this.goToMyHome(creep);
    },
    harvestRoomDrops: function (creep, type) {

        var drop;
        if (creep.memory.useRoomDrop) {
            drop = Game.getObjectById(creep.memory.useRoomDrop);
        }
        else {
            drop = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { filter: (d) => d.resourceType === type && d.amount > 100 });
        }

        if (drop) {
            var state = creep.pickup(drop)

            if (state === ERR_NOT_IN_RANGE) {
                creep.moveTo(drop, { reusePath: 5 });
            }
            else if (state == ERR_INVALID_TARGET) {
                delete creep.memory.useRoomDrop;
                return false;
            }
            creep.memory.useRoomDrop = drop.id;
            return true;
        }
        delete creep.memory.useRoomDrop;
        return false;
    },
    harvestRoomTombstones: function (creep, type) {
        const tombstone = creep.pos.findClosestByPath(FIND_TOMBSTONES, { filter: (d) => d.store.getUsedCapacity(type) > 100 });

        if (tombstone) {
            if (creep.withdraw(tombstone, type) === ERR_NOT_IN_RANGE) {
                creep.moveTo(tombstone, { reusePath: 5 });
            }
            return true;
        }
        return false;
    },
    harvestCompleteRoomTombstones: function (creep, type) {
        var tombstones = creep.room.find(FIND_TOMBSTONES,{ filter: (d) => d.store.getUsedCapacity() > 100  });

        if (tombstones.length > 0) {
            for(var tombstone of tombstones)
                for (var resourceType in tombstone.store) {
                    if (creep.withdraw(tombstone, resourceType) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(tombstone,{reusePath: 5});
                        break;
                    }
                }
            return true;
        }
        return false;
    },
    harvestRoomRuins: function (creep, type) {
        const ruin = creep.pos.findClosestByPath(FIND_RUINS, { filter: (d) => d.store.getUsedCapacity(type) > 50 });

        if (ruin) {
            if (creep.withdraw(ruin, type) === ERR_NOT_IN_RANGE) {
                creep.moveTo(ruin, { reusePath: 5 });
            }
            return true;
        }
        return false;
    },
    harvestRoomStorage: function (creep, type) {
        let storage = creep.room.storage;

        if (storage && storage.store[type] > (creep.store.getCapacity() * 0.5)) //Creep sollte min halbvoll werden
        {
            if (creep.withdraw(storage, type) === ERR_NOT_IN_RANGE) {
                creep.moveTo(storage, { reusePath: 5 });
            }
            return true;
        }
        return false;
    },
    harvestRoomContainer: function (creep, type, mul) {
        if (!mul) mul = 0.5;
        const containers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (
                    structure.structureType === STRUCTURE_CONTAINER
                ) && structure.store[type] > (creep.store.getFreeCapacity() * mul) //Creep sollte min halbvoll werden
                    ;
            }
        });

        if (containers.length > 0) {
            const closestContainer = creep.pos.findClosestByPath(containers);
            if (creep.withdraw(closestContainer, type) === ERR_NOT_IN_RANGE) {
                creep.moveTo(closestContainer, { reusePath: 5 });
            }
            return true;
        }
        return false;
    },
    harvestSpawnLink: function (creep, type) {
        if (creep.memory.workroom != creep.room.name ||
            !Memory.rooms[creep.memory.workroom].hasLinks ||
            !global.room[creep.memory.workroom].spawnLink)
            return false;

        var link = Game.getObjectById(global.room[creep.memory.workroom].spawnLink);

        if (link && link.store[type] > 100) {
            var state = creep.withdraw(link, type);
            if (state === ERR_NOT_IN_RANGE) {
                creep.moveTo(link, { reusePath: 5 });
            }
            return true;
        }
        return false;
    },
    harvestControllerLink: function (creep, type) {
        if (creep.memory.workroom != creep.room.name ||
            !Memory.rooms[creep.memory.workroom].hasLinks ||
            !global.room[creep.memory.workroom].controllerLink)
            return false;

        var link = Game.getObjectById(global.room[creep.memory.workroom].controllerLink);

        if (link && link.store[type] > 100) {
            var state = creep.withdraw(link, type);
            if (state === ERR_NOT_IN_RANGE) {
                creep.moveTo(link, { reusePath: 5 });
            }
            return true;
        }
        return false;
    },
    harvestMyContainer: function (creep, type) {
        if (creep.memory.workroom != creep.room.name || creep.memory.container == '')
            return false;

        var container = Game.getObjectById(creep.memory.container);

        if (container) {
            if (container.store[type] < 100) {
                return false;
            }

            var state = creep.withdraw(container, type);
            if (state === ERR_NOT_IN_RANGE) {
                creep.moveTo(container, { reusePath: 5 });
            }
            return true;
        }
        return false;
    },
    harvestRoomEnergySource: function (creep) {
        if (this.canHarvestEnergy(creep)) {
            var source;
            if (creep.memory.useRoomSource) {
                source = Game.getObjectById(creep.memory.useRoomSource);
            }
            else {
                source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
            }

            if (source) {
                if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    if(creep.moveTo(source) == ERR_NO_PATH)
                    {
                        delete creep.memory.useRoomSource;
                        return false;
                    }
                }
                creep.memory.useRoomSource = source.id;
                return true;
            }
        }
        return false;
    },
    canHarvestEnergy: function (creep) {
        return creep.getActiveBodyparts(WORK) > 0;
    },
    calcProfil: function (creepProfile) {
        let energyCost = 0;
        for (const bodyPart of creepProfile) {
            energyCost += BODYPART_COST[bodyPart];
        }
        return energyCost;
    },
    goToMyHome: function (creep) { return creepBaseGoTo.goToMyHome(creep) },
    goToRoomFlag: function (creep) { return creepBaseGoTo.goToRoomFlag(creep) },
    goToWorkroom: function (creep) { return creepBaseGoTo.goToWorkroom(creep) },

    TransportEnergyToHomeSpawn: function (creep) { return creepBaseTransport.TransportEnergyToHomeSpawn(creep); },
    TransportEnergyToHomeTower: function (creep) { return creepBaseTransport.TransportEnergyToHomeTower(creep); },
    TransportToHomeTerminal: function (creep, type) { return creepBaseTransport.TransportToHomeTerminal(creep, type); },
    TransportToHomeStorage: function (creep, type) { return creepBaseTransport.TransportToHomeStorage(creep, type); },
    TransportToHomeContainer: function (creep, type) { return creepBaseTransport.TransportToHomeContainer(creep, type); },
    TransportToHomeLab: function (creep, type) { return creepBaseTransport.TransportToHomeLab(creep, type); },

    checkWorkroomPrioSpawn: function (creep) {
        if (Memory.rooms[creep.memory.workroom].aktivPrioSpawn) {
            if (this.TransportEnergyToHomeSpawn(creep)) {
                creep.say('🚨');
                return true;
            }
        }
        return false;
    },
    upgradeController: function (creep) {
        var controller = creep.room.controller;
        if (!controller && !controller.my)
            return;

        const state = creep.upgradeController(controller);
        if (state === ERR_NOT_IN_RANGE) {
            creep.moveTo(controller, { reusePath: 5 });
        }

        if (!controller.sign ||
            controller.sign.username == undefined ||
            controller.sign.username != creep.owner.username) {

            var c = creep.signController(controller, '⚔')
            if (c === ERR_NOT_IN_RANGE) {
                creep.moveTo(controller, { reusePath: 5 });
            }
        }

        return;
    },
    spawn: function (spawn, profil, newName, memory) {
        if (spawn.spawnCreep(profil, newName, { dryRun: true }) === 0) {
            spawn.spawnCreep(profil, newName, { memory: memory });
            console.log("[" + spawn.room.name + "|" + memory.workroom + "] spawn " + newName + " cost: " + this.calcProfil(profil));
            return true;
        }
        return false;
    }
};