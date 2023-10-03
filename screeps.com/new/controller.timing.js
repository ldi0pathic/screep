const jobs = require('./creep.jobs');
const memoryControll = require('./controller.memory');
const spawnControll = require('./controller.spawn');

let tickCounter = 0;

module.exports = {
    
    controll: function()
    {
        var tick = Game.time;

        if(tick % 3 == 0)
        {
            spawnControll.clear();
        }

        if(tick % 25 == 0)
        {
            spawnControll.spawn();
        }

        if(tick % 33 == 0)
        {
            memoryControll.writeStatus();    
        }
    }
}