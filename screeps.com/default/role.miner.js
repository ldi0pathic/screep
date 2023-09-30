
var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) 
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
                let containers = creep.room.find(FIND_STRUCTURES, 
                {
                    filter: (x) => 
                    {
                        return x.structureType == STRUCTURE_CONTAINER;
                    },
                });
                
                let miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner' && creep.memory.workroom == creep.room.name );
                
                let container;
                
               for(let i = 0; i < containers.length; ++i)
               {
                   let c =containers[i];
               
                    
                   var hasMiner = false;
                    for(let j = 0; j < miners.length; ++j)
                    {
                        let miner = miners[j];
                        
                        if(miner.memory.pos)
                        {
                            if(c.pos.x == miner.memory.pos.x && c.pos.y == miner.memory.pos.y)
                            {
                               hasMiner = true;
                               break;
                            } 
                        }
                        else if(miner.memory.onPosition)
                        {
                            if(c.pos.x == miner.pos.x && c.pos.y == miner.pos.y)
                            {
                               hasMiner = true;
                               break;
                            }  
                        }
                    }
                    
                    if(!hasMiner)
                    {
                        container = c;
                        break;
                    }
                }
                
                
                if(container)
                {
                    finalLocation = container.pos;
                    creep.memory.pos = container.pos;
                    creep.memory.container = container.id;
                } 
                else
                {
                     let c = creep.room.find(FIND_CONSTRUCTION_SITES, 
                    {
                        filter: (x) => 
                        {
                            return x.structureType == STRUCTURE_CONTAINER;
                        },
                    });
                    
                    if(c.length > 0)
                    {
                        finalLocation = c[0].pos;
                        creep.memory.pos = c[0].pos;
                        creep.memory.container = c[0].id;
                    }
                    else
                    {
                        creep.say('🛑');
                        creep.memory.role = '';
                        return; 
                    }
                }
            }
            else
            {
               finalLocation = creep.memory.pos;
            }
            
            if (creep.pos.x == creep.memory.pos.x && creep.pos.y == creep.memory.pos.y) 
            {
             
              
              var source = creep.pos.findClosestByPath(FIND_SOURCES);
              if (creep.harvest(source) === ERR_NOT_IN_RANGE) 
              {
                    var mineral = creep.pos.findClosestByPath(FIND_MINERALS);
                    if (creep.harvest(mineral) === ERR_NOT_IN_RANGE) 
                    {
                        creep.say('HELP!')
                    }
                    else
                    {
                        creep.memory.miningSource = mineral.id;
                        creep.memory.onPosition = true;
                        delete creep.memory.pos;
                    }
              }
              else
              {
                    creep.memory.miningSource = source.id;
                    creep.memory.onPosition = true;
                    delete creep.memory.pos;
              }
              
            } 
            else if(!creep.moveTo(new RoomPosition(finalLocation.x, finalLocation.y,finalLocation.roomName) , {visualizePathStyle: {stroke: '#ffaa00'},reusePath: 10,}) == OK)
            {
                  const blockingCreep = creep.pos.findInRange(FIND_MY_CREEPS, 1, {
                    filter: (otherCreep) => otherCreep.memory.role !== 'miner'
                })[0];
    
                if (blockingCreep) 
                {
                    // Der Miner ist blockiert, fordern Sie den blockierenden Creep auf, sich zu bewegen
                    const direction = creep.pos.getDirectionTo(blockingCreep);
                    const oppositeDirection = (direction + 3) % 8 + 1; // Berechnen Sie die entgegengesetzte Richtung
                    creep.say('\'-.-')
                    // Bewegen Sie den blockierenden Creep in die entgegengesetzte Richtung
                    blockingCreep.move(oppositeDirection);
                }
            } 
        }
        else
        {
            const source = Game.getObjectById(creep.memory.miningSource);
            var state = creep.harvest(source) ;
            if(state != OK)
            {
                if(state == ERR_TIRED)
                {
                    creep.say('😴')
                }
                else
                {
                    creep.say(state+' :('); 
                }
            }
            
            if(creep.store[RESOURCE_ENERGY] > 0 )
            {
                const container = Game.getObjectById(creep.memory.container);
            
                if(container && container.progressTotal == undefined && container.hits < container.hitsMax)
                {
                    creep.say('🛠');
                    creep.repair(container);
                }
                else if(container && container.progressTotal != undefined && container.progressTotal > container.progress)
                {
                    creep.say('🛠');
                    creep.build(container); 
                } 
            }
           
            
            
        }
    }
};




module.exports = roleMiner;