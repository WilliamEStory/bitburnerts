/** @param {NS} ns */
export async function main(ns) {
  const target = ns.args[0]
  if(!target) {
    ns.alert("target not specified --target")
    return
  }
  // eslint-disable-next-line no-constant-condition
  while(true) {
    await ns.grow(target)
  }
}