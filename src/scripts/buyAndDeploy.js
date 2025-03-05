/** @param {NS} ns */
export async function main(ns) {
  // This runs the buy command, then the deploy script
  // so we can automate purchasing a server, then running hacking scripts
  // on it

  const buyPID = ns.run("./buy-server.js")
  while (ns.isRunning(buyPID)) { await ns.sleep(100) }
  const deployPID = ns.run("./deploy.js")
  while (ns.isRunning(deployPID)) { await ns.sleep(100) }
}