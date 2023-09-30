'use strict';
global.room = global.room || {};
global.prio = global.prio || {};
global.const = global.const || {};
global.const =
{
   maxRepairs: 5,
}
global.room =
{
   sim:
   {
      spawnRoom: 'sim',
      sendMiner: true,
      sendDebitor: true,
      sendBuilder: true,
      sendDefender: true,
      sendClaimer: false,

      //mining
      debitorProSource: 1,  
      debitorAsFreelancer: 1,  
      energySources: [
       '1f7929356b48513d5418a844',
       '25ac5d6d7baee0b09ad3d3da',
      ],
      mineralSources:[
        '0a164da07ca059c5f95e6f29'
      ],

      //structures
      repairer: 2,
      maxbuilder: 5,
      prioBuildings: [
        
      ],

      //controller  
      upgrader: 2,
   }
},
global.prio =
{
   build: {
      [STRUCTURE_RAMPART]: 1,
      [STRUCTURE_WALL]: 1,
      [STRUCTURE_EXTENSION]: 2,
      [STRUCTURE_SPAWN]: 2,
      [STRUCTURE_TOWER]: 2,
      [STRUCTURE_CONTAINER]: 3,
      [STRUCTURE_LINK]:3,
      [STRUCTURE_STORAGE]: 4,
      [STRUCTURE_ROAD]:5,   
   },
   repair: {
      [STRUCTURE_RAMPART]: 1,
      [STRUCTURE_EXTENSION]: 1,
      [STRUCTURE_SPAWN]: 1,
      [STRUCTURE_TOWER]: 3,
      [STRUCTURE_STORAGE]: 4,
      [STRUCTURE_CONTAINER]: 5,
      [STRUCTURE_ROAD]:6,         
  },
  hits:{
      [STRUCTURE_TOWER]: 0.75,       
      [STRUCTURE_STORAGE]: 0.75,     
      [STRUCTURE_CONTAINER]: 0.75,    
      [STRUCTURE_WALL]: 0.0005,
      [STRUCTURE_RAMPART]: 0.1,      
      [STRUCTURE_ROAD]:0.75,  
  }
}