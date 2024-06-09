const jobs = require('./creep.jobs');
const memoryControll = require('./controller.memory');
const spawnControll = require('./controller.spawn');
const defenceControll = require('./controller.defence')

module.exports = {
    
    controll: function()
    {
        var tick = Game.time;

        memoryControll.init();
        defenceControll.tower();



        var t = Game.getObjectById(Memory.terminals[tick % Memory.terminals.length]);
        if(t)
        {
            t.sell();
            t.buy();
        }
       
        if(tick % 3 == 0)
        {
            if(Game.cpu.bucket == 10000) {
                Game.cpu.generatePixel();
            }
        }

        if(tick % 5 == 0)
        {
            spawnControll.spawn();
        }

        if(tick % 7 == 0)
        {
            defenceControll.check();
        }

        if(tick % 11 == 0)
        {
            memoryControll.writeStatus();    
        }

        this.daylie();

        //11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97
    },
    daylie: function()
    {
        const dayTicks = 86400 / 3;
        var tick = Game.time;

        switch(tick % dayTicks)
        {
            case 0: memoryControll.FindAndSaveRoomWalls();      return;
            case 1: memoryControll.FindAndSaveRoomContainer();  return;
            case 2: memoryControll.FindAndSaveRoomTower();      return;
            case 3: memoryControll.FindAndSaveTerminals();      return;
        }
    } 
}