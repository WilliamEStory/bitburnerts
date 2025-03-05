/** @param {NS} ns */
export async function main(ns) {
  const serverToKill = ns.args[0]

  if(!serverToKill) {
    ns.tprint("Did not specify a server to sell!")
  }

  ns.killall(serverToKill, true)
  ns.deleteServer(serverToKill)
}