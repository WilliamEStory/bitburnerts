import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
    const purcahsedServers = ns.getPurchasedServers();
    for (const server of purcahsedServers) {
        ns.killall(server, true);
        ns.deleteServer(server);
    }
}
