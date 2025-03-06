// Buys servers with a given ram amount to max amount of money player has
import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
    const player = ns.getPlayer();
    const playerMoney = player.money
    const serverCap = 25
    const moneyPerServer = playerMoney / serverCap

    if (moneyPerServer < 1.0) {
        ns.tprint("not enough money to buy servers")
        ns.exit()
    }

    ns.tprint(`can buy ${serverCap} servers with ${moneyPerServer} money each`)

    // find out how many of servers with ram size X can be bought based on moneyPerServer
    let maxRam = 2;
    let currServerCost = ns.getPurchasedServerCost(maxRam);
    while (ns.getPurchasedServerCost(maxRam * 2) <= moneyPerServer) {
        maxRam *= 2;
        currServerCost = ns.getPurchasedServerCost(maxRam);
        ns.tprint("moneyperserver: ", moneyPerServer, " current cost: ", currServerCost, " ram: ", maxRam)
    }

    const continuePurchase = await ns.prompt(`can buy ${maxRam}GB servers each with ${currServerCost} money each, continue?`, { type: "boolean"})
    if(!continuePurchase) {
        ns.tprint("exiting script")
        ns.exit()
    }
    for(let i = 0; i < serverCap; i++) {
        ns.purchaseServer(`server-${i}`, maxRam);
    }
}
