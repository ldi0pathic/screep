var upgrader = require('role.upgrader');
var debitor  = require('role.debitor');
var reserver = require('role.reserver');
var attack = require('role.attack');
var wall = require('role.wall')


var spawner = 
{
   
    clear: function() {
        for(var name in Memory.creeps) 
        {
            if(!Game.creeps[name]) 
            {
                delete Memory.creeps[name];
            }
        }
        
        
    },
   
    spawn: function() 
    {
        for(var spawnName in Game.spawns)
        {
            var spawn = Game.spawns[spawnName];
            
            
            if(spawn.spawning ) 
                continue;
             
            if(spawn.name == 'P3' && wall.spawn(spawn,'E58N6'))    
              continue;
                
                
            var breaker = false;
            for(var room in Memory.rooms)
            { 
                if(Memory.rooms[room].claim && Memory.rooms[room].mainSpawn == spawn.room.name && reserver.spawn(spawn,room))
                {
                    breaker = true;
                    break;
                }
                
                var gameRoom = Game.rooms[room];
                if(!gameRoom) continue;
                
                let invaderCore = gameRoom.find(FIND_HOSTILE_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_INVADER_CORE})[0]
                if (invaderCore) {
                    console.log("Core in Raum "+ room);
                    continue;
                }
                
                if(debitor.spawn(spawn,room))
                {   
                    breaker = true;
                    break;
                }
                
                if(spawnMiner(spawn,room))
                {   
                    breaker = true;
                    break;
                }
                
             
            }     
              if(Memory.prioEnergie || breaker)
                continue;
          if(spawnBob(spawn, 4)) 
                continue;
            //if(attack.spawn(spawn,'E58N6')) 
              //  continue; 
            
            if(spawnDropper(spawn,1)) 
                continue; 
                
            if(spawnReps(spawn,4))  
              continue;
              
            if(upgrader.spawn(spawn,spawn.room.name))         
                continue;
                
            if(spawnTraveller(spawn,1))
                continue;
          
        }
    },
}

function getNrofCreep(role)
{
    return _.filter(Game.creeps, (creep) => creep.memory.role == role).length;
}

function getNrofCreepInRoom(role, workroom)
{
    return _.filter(Game.creeps, (creep) => creep.memory.role == role && creep.memory.workroom == workroom).length;
}
function spawnClaimer(spawn, max, targetroom)
{
    var role  = 'claimer';
    
     var c = _.filter(Game.creeps, (creep) => creep.memory.role == role && creep.memory.target == targetroom).length;
  
    if(c < max) 
    {
        var newName = role + '_' + Game.time;
        var profil = [CLAIM,CARRY,CARRY, MOVE, MOVE];
        
        
        if( spawn.spawnCreep(profil, newName,{dryRun: true}) === 0)
        {
            spawn.spawnCreep(profil, newName, {memory: {role: role, carry: false, target:targetroom}});
            console.log(spawn.name+' spawn '+newName+' cost: '+calcProfil(profil));
            return true;
        }
        console.log('Prioblock für Claimer Spawn Raum '+targetroom+' cost: '+calcProfil(profil))
        Memory.prioEnergie = true;
        return true;
    }
    return false;
}

function spawnTraveller(spawn, max)
{
    var role  = 'traveller';
  
    if(getNrofCreep(role) < max) 
    {
        var newName = role + '_' + Game.time;
        var profil = [MOVE];
        
        if( spawn.spawnCreep(profil, newName,{dryRun: true}) === 0)
        {
            spawn.spawnCreep(profil, newName, {memory: {role: role, carry: false, index:0, target:spawn.room.name}});
            console.log(spawn.name+'spawn '+newName+' cost: '+calcProfil(profil));
            return true;
        }
    }
    return false;
}
function spawnDropper(spawn, max)
{
    var role  = 'dropper';
    var c = _.filter(Game.creeps, (creep) => creep.memory.role == role && creep.memory.home == spawn.room.name).length;

    if(c < max) 
    {
        var newName = role + '_' + Game.time;
        var max = parseInt(spawn.room.energyCapacityAvailable/300);
        var profil = [WORK].concat(Array(max).fill(CARRY).concat(Array(max+1).fill(MOVE)));
        var storage = '';
        if(spawn.room.storage)
        {
            storage = spawn.room.storage.id;
        }
     
        if( spawn.spawnCreep(profil, newName,{dryRun: true}) === 0)
        {
            spawn.spawnCreep(profil, newName, {memory: {role: role,storage:storage,home:spawn.room.name,  carry: false}});
            console.log(spawn.name+'spawn '+newName+' cost: '+calcProfil(profil))
            return true;
        }
    }
    return false;
}
function spawnBob(spawn, max)
{
    var role  = 'bob';
  
    if(getNrofCreep(role) < max) 
    {
        var newName = role + '_' + Game.time;
        var profil = [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
        
        if( spawn.spawnCreep(profil, newName,{dryRun: true}) === 0)
        {
            spawn.spawnCreep(profil, newName, {memory: {role: role, carry: false}});
            console.log(spawn.name+'spawn '+newName+' cost: '+calcProfil(profil))
            return true;
        }
    }
    return false;
}

function spawnReps(spawn, max)
{
    var role  = 'reps';
    var c = _.filter(Game.creeps, (creep) => creep.memory.role == role && creep.memory.home == spawn.room.name).length;

    if(c < max) 
    {
        var newName = role + '_' + Game.time;
        const totalCost = 3 * BODYPART_COST[WORK] + 2 * BODYPART_COST[CARRY] + 2 * BODYPART_COST[MOVE];
        var maxEnergy = spawn.room.energyCapacityAvailable;
        // Bestimme, wie viele Sets des ausgewählten Verhältnisses erstellt werden können.
        const numberOfSets = Math.floor(maxEnergy / totalCost);
        var profil = Array((numberOfSets*3)).fill(WORK).concat(Array((numberOfSets*2)).fill(CARRY).concat(Array((numberOfSets*2)).fill(MOVE)));
        
        
        if( spawn.spawnCreep(profil, newName,{dryRun: true}) === 0)
        {
            spawn.spawnCreep(profil, newName, {memory: {role: role, carry: false, home:spawn.room.name}});
            console.log(spawn.name+'spawn '+newName+' cost: '+calcProfil(profil));
            return true;
        }
    }
    return false;
}

function spawnMiner(spawn,  workroom)
{
    var role  = 'miner';
    var room = Memory.rooms[workroom];
    var c = getNrofCreepInRoom(role,workroom);
    
    if(spawn.room.name == room.mainSpawn && c < room.contOfMiner) 
    {
        var newName = role + '_' + Game.time;
        var maxEnergy = spawn.room.energyCapacityAvailable;
       
        const maxWorkParts = Math.floor((maxEnergy-100) / BODYPART_COST[WORK]);
      
        const numberOfWorkParts = Math.min(maxWorkParts, 5);
        
        let profil = [];
        
        for (let i = 0; i < numberOfWorkParts; i++) {
            profil.push(WORK);
        }
        
        profil.push(CARRY);
        profil.push(MOVE);
        
        var rest = Math.floor((maxEnergy-800) / 50);
        rest = Math.min(rest, 3);
        for (let i = 0; i < rest; i++) {
            profil.push(MOVE);
        }
        
        if(c == 0 && spawn.room.energyAvailable <= 300)
        {
            console.log('NOTFALLSpawn Miner >>'+spawn.room.energyAvailable)
            profil = [WORK,WORK,CARRY,MOVE];
        }
        
        if( spawn.spawnCreep(profil, newName,{dryRun: true}) === 0)
        {
            spawn.spawnCreep(profil, newName, {memory: {role: role, carry: false, workroom:workroom}});
            console.log(spawn.name+'spawn '+newName+' für Raum '+workroom+' cost: '+calcProfil(profil))
            Memory.prioEnergie = false;
            return true;
        }
        
       
        console.log('Prioblock für Miner Spawn Raum '+workroom+' cost: '+calcProfil(profil))
        Memory.prioEnergie = true;
        return true;
        
       
    }
   
    return false ;
}

function calcProfil(creepProfile) {
    let energyCost = 0;

    for (const bodyPart of creepProfile) {
        energyCost += BODYPART_COST[bodyPart];
    }

    return energyCost;
}

module.exports = spawner;