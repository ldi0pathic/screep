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
        
        if(tick % 2 == 0)
        {
           // spawnControll.clear();
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
        var dayTicks = 86400 / 3;
        let lastProcessedDay = Memory.lastProcessedDay || 0;
        var tick = Game.time;

        if (tick % dayTicks === 0 && tick / dayTicks > lastProcessedDay) 
        {
            memoryControll.FindAndSaveRoomWalls();
            memoryControll.FindAndSaveRoomContainer();
            memoryControll.FindAndSaveRoomTower();

            Memory.lastProcessedDay = tick / dayTicks;
        }
    }
    
}