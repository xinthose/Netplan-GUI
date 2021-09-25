export interface eBoxVPNserverBridgeIntf {
  "server_ip": string,
  "server_subnet": string,
  "server_dhcp_range_start": string,
  "server_dhcp_range_end": string,
  "br0_addresses": Array<string>,
  "bridge_index": number,
};
