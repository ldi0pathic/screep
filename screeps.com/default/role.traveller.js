var newRoom = require('init.newRoom');
const places = ['E58N6','E58N5','E59N5','E59N6','E59N7','E59N8','E59N9','E59N8','E59N7','E58N7']

var roletraveller = {

    /** @param {Creep} creep **/
    run: function (creep)
    {
        if (creep.memory.target != creep.room.name)
        {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.target), { visualizePathStyle: { stroke: '#ffffff' } });

        } 
        else
        {
           
            newRoom.add(creep.room.name);

            creep.say('📍');
            creep.memory.index = (creep.memory.index + 1) % places.length;
            creep.memory.target = places[creep.memory.index];
        }
    }
};

module.exports = roletraveller;