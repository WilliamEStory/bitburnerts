/** @param {NS} ns */
export async function main(ns) {
  // ratio of programs to try out
  const [hacks, weakens, grows] = [1, 4, 6]
  // cost of each script to run
  const [hackCost, weakenCost, growCost] = [1.70, 1.75, 1.75]

  // cost to run all scripts with their given ratios
  const baseCost = hackCost * hacks + weakenCost * weakens + growCost * grows

  const purchasedServers = ns.getPurchasedServers()
  // Only get a list of servers that we can run at least 1 ratio of scripts on
  // Also exclude any of our purchased servers
  const targetServers = ns.scan("home").filter((server) => {
    const serverInfo = ns.getServer(server)
    const serverMoney = ns.getServerMoneyAvailable(server)
    return !purchasedServers.includes(server) && serverMoney >= 0 && serverInfo.hasAdminRights
  })

  const hostServers = purchasedServers.filter((server) => {
    const serverRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server)
    return serverRam > baseCost
  })

  ns.tprint(`targetable servers: ${targetServers}`)
  if (targetServers.length === 0) {
    ns.tprint("No valid target servers")
    return
  }
  ns.tprint(`host servers: ${hostServers}`)

  if (hostServers.length === 0) {
    ns.tprint("No valid host servers")
    return
  }

  const targetSelect = await ns.prompt("Target Server", { type: "select", choices: targetServers })
  const hostServer = await ns.prompt("Host Server", { type: "select", choices: hostServers })

  const target = targetSelect?.split(":")?.[0]

  if (!target) {
    ns.alert("target server not specified")
    return
  }

  if (!hostServer) {
    ns.alert("host name not specified")
  }

  const serverRamAvailable = ns.getServerMaxRam(hostServer) - ns.getServerUsedRam(hostServer)


  if (baseCost > serverRamAvailable) {
    ns.alert(`not enough ram to run scripts! base cost: ${baseCost} avail: ${serverRamAvailable}`)
    return
  }

  // how many multiple threads we can allocate based on ratio above
  const scriptThreadMultiplier = Math.floor(serverRamAvailable / baseCost) || 1

  const run = await ns.prompt(`running scripts with multiplier ${scriptThreadMultiplier}, base cost: ${baseCost}, ram avail: ${serverRamAvailable}`)

  if (!run) {
    ns.tprint("aborting script deploys")
    return
  }

  ns.tprint(`killing all scripts on ${hostServer}`)
  ns.killall(hostServer, true)

  ns.tprint(`Copying scripts to ${hostServer}`)
  const scriptFiles = ns.ls("home", "/megaScripts")
  ns.tprint(`copying files: ${scriptFiles}`)
  const copyStatus = ns.scp(scriptFiles, hostServer, "home")
  
  if (!copyStatus) {
    ns.tprint("did not copy files")
    return;
  }

  ns.tprint(`launching hack script ${scriptThreadMultiplier * hacks} time(s) on ${target} from ${hostServer}`)
  ns.exec("./deployables/hack.js", hostServer, { threads: scriptThreadMultiplier * hacks }, target)

  ns.tprint(`launching weaken script ${scriptThreadMultiplier * weakens} time(s)`)
  ns.exec("./deployables/weaken.js", hostServer, { threads: scriptThreadMultiplier * weakens }, target)

  ns.tprint(`launching grow script ${scriptThreadMultiplier * grows} time(s)`)
  ns.exec("./deployables/grow.js", hostServer, { threads: scriptThreadMultiplier * grows }, target)
}