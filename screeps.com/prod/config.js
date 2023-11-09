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
   E57N6:
   {
      room:'E57N6',
      spawnRoom: 'E58N6',
      sendMiner: true,
      sendDebitor: true,
      sendFreeDebitor: false,
      sendBuilder: true,
      sendDefender: true,
      sendClaimer: true,

      //mining
      debitorProSource: 2,  
      debitorAsFreelancer: 0,  
      energySources: [
       '5bbcb07b9099fc012e63c406',  
      ],
      mineralSources:[],

      useLinks: false,
      targetLinks:[
        
      ],
      spawnLink: null,
      controllerLink: null,

      //structures
      repairer: 0,
      maxwallRepairer : 0,
      maxbuilder: 1,
      prioBuildings: [      
      ],
      walls: [],
 
      //controller  
      upgrader: 0,
   },
   E58N5:
   {
      room:'E58N5',
      spawnRoom: 'E58N6',
      sendMiner: true,
      sendDebitor: true,
      sendFreeDebitor: false,
      sendBuilder: true,
      sendDefender: true,
      sendClaimer: true,

      //mining
      debitorProSource: 2,  
      debitorAsFreelancer: 0,  
      energySources: [
       '5bbcb08d9099fc012e63c593',  
      ],
      mineralSources:[],
      useLinks: false,
      targetLinks:[
        
      ],
      spawnLink: null,
      controllerLink: null,

      //structures
      repairer: 0,
      maxwallRepairer : 0,
      maxbuilder: 1,
      prioBuildings: [      
      ],
      walls: [],
 
      //controller  
      upgrader: 0,
   },
   E58N6:
   {
      room:'E58N6',
      spawnRoom: 'E58N6',
      sendMiner: true,
      sendDebitor: true,
      sendFreeDebitor: true,
      sendBuilder: true,
      sendDefender: true,
      sendClaimer: false,

      //mining
      debitorProSource: 1,  
      debitorAsFreelancer: 2,  
      energySources: [
       '5bbcb08d9099fc012e63c58f',
       '5bbcb08d9099fc012e63c590',
      ],
      mineralSources:[],

      useLinks: false,
      targetLinks:[
         '653aed0d2fa32d1c887ab4e7'
      ],
      spawnLink:null,
      controllerLink: '653aed0d2fa32d1c887ab4e7',

      //structures
      repairer: 0,
      maxwallRepairer : 1,
      maxbuilder: 1,
      prioBuildings: [ ],
      walls: [
         '653d751a95252f57a7bdaa70',
         '653c29ef45f887eae7d86ad4',
         '653d74c0d65ed2056ceed33d',
         '653d74c9076fff230b8e3c08',
         '653d74d3733df640874326e9',
         '653d74ddef992f6e232d6afe',
         '653d74edcbf5a8fec337c8ff',
         '653ec132b098db6a38b8ee7f'
      ],
 
      //controller  
      upgrader: 1,
   },
   E58N7:
   {
      room:'E58N7',
      spawnRoom: 'E58N7',
      sendMiner: true,
      sendDebitor: true,
      sendFreeDebitor: true,
      sendBuilder: true,
      sendDefender: true,
      sendClaimer: false,

      //mining
      debitorProSource: 1,  
      debitorAsFreelancer: 1,  
      energySources: [
       '5bbcb08d9099fc012e63c58c',
       '5bbcb08d9099fc012e63c58a',
      ],
      mineralSources:[],

      useLinks: true,
      targetLinks:[
         '6536132f35ce1252bbb1e817',
         '65380c0c74becf6de75f0370'       
      ],
      spawnLink:'6536132f35ce1252bbb1e817',
      controllerLink: '65380c0c74becf6de75f0370',

      //structures
      repairer: 0,
      maxwallRepairer : 1,
      maxbuilder: 1,
      prioBuildings: [ ],
      walls: [
         '64f242f2a5a4d3e4fe5f51e3',
         '64f242ef4944463742be4755',
         '64f242ec954ac16116920008',
         '63a4f4cac38c3d4c751852f4',
         '62c8cb4e0c27bac1e106d6f8',
         '62c8cb48441e08de0413033d',
         '62c8cb427461ab54e35ce65c',
         '62c8cb3038234d5f8828e301',
         '62c8cb2a1799e0cf86a2a525',
         '62c8cb27adf17a3afb33f18f',
         '64f291a7566ad71c341accfb',
         '64f291a34c08aa553a2d41c0',
         '62c3e1adf01a182f73146705',
         '62c3e1aa75d162406c9b3ed7',
         '635e2f7bf4df97732d889859',
         '635e2f78b24bb025d890da64'
      ],
 
      //controller  
      upgrader: 1,
   },
   E58N8:
   {
      room:'E58N8',
      spawnRoom: 'E59N9',
      sendMiner: true,
      sendDebitor: true,
      sendFreeDebitor: false,
      sendBuilder: true,
      sendDefender: true,
      sendClaimer: true,

      //mining
      debitorProSource: 2,  
      debitorAsFreelancer: 0,  
      energySources: [
       '5bbcb08d9099fc012e63c588',  
      ],
      mineralSources:[],

      useLinks: false,
      targetLinks:[
      
      ],
      spawnLink: null,
      controllerLink: null,

      //structures
      repairer: 0,
      maxwallRepairer : 0,
      maxbuilder: 1,
      prioBuildings: [      
      ],
      walls: [
        
      ],
 
      //controller  
      upgrader: 0,
   },
   E59N4:
   {
      room:'E59N4',
      spawnRoom: 'E59N4',
      sendMiner: true,
      sendDebitor: true,
      sendFreeDebitor: true,
      sendBuilder: true,
      sendDefender: true,
      sendClaimer: false,

      //mining
      debitorProSource: 1,  
      debitorAsFreelancer: 1,  
      energySources: [
       '5bbcb09f9099fc012e63c71a',  
       '5bbcb09f9099fc012e63c71b'
      ],
      mineralSources:['5bbcb73ad867df5e54207e1f'],

      useLinks: false,
      targetLinks:[
        
      ],
      spawnLink: null,
      controllerLink: null,

      //structures
      repairer: 0,
      maxwallRepairer : 1,
      maxbuilder: 2,
      prioBuildings: [      
      ],
      walls: [],
 
      //controller  
      upgrader: 1,
   },
   E59N7:
   {
      room:'E59N7',
      spawnRoom: 'E58N7',
      sendMiner: true,
      sendDebitor: true,
      sendFreeDebitor: false,
      sendBuilder: true,
      sendDefender: true,
      sendClaimer: true,

      //mining
      debitorProSource: 1,  
      debitorAsFreelancer: 0,  
      energySources: [
       '5bbcb09e9099fc012e63c711',  
      ],
      mineralSources:[],
      useLinks: false,
      targetLinks:[
        
      ],
      spawnLink: null,
      controllerLink: null,

      //structures
      repairer: 0,
      maxwallRepairer : 0,
      maxbuilder: 1,
      prioBuildings: [ ],
      walls: [],
 
      //controller  
      upgrader: 0,
   },
   E59N8:
   {
      room:'E59N8',
      spawnRoom: 'E59N9',
      sendMiner: true,
      sendDebitor: true,
      sendFreeDebitor: false,
      sendBuilder: true,
      sendDefender: true,
      sendClaimer: true,

      //mining
      debitorProSource: 2,  
      debitorAsFreelancer: 0,  
      energySources: [
       '5bbcb09e9099fc012e63c70e',  
      ],
      mineralSources:[],

      useLinks: false,
      targetLinks:[
        
      ],
      spawnLink: null,
      controllerLink: null,

      //structures
      repairer: 0,
      maxwallRepairer : 0,
      maxbuilder: 1,
      prioBuildings: [ 
         '64faa4011ae98a0ce014fda8',
         '64fb3dc4b140246d9bd1f0dd',
      ],
      walls: [],
 
      //controller  
      upgrader: 0,
   },
   E59N9:
   {
      room:'E59N9',
      spawnRoom: 'E59N9',
      sendMiner: true,
      sendDebitor: true,
      sendFreeDebitor: true,
      sendBuilder: true,
      sendDefender: true,
      sendClaimer: false,

      //mining
      debitorProSource: 0,  
      debitorAsFreelancer: 2,  
      energySources: [
       '5bbcb09e9099fc012e63c70a',
       '5bbcb09e9099fc012e63c70b',
      ],
      mineralSources:[],

      useLinks: true,
      targetLinks:[
         '653098a7cb8a243ec9ae4d6d',
         '65354f9aade2340fef294995'
      ],
      spawnLink:'653098a7cb8a243ec9ae4d6d',
      controllerLink: '65354f9aade2340fef294995',

      //structures
      repairer: 0,
      maxwallRepairer : 1,
      maxbuilder: 1,
      prioBuildings: [ ],
      walls: [
         '65038dbf1634b02930a313c3',
         '65357291aae590039f06b0b3',
         '6509e5e006be381cbbac9b98',
         '653c0b56d51f35114c9ec7b4',
         '653c0b44e834a818088b4aaf',
         '653c0b382e4fb965bc109fae',
         '653c0b2fd0c65f86b50919f3',
      ],
 
      //controller  
      upgrader: 1,
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
      [STRUCTURE_STORAGE]: 1,
      [STRUCTURE_ROAD]:2   
   },
   repair: {
      [STRUCTURE_RAMPART]: 7,
      [STRUCTURE_WALL]: 1,
      [STRUCTURE_EXTENSION]: 2,
      [STRUCTURE_SPAWN]: 2,
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
      [STRUCTURE_RAMPART]: 0.2,      
      [STRUCTURE_ROAD]:0.75,  
  }
},
global.log = function(bool, msg)
{
   if(bool)
   console.log(msg)
}
