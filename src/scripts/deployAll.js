// This script will deploy as many servers in a 1:1
// ratio of nuked servers it can via a scan-analyze depth of 1.
// The ratio is 1 nuked server to 1 purchased server
/** @param {NS} ns */
export async function main(ns) {
  const purchasedServers = ns.getPurchasedServers()

  if(purchasedServers <= 0) {
    ns.tprint("No purchased servers, aborting")
    return
  }

  const purchaseLimit = ns.getPurchasedServerLimit() - purchasedServers.length() || 0
  const currentHost = ns.getHostname()
  const targetServers = ns.scan(currentHost).filter((server) => !purchasedServers?.includes(server))

  ns.tprint(`server purchase limit: ${purchaseLimit}`)
  ns.tprint(`targetable servers: ${targetServers}`)
}