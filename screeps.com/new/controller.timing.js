const jobs = require('./creep.jobs');
const memoryControll = require('./controller.memory');
const spawnControll = require('./controller.spawn');
const defenceControll = require('./controller.defence')

module.exports = {
    
    controll: function()
    {
        var tick = Game.time;

        memoryControll.init();

        if(tick % 2 == 0)
        {
            spawnControll.clear();
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

        if(tick % 7)
        {
            defenceControll.check();
        }

        if(tick % 11 == 0)
        {
            memoryControll.writeStatus();    
        }

        //11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97
    }
}