'use strict';
global.room = global.room || {};
global.prio = global.prio || {};
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
         'e29f4fbdeaf306bc749dc709',
         '94167ccb7437b20b1f5e2d96',
         '67c65e37e98d75ab397d5fc1'
      ],

      //repair
      repairer: 2,
      buildings: [
         '091112d2e5ff9d872bd43027',
         'd0777af13fff3409b999d5ac'
        ],

      upgrader: 2,


   }
},
global.prio =
{
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
      [STRUCTURE_RAMPART]: 0.999,      
      [STRUCTURE_ROAD]:0.75,  
  }
}