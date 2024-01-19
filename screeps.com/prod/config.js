'use strict';

const { isString } = require("lodash");

global.room = global.room || {};
global.prio = global.prio || {};
global.const = global.const || {};
global.const =
{
   maxRepairs: 5,
   logroom: ''//'E59N3',//'E56N2'//'E59N4',
},
global.minSalePrice =
{
   H: 100,
   O: 32,
   U: 48,
   L: 26,
   X: 140,

},
global.maxOrderPrice =
{
   pixel: 35000,
},
global.transfer =
{
   /*E59N7:
   {
      room: 'E59N7',
      source: [
      //  'E59N9',
         'E58N7',  
         'E58N6',
      ]
   },*/
   E56N2:
   {
      room: 'E56N2',
      source: [
         'E59N4',
         'E58N6',
         'E58N7',  
      ]
   },
   E59N3:
   {
      room: 'E59N3',
      source: [
         'E59N4',
       
      ]
   },
  
}
global.room =
{
   E56N2:
   {
      room: 'E56N2',
      spawnRoom: 'E56N2',
      transferEnergie: true,
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
        '5bbcb06a9099fc012e63c22a',
        '5bbcb06a9099fc012e63c228'
      ],
      mineralSources: ['5bbcb712d867df5e54207cef'],
      mineralContainerId: '65a3f92c47d4ab5dbc49ab20',

      useLinks: false,
      targetLinks: [
         '65a8e102a9f76183fcfea635'
      ],
      spawnLink: '65a8e102a9f76183fcfea635',
      controllerLink: null,

      //structures
      repairer: 0,
      maxwallRepairer: 2,
      maxbuilder: 2,
      prioBuildings: [
      ],
   
      //controller  
      upgrader: 2,
   },
   E56N3:
   {
     
      room: 'E56N3',
      spawnRoom: 'E56N2',
      sendMiner: true,
      sendDebitor: true,
      sendFreeDebitor: false,
      sendBuilder: false,
      sendDefender: true,
      sendClaimer: true,

      //mining
      debitorProSource: 1,
      debitorAsFreelancer: 0,
      energySources: [
        '5bbcb06a9099fc012e63c225',
       
      ],
      mineralSources: null,
      mineralContainerId: null,

      useLinks: false,
      targetLinks: [

      ],
      spawnLink: null,
      controllerLink: null,

      //structures
      repairer: 0,
      maxwallRepairer: 0,
      maxbuilder: 0,
      prioBuildings: [
      ],
   
      //controller  
      upgrader: 0,
   },
   E57N6:
   {
      room: 'E57N6',
      spawnRoom: 'E58N6',
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
         '5bbcb07b9099fc012e63c406',
      ],
      mineralSources: [],

      useLinks: false,
      targetLinks: [

      ],
      spawnLink: null,
      controllerLink: null,

      //structures
      repairer: 0,
      maxwallRepairer: 0,
      maxbuilder: 1,
      prioBuildings: [
      ],
   
      //controller  
      upgrader: 0,
   },
   E58N4:
   {
      room: 'E58N4',
      spawnRoom: 'E59N4',
      sendMiner: true,
      sendDebitor: true,
      sendFreeDebitor: false,
      sendBuilder: false,
      sendDefender: true,
      sendClaimer: true,

      //mining
      debitorProSource: 1,
      debitorAsFreelancer: 0,
      energySources: [
         '5bbcb08d9099fc012e63c595',
      ],
      mineralSources: [],
      useLinks: false,
      targetLinks: [

      ],
      spawnLink: null,
      controllerLink: null,

      //structures
      repairer: 0,
      maxwallRepairer: 0,
      maxbuilder: 1,
      prioBuildings: [
      ],
      destroy:[
         '63adb4b3aeebaa08e3aa2851'
         
      ],
     

      //controller  
      upgrader: 0,
   },
   E58N5:
   {
      room: 'E58N5',
      spawnRoom: 'E58N6',
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
         '5bbcb08d9099fc012e63c593',
      ],
      mineralSources: [],
      useLinks: false,
      targetLinks: [

      ],
      spawnLink: null,
      controllerLink: null,

      //structures
      repairer: 0,
      maxwallRepairer: 0,
      maxbuilder: 1,
      prioBuildings: [
      ],
      destroy:[
         '63542d26da5582631af71fcc',
         '6255d32e5fdb145fecd7d923'
      ],
     

      //controller  
      upgrader: 0,
   },
   E58N6:
   {
      room: 'E58N6',
   //   spawnRoom: 'E58N6',
      sendMiner: true,
      sendDebitor: true,
      minHostile : 2,
      sendFreeDebitor: true,
      sendBuilder: true,
      sendDefender: true,
      sendClaimer: false,

      //mining
      debitorProSource: 1,
      debitorAsFreelancer: 1,
      energySources: [
         '5bbcb08d9099fc012e63c58f',
         '5bbcb08d9099fc012e63c590',
      ],
      mineralSources: ['5bbcb72cd867df5e54207db1'],

      useLinks: true,
      targetLinks: [
         '653aed0d2fa32d1c887ab4e7',
         '657f0915dbc7505af702443c'
      ],
      spawnLink: '657f0915dbc7505af702443c',
      controllerLink: '653aed0d2fa32d1c887ab4e7',

      //structures
      repairer: 0,
      maxwallRepairer: 1,
      maxbuilder: 1,
      prioBuildings: [],
    
      //controller  
      upgrader: 1,
   },
   E58N7:
   {
      room: 'E58N7',
   //   spawnRoom: 'E58N7',
      sendMiner: true,
      sendDebitor: true,
      minHostile : 2,
      sendFreeDebitor: true,
      sendBuilder: true,
      sendDefender: true,
      sendClaimer: false,

      //mining
      debitorProSource: 0,
      debitorAsFreelancer: 1,
      energySources: [
         '5bbcb08d9099fc012e63c58c',
         '5bbcb08d9099fc012e63c58a',
      ],
      mineralSources: [
         '5bbcb72cd867df5e54207db0'
      ],
      mineralContainerId: '658f0b73615ae9c2e4995fb6',

      useLinks: true,
      targetLinks: [
         '655269336b163b788bbbaec1',
         '65380c0c74becf6de75f0370'
      ],
      spawnLink: '655269336b163b788bbbaec1',
      controllerLink: '65380c0c74becf6de75f0370',

      //structures
      repairer: 0,
      maxwallRepairer: 1,
      maxbuilder: 2,
      prioBuildings: [],
     
      //controller  
      upgrader: 1,
   },
   E58N8:
   {
      room: 'E58N8',
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
      mineralSources: [],

      useLinks: false,
      targetLinks: [

      ],
      spawnLink: null,
      controllerLink: null,

      //structures
      repairer: 0,
      maxwallRepairer: 0,
      maxbuilder: 1,
      prioBuildings: [
      ],
      walls: [

      ],

      //controller  
      upgrader: 0,
   },
   E59N3:
   {
      room: 'E59N3',
      spawnRoom: 'E59N4',
      transferEnergie: true,
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
        '5bbcb09f9099fc012e63c71f',
        '5bbcb09f9099fc012e63c71d'
      ],
      mineralSources: ['5bbcb73ad867df5e54207e20'],
      mineralContainerId: null,
      useLinks: false,
      targetLinks: [
        
      ],
      spawnLink: null,
      controllerLink: null,

      //structures
      repairer: 1,
      maxwallRepairer: 2,
      maxbuilder: 2,
      prioBuildings: [
      ],
   
      //controller  
      upgrader: 1,
   },
   E59N4:
   {
      room: 'E59N4',
 //     spawnRoom: 'E59N4',
      sendMiner: true,
      sendDebitor: true,
      minHostile : 2,
      sendFreeDebitor: true,
      sendBuilder: true,
      sendDefender: true,
      sendClaimer: false,

      //mining
      debitorProSource: 0,
      debitorAsFreelancer: 1,
      energySources: [
         '5bbcb09f9099fc012e63c71a',
         '5bbcb09f9099fc012e63c71b'
      ],
      mineralSources: ['5bbcb73ad867df5e54207e1f'],

      useLinks: true,
      targetLinks: [
         '6578973df73fe84f5093792e',
         '65575938268cb37495966e50'
      ],
      spawnLink: '6578973df73fe84f5093792e',
      controllerLink: '65575938268cb37495966e50',

      //structures
      repairer: 0,
      maxwallRepairer: 1,
      maxbuilder: 3,
      prioBuildings: [
      ],
    

      //controller  
      upgrader: 1,
   },
   E59N5:
   {
      room: 'E59N5',
      spawnRoom: 'E59N4',
      sendMiner: true,
      sendDebitor: true,
      sendFreeDebitor: false,
      sendBuilder: false,
      sendDefender: true,
      sendClaimer: true,

      //mining
      debitorProSource: 1,
      debitorAsFreelancer: 0,
      energySources: [
         '5bbcb09f9099fc012e63c717',
      ],
      mineralSources: [],
      useLinks: false,
      targetLinks: [

      ],
      spawnLink: null,
      controllerLink: null,

      //structures
      repairer: 0,
      maxwallRepairer: 0,
      maxbuilder: 1,
      prioBuildings: [
      ],
     
      

      //controller  
      upgrader: 0,
   },
   E59N7:
   {
      room: 'E59N7',
      spawnRoom: 'E58N7',
      sendMiner: true,
      sendDebitor: true,
      sendFreeDebitor: false,
      sendBuilder: false,
      sendDefender: true,
      sendClaimer: true,

      //mining
      debitorProSource: 0,
      debitorAsFreelancer: 0,
      energySources: [
         '5bbcb09e9099fc012e63c711',
      ],
      mineralSources: ['5bbcb739d867df5e54207e1c'],
      
      useLinks: false,
      targetLinks: [
       
      ],
      spawnLink: null,
      controllerLink: null,

      //structures
      repairer: 0,
      maxwallRepairer: 0,
      maxbuilder: 1,
      prioBuildings: [],
     
    
      //controller  
      upgrader: 0,
   },
   E59N8:
   {
      room: 'E59N8',
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
      mineralSources: [],

      useLinks: false,
      targetLinks: [

      ],
      spawnLink: null,
      controllerLink: null,

      //structures
      repairer: 0,
      maxwallRepairer: 0,
      maxbuilder: 1,
      prioBuildings: [
         '64faa4011ae98a0ce014fda8',
         '64fb3dc4b140246d9bd1f0dd',
      ],
    
      //controller  
      upgrader: 0,
   },
   E59N9:
   {
      room: 'E59N9',
   //   spawnRoom: 'E59N9',
      sendMiner: true,
      sendDebitor: true,
      minHostile : 2,
      sendFreeDebitor: true,
      sendBuilder: true,
      sendDefender: true,
      sendClaimer: false,

      //mining
      debitorProSource: 0,
      debitorAsFreelancer: 1,
      energySources: [
         '5bbcb09e9099fc012e63c70a',
         '5bbcb09e9099fc012e63c70b',
      ],
      mineralSources: ['5bbcb739d867df5e54207e1a'],

      useLinks: true,
      targetLinks: [
         '655261fc8c582e53825955a1',
         '65354f9aade2340fef294995'
      ],
      spawnLink: '655261fc8c582e53825955a1',
      controllerLink: '65354f9aade2340fef294995',

      //structures
      repairer: 0,
      maxwallRepairer: 1,
      maxbuilder: 3,
      prioBuildings: [],
      //controller  
      upgrader: 1,
   }
},
   global.prio =
   {
      build: {
         [STRUCTURE_RAMPART]: 3,
         [STRUCTURE_WALL]: 3,
         [STRUCTURE_EXTENSION]: 1,
         [STRUCTURE_SPAWN]: 1,
         [STRUCTURE_TOWER]: 2,
         [STRUCTURE_CONTAINER]: 3,
         [STRUCTURE_LINK]: 1,
         [STRUCTURE_STORAGE]: 1,
         [STRUCTURE_LAB]: 4,
         [STRUCTURE_ROAD]: 5
      },
      repair: {
         [STRUCTURE_RAMPART]: 7,
         [STRUCTURE_WALL]: 1,
         [STRUCTURE_EXTENSION]: 2,
         [STRUCTURE_SPAWN]: 2,
         [STRUCTURE_TOWER]: 3,
         [STRUCTURE_STORAGE]: 4,
         [STRUCTURE_CONTAINER]: 5,
         [STRUCTURE_ROAD]: 6,
      },
      hits: {
         [STRUCTURE_TOWER]: 0.75,
         [STRUCTURE_STORAGE]: 0.75,
         [STRUCTURE_CONTAINER]: 0.75,
         [STRUCTURE_WALL]: 0.00001,
         [STRUCTURE_RAMPART]: 0.001,
         [STRUCTURE_ROAD]: 0.75,
      }
   },
   global.log = function (bool, msg) {
      if (bool && isString(msg))
      {
         console.log(msg);
      }
      else if(bool)
      {
         console.log(JSON.stringify(msg));
      }
         
   },
   global.logWorkroom = function (room, msg) {
      global.log(global.const.logroom == room, '[' + room + '] ' + msg);
   }
