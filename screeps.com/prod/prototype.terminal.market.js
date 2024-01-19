module.exports = function () {

    StructureTerminal.prototype.sell = function(){
        if(this.cooldown > 1)
            return;

        var terminalEnergy = this.store.getUsedCapacity(RESOURCE_ENERGY)

        if(terminalEnergy < 1000 || terminalEnergy >= this.store.getUsedCapacity())
            return;

        for(var resource in this.store)
        {
            if(!global.minSalePrice[resource])
                continue;

            var orders = Game.market.getAllOrders({type: ORDER_BUY, resourceType: resource});

            var marketOrdersWithDistances = orders.filter(o => o.price >= global.minSalePrice[resource])
            .map(order => {
                var distance = this.pos.getRangeTo(new RoomPosition(25, 25, order.roomName));
                return {
                    order,
                    distance
                };
            }).sort((a, b) => a.distance - b.distance);

            var capa = this.store.getUsedCapacity(resource);
            for(let i = 0; i< marketOrdersWithDistances.length; i++) 
            {
                var order = marketOrdersWithDistances[i].order;
                var amount = order.amount > capa ? capa : order.amount;   
                var transferEnergyCost = Game.market.calcTransactionCost( amount, this.room.name, order.roomName);

                var costPerRes = transferEnergyCost / amount;
                if( costPerRes < 0.789)
                {
                    if(transferEnergyCost > terminalEnergy)
                        amount = Math.floor(terminalEnergy * costPerRes);

                    if (OK == Game.market.deal(order.id, amount, this.room.name))
                    {
                        console.log('['+this.room.name+'] '+ resource+' verkauft: ' + amount + ' zu '+order.price);
                        return;
                    } 
                }  
            }
        }
    };
    StructureTerminal.prototype.buy = function(){
        if(this.cooldown > 1)
            return;

        var terminalEnergy = this.store.getUsedCapacity(RESOURCE_ENERGY)

        if(terminalEnergy < 1000 || this.store.getFreeCapacity() <= 1000)
            return;

        for(var resource in global.maxOrderPrice)
        {
            var orders = Game.market.getAllOrders({type: ORDER_SELL, resourceType: resource});

            var marketOrdersWithDistances = orders.filter(o => o.price <= global.maxOrderPrice[resource])
            .sort((a, b) => a.price - b.price);

            for(let i = 0; i< marketOrdersWithDistances.length; i++) 
            {
                var order = marketOrdersWithDistances[i];
                var canBuy = Math.floor(Game.market.credits / order.price);
                var amount = canBuy > order.amount ? order.amount : canBuy;

                if (OK == Game.market.deal(order.id, amount))
                {
                    console.log('['+this.room.name+'] '+ resource+' kauf: ' + amount + ' zu '+order.price);
                    return;
                } 
            }


        }
    }

}

