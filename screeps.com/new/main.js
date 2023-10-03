const  timer = require('./controller.timing');
const jobs = require('./creep.jobs');

module.exports.loop = function () {

    for(var name in Game.creeps) 
    {
        var creep = Game.creeps[name];

        if(!creep)
            continue;
        
        jobs[creep.memory.role].doJob(creep);

    }

    timer.controll();

}