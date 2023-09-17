var constructionSites = require('map.ConstructionSites');
var needRepair = require('map.NeedRepair');
var newRoom = require('init.newRoom');
var defend = require('map.defend')

let tickCounter = 0;
module.exports = 
{
    handle: function()
    {
        switch(tickCounter)
        {
            case 1: 
                {
                    for(var room in Memory.rooms)
                    {
                        defend.run(room);
                    }
                }
            case 3:
                {
                    for(var room in Memory.rooms)
                    {
                        newRoom.add(room.name, room.sendMiner, room.sendDebitor, room.sendBuilder);
                    }
                }
                break;
            case 5:
                {
                    for(var room in Memory.rooms)
                    {
                       needRepair.check(room);
                    }
                }
                break;
            case 10:
                {
                    for(var room in Memory.rooms)
                    {
                        constructionSites.check(room);
                    }
                }
                break;
            default:
            {
               
                if(tickCounter > 10)
                {
                    tickCounter = 0;
                }
            }
        }
        tickCounter++;
    }
};