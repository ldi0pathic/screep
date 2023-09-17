const  spawnController = require('./controller.spawn');
const jobs = {
    debitor: require('./creep.debitor')
}
module.exports.loop = function () {

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