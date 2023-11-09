const creepBase = require('./creep.base');
require('./config');
const role = "defender";

module.exports = {
    sayJob: function() { this.creep.say('⚔') },
    doJob: function (creep) 
    {

        if(creepBase.goToWorkroom(creep)) return;
        if(this._defend(creep)) return;
        

    },
    _defend: function(creep)
    {
        const enemies = creep.room.find(FIND_HOSTILE_CREEPS);

        if (enemies.length > 0) {
            
            const target = creep.pos.findClosestByRange(enemies);
            const result = creep.attack(target);
            creep.rangedAttack(target);

            if (result === OK) {
                console.log(`${creep.name} greift ${target.name} an.`);
            }
            else
            {
                creep.say('✊')
                creep.moveTo(target, {reusePath: 5});
            }
        }
        else
        {
          
            Memory.rooms[creep.memory.workroom].needDefence = false;
            creep.say('💥 Bye!');
            creep.suicide();
                
        }
        
        if (creep.getActiveBodyparts(ATTACK) + creep.getActiveBodyparts(RANGED_ATTACK) == 0) 
        {        
            creep.say('💥 Bye!');
            creep.suicide();
        }
    },
    _getProfil: function(spawn)
    {
        const totalCost =  BODYPART_COST[TOUGH] + 2*BODYPART_COST[MOVE] + BODYPART_COST[ATTACK] + BODYPART_COST[RANGED_ATTACK];
       
        var max = Math.min(5, parseInt(spawn.room.energyAvailable / totalCost));
     
        if(max == 0 || max == null)
        {
            return [MOVE,MOVE,ATTACK,RANGED_ATTACK];
        }

        return Array((max)).fill(TOUGH).concat(Array((max*2)).fill(MOVE).concat(Array((max)).fill(ATTACK)).concat(Array((max)).fill(RANGED_ATTACK)));
    },
    spawn: function(spawn,workroom)
    {
        if((!Memory.rooms[workroom].needDefence && !Memory.rooms[workroom].invaderCore) || !global.room[workroom].sendDefender)
            return false;

        var count = _.filter(Game.creeps, (creep) => creep.memory.role == role && 
                                                    creep.memory.workroom == workroom).length;
                                
        if (2 <= count)
            return false;
        
        if( creepBase.spawn(spawn, this._getProfil(spawn), role + '_' + Game.time,{ role: role, workroom: workroom, home: spawn.room.name}))
        {
            Memory.cOfDefender += 1;
            return true;
        }
        console.log('3');
        return false;
    },
   
};