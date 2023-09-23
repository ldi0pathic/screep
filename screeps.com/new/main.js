const  spawnController = require('./controller.spawn');
const memoryController = require('./controller.Memory');
const jobs = require('./creep.jobs');

module.exports.loop = function () {

    memoryController.init();
    memoryController.writeStatus();
    spawnController.spawn();
    spawnController.clear();

    for(var name in Game.creeps) 
    {
        var creep = Game.creeps[name];

        if(!creep)
            continue;
        
        jobs[creep.memory.role].doJob(creep);

    }

}