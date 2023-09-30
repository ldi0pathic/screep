var roleBuilder = require('role.builder');

var roleHarvester = require('role.harvester');
var roleDeffend = require('role.defend')
var roleUpgrader = require('role.upgrader');
var roleRepair = require('role.repairer');
var roleMiner = require('role.miner');
var roletraveller = require('role.traveller');

var roleDebitor = require('role.debitor');
var roleDropper = require('role.dropper');


var spawner = require('spawner');
var newRoom = require('init.newRoom');

var mapActions = require('map.scriptHandler');

var defender = require('role.defender');
var claimer = require('role.claimer');
var reserver = require('role.reserver');
var attack = require('role.attack');
var wall = require('role.wall')

 const structurePriorities = {
        [STRUCTURE_WALL]: 0.0015,
        [STRUCTURE_CONTAINER]: 1,
        [STRUCTURE_RAMPART]: 0.4
    };
    
    
var test = 1;    
module.exports.loop = function () {

    spawner.clear();
    spawner.spawn();
    mapActions.handle();
    
    if(Game.cpu.bucket == 10000) {
        Game.cpu.generatePixel();
    }
    
   /* 
    var newName = 'reps_' + Game.time;
    var profil = [WORK, WORK,  CARRY, CARRY,  MOVE, MOVE];
        
        
    if( Game.spawns.P2.spawnCreep(profil, newName,{dryRun: true}) === 0)
    {
         Game.spawns.P2.spawnCreep(profil, newName, {memory: {role: 'reps', carry: false}});
        console.log('spawn '+newName+' cost: '+calcProfil(profil));
        return true;
    }
    */
    
   
    //newRoom.add('E58N6');
    
    
    //Memory.rooms.E59N9.contOfMiner = 0;
  //newRoom.add('E59N9', true, true, true, true, 'E59N9');
    
    var towers = ['65043f57f265d290da2a0899','64f483648bfafd0f57771802','64fc6a640286a021f3e07364','65088f252d96f8835cf7adbc']
    
    
    for(var t in towers)
    {
        var tower = Game.getObjectById(towers[t]);
   
        if(tower) 
        {
            if(!Memory.prioEnergie && ! Memory.prioAttack)
            {
                var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                 filter: (structure) => 
                                {
                                    const priority = structurePriorities[structure.structureType];
                                    return priority && structure.hits < structure.hitsMax * priority;
                                }
                            });
                if(closestDamagedStructure) {
                    tower.repair(closestDamagedStructure);
                }
            }
            
          var hostileCreeps = tower.room.find(FIND_HOSTILE_CREEPS);

            if (hostileCreeps.length > 0) {
                // Sortiere die feindlichen Creeps nach ihren Bodypart-Kosten in absteigender Reihenfolge
                hostileCreeps.sort(function (a, b) {
                    var costA = a.body.reduce(function (total, part) {
                        return total + BODYPART_COST[part.type];
                    }, 0);
    
                    var costB = b.body.reduce(function (total, part) {
                        return total + BODYPART_COST[part.type];
                    }, 0);
    
                    return costB - costA;
                });
    
                // Greife den teuersten feindlichen Creep an
                tower.attack(hostileCreeps[0]);
            }
            else
            {
                Memory.prioAttack = false;
            }
        }
    }
   
    
    var room = Game.spawns.P1.room;
    var room2 = Game.spawns.P2.room;
    var room3 = Game.spawns.P3.room;

    if(room.energyAvailable == room.energyCapacityAvailable && room2.energyAvailable == room2.energyCapacityAvailable && room3.energyAvailable == room3.energyCapacityAvailable)
    {
        Memory.prioEnergie = false;
    }
    
    
    for(var name in Game.creeps) 
    {
        var creep = Game.creeps[name];
        
        if(Memory.prioEnergie || Memory.prioAttack)
        {
            if(creep.memory.role != 'miner'   && 
               creep.memory.role != 'debitor' && 
               creep.memory.role != 'traveller' &&
               creep.memory.role != 'destroyer' &&
                creep.memory.role != 'claimer' &&
                 creep.memory.role != 'defender' &&
                   creep.memory.role != 'dropper' &&
                    creep.memory.role != 'reserver' &&
               (creep.room.name == room.name || creep.room.name == room2.name || creep.room.name == room3.name))
            {
                creep.say('⬜');
                roleHarvester.run(creep);
            
                continue;
            }
        }
        
        switch (creep.memory.role) 
        {
            case 'destroyer':
                attacker.run(creep);
            break;
            
            case 'defender':
                defender.run(creep);
            break;
            
            case 'claimer':
                claimer.run(creep);
            break;
            case 'traveller':
                roletraveller.run(creep);
            break;
            
            case 'miner':
                roleMiner.run(creep);
            break;
                
            case 'uppi':
               roleUpgrader.run(creep);
            break;

            case 'reps':
                roleRepair.run(creep);
            break;
            
            case 'debitor':
                roleDebitor.run(creep);
            break;
            
            case 'dropper':
                roleDropper.run(creep);
            break;
            
            case 'bob':
                roleBuilder.run(creep);
            break;
            
            case 'reserver':
                reserver.run(creep);
                break;
                
            case 'attacker':
                attack.run(creep)
                break;
                    
            case 'wally':
                wall.run(creep)
            break;
            
            default:
                {
                    creep.say('💀')
                     if(Game.spawns.P1.recycleCreep(creep) == ERR_NOT_IN_RANGE)
                     {
                         creep.moveTo(Game.spawns.P1);
                     }
                }
                
                
        }
    }
   
   
}