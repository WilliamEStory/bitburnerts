/** @param {NS} ns */
export async function main(ns) {
  // we're doing some fancy mapping, so overriding ram
  // so dynamic ram allocator doesn't throw a fit
  // This number is above what this script will use, just being safe
  ns.ramOverride(8)

  // atempts to nuke as many servers as it can open
  // scan depth of 1 for right now
  const currentHost = ns.getHostname()
  const purchasedServers = ns.getPurchasedServers()
  const portOpeners = ["relaySMTP.exe", "BruteSSH.exe", "FTPCrack.exe", "HTTPWorm.exe", "SQLInject.exe"].filter((opener) => {
    // check if we have access to exe file to run
    return ns.fileExists(opener, "home")
  }).map((opener) => {
    // build the map of existing exe's for easier reference later
    const funcName = opener.split(".")[0].toLowerCase()
    // store the actual function for easier calling
    return ns[funcName]
  })

  ns.tprint(`Access to these amount of port openers: ${portOpeners.length}`)

  const targetableServers = ns.scan(currentHost).filter((server) => {
    const serverStats = ns.getServer(server)
    if (!purchasedServers.includes(server)) {
      ns.tprint(`checking server for opening ${server}`)
      return serverStats.hasAdminRights && serverStats.numOpenPortsRequired <= portOpeners.length
    }
    return false
  })

  ns.tprint(`targeting servers: ${targetableServers} with current host: ${currentHost}`)


  targetableServers.forEach((server) => {
    const serverInfo = ns.getServer(server)
    ns.tprint(`Opening server: ${server}`)
    for (let i = 0; i <= serverInfo.numOpenPortsRequired; i++) {
      portOpeners[i](server)
    }
    ns.nuke(server)
  })
}