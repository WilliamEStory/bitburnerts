/** @param {NS} ns */
export async function main(ns) {
  const serverName = await ns.prompt("enter server name", { type: "text" })

  if (!serverName) {
    ns.alert("server name not specified")
    return
  }

  const serverSize = await ns.prompt("enter server capacity", { type: "select", choices: [16, 32, 64, 128, 256, 512, 1024] })

  const myMoney = ns.getPlayer().money
  const serverCost = ns.getPurchasedServerCost(parseInt(serverSize))

  if (myMoney < serverCost) {
    ns.alert(`cannot purchase a ${serverSize} server, it costs ${serverCost}, current have ${myMoney}`)
    return
  }

  if (ns.getPurchasedServerLimit() === ns.getPurchasedServers()) {
    ns.print("cannot purchase anymore servers")
  }

  const confirmPurchase = await ns.prompt(`Buy server ${serverName} with cost ${serverCost}?`, { type: "boolean" })

  if (confirmPurchase) {
    ns.purchaseServer(serverName, parseInt(serverSize))
  }
}