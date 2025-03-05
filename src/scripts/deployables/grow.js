/** @param {NS} ns */
export async function main(ns) {
  const target = ns.args[0]
  if(!target) {
    ns.alert("target not specified --target")
    return
  }
  while(true) {
    await ns.grow(target)
  }
}