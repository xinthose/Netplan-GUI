var app,
  ROOTURL = "";
var screen_popup, screen_popup_short, screen_popup_no_hide;
/******* Popups, Windows, & Dialogs *******/
var dialog_reboot, dialog_submit_network, dialog_submit_wifi_broadcast;
var br0_addresses_id = 0,
  eth1_addresses_id = 0,
  eth2_addresses_id = 0,
  wifi_addresses_id = 0;

/******************************** Configuration ***********************************/
var app_version = "Version: 1.21";
var URL_PORT = ":8080";
var app_testing = false;
/******************************** Setup ***********************************/
if (app_testing) ROOTURL = "http://10.0.0.2";
else ROOTURL = "http://" + window.location.hostname; // #.#.#.#
var URL = ROOTURL + URL_PORT;

/******************************** Main Code ***********************************/

window.APP = {
  models: {
    home_screen: kendo.observable({
      // Bridge 0
      br0_enabled: false,
      br0_gateway: "",
      br0_nameserver0: "",
      br0_nameserver1: "",
      // Ethernet Port 1
      eth1_enabled: false,
      eth1_gateway: "",
      eth1_nameserver0: "",
      eth1_nameserver1: "",
      // Ethernet Port 2
      eth2_enabled: false,
      eth2_gateway: "",
      eth2_nameserver0: "",
      eth2_nameserver1: "",
      // WiFi
      wifi_enabled: false,
      wifi_gateway: "",
      wifi_nameserver0: "",
      wifi_nameserver1: "",
      wifi_ssid: "",
      wifi_ssid_password: "",
      contr_ip_addr: "",
      reader_ip_addr: "",
      // VPN server bridge
      server_bridge_network_index: null,
      server_bridge_network_ds: new kendo.data.DataSource(),
      server_bridge_dhcp_range_start: "",
      server_bridge_dhcp_range_end: "",
      // Broadcast WiFi
      wifi_broadcast_enabled: false,
      wifi_broadcast_name: "",
      wifi_broadcast_password: "",
      wifi_broadcast_type: null,
      wifi_broadcast_ap_gateway: "",
      wifi_broadcast_broadcast_type_index: null,
      wifi_broadcast_ap_gateway_enabled: false,
      app_version: app_version,
      // data
      subnet_mask_cidr: subnet_mask_cidr_arr,
      // change
      panelbar_select: function panelbar_select(e) {
        try {
          var debug = false;
          var loc = "home_screen >> panelbar_select >> ";

          // 1. get data
          var panel_num = $(e.item)
            .find(".panelbar_panel:first")
            .attr("data-id");
          panel_num = Number(panel_num);

          // 2. handle data
          switch (panel_num) {
            case 1: { // Station Network
              APP.models.home_screen.get_current_network_values();
              break;
            }
            case 2: { // VPN Server Bridge
              APP.models.home_screen.get_vpn_server_bridge_values();
              break;
            }
            case 3: { // Station WiFi
              APP.models.home_screen.get_current_wifi_values();
              var validator = $("#home_screen_wifi_panel").data(
                "kendoValidator"
              );
              validator.hideMessages();
              break;
            }
            case 4: { // Commands
              break;
            }
            case 5: { // Alarm History
              // Station WiFi
              APP.models.home_screen.get_alarm_history();
              break;
            }
            case 6: { // File Server
              break;
            }
            case 7: { // Information
              break;
            }
            default: {
              console.error(
                loc +
                "panel_num unhandled >> panel_num = " +
                panel_num.toString()
              );
              screen_popup.error("Internal Error.  Please see help.");
              break;
            }
          }
        } catch (e) {
          console.error(arguments.callee.name + " >> ERROR >> " + e.toString());
          screen_popup.error("Internal Error.  Please see help.");
        }
      },
      br0_enabled_change: function (e) {
        try {
          var debug = false;
          var loc = "home_screen >> br0_enabled_change >> ";

          // set data
          this.set("br0_enabled", e.checked);

          // handle data
          if (e.checked) {
            this.set("eth1_enabled", false);
            this.set("eth1_gateway", "");
            this.set("eth1_nameserver0", "");
            this.set("eth1_nameserver1", "");

            this.set("eth2_enabled", false);
            this.set("eth2_gateway", "");
            this.set("eth2_nameserver0", "");
            this.set("eth2_nameserver1", "");
          } else {
            this.set("br0_gateway", "");
            this.set("br0_nameserver0", "");
            this.set("br0_nameserver1", "");
            var br0_grid = $("#br0_addresses").data("kendoGrid");
            br0_grid.dataSource.data([]);
          }

          // hide validator messages
          var validator = $("#home_screen_network_panel").data(
            "kendoValidator"
          );
          validator.hideMessages();
        } catch (e) {
          console.error(arguments.callee.name + " >> ERROR >> " + e.toString());
          screen_popup.error("Internal Error.  Please see help.");
        }
      },
      wifi_enabled_change: function (e) {
        try {
          var debug = false;
          var loc = "home_screen >> wifi_enabled_change >> ";

          // set data
          this.set("wifi_enabled", e.checked);

          // handle data
          if (e.checked) {
            var data = $("#wifi_addresses").data().kendoGrid.dataSource.view()
            if (debug) {
              console.debug(loc + "wifi_addresses >> data = " + JSON.stringify(data));
            }
          } else {
            this.set("wifi_gateway", "");
            this.set("wifi_nameserver0", "");
            this.set("wifi_nameserver1", "");
            this.set("wifi_ssid", "");
            this.set("wifi_ssid_password", "");
            var wifi_grid = $("#wifi_addresses").data("kendoGrid");
            wifi_grid.dataSource.data([]);
          }

          // hide validator messages
          var validator = $("#home_screen_network_panel").data(
            "kendoValidator"
          );
          validator.hideMessages();
        } catch (e) {
          console.error(arguments.callee.name + " >> ERROR >> " + e.toString());
          screen_popup.error("Internal Error.  Please see help.");
        }
      },
      eth1_enabled_change: function (e) {
        try {
          var debug = false;
          var loc = "home_screen >> eth1_enabled_change >> ";

          // set data
          this.set("eth1_enabled", e.checked);

          // handle data
          if (e.checked) {
            this.set("br0_enabled", false);
            this.set("br0_gateway", "");
            this.set("br0_nameserver0", "");
            this.set("br0_nameserver1", "");
          } else {
            this.set("eth1_gateway", "");
            this.set("eth1_nameserver0", "");
            this.set("eth1_nameserver1", "");
            var eth1_grid = $("#eth1_addresses").data("kendoGrid");
            eth1_grid.dataSource.data([]);
          }

          // hide validator messages
          var validator = $("#home_screen_network_panel").data(
            "kendoValidator"
          );
          validator.hideMessages();
        } catch (e) {
          console.error(arguments.callee.name + " >> ERROR >> " + e.toString());
          screen_popup.error("Internal Error.  Please see help.");
        }
      },
      eth2_enabled_change: function (e) {
        try {
          var debug = false;
          var loc = "home_screen >> eth2_enabled_change >> ";

          // set data
          this.set("eth2_enabled", e.checked);

          // handle data
          if (e.checked) {
            this.set("br0_enabled", false);
            this.set("br0_gateway", "");
            this.set("br0_nameserver0", "");
            this.set("br0_nameserver1", "");
          } else {
            this.set("eth2_gateway", "");
            this.set("eth2_nameserver0", "");
            this.set("eth2_nameserver1", "");
            var eth2_grid = $("#eth2_addresses").data("kendoGrid");
            eth2_grid.dataSource.data([]);
          }

          // hide validator messages
          var validator = $("#home_screen_network_panel").data(
            "kendoValidator"
          );
          validator.hideMessages();
        } catch (e) {
          console.error(arguments.callee.name + " >> ERROR >> " + e.toString());
          screen_popup.error("Internal Error.  Please see help.");
        }
      },
      // Network
      submit_network_validate: function submit_network_validate() {
        try {
          var loc = "home_screen >> submit_network_validate >> ";

          // get data
          var br0_enabled = this.get("br0_enabled");
          var eth1_enabled = this.get("eth1_enabled");
          var eth2_enabled = this.get("eth2_enabled");
          var wifi_enabled = this.get("wifi_enabled");

          var br0_gateway = this.get("br0_gateway");
          var eth1_gateway = this.get("eth1_gateway");
          var eth2_gateway = this.get("eth2_gateway");
          var wifi_gateway = this.get("wifi_gateway");

          var br0_addresses_ds = $("#br0_addresses").data("kendoGrid").dataSource;
          var eth1_addresses_ds = $("#eth1_addresses").data("kendoGrid").dataSource;
          var eth2_addresses_ds = $("#eth2_addresses").data("kendoGrid").dataSource;
          var wifi_addresses_ds = $("#wifi_addresses").data("kendoGrid").dataSource;

          // validate data
          var validator = $("#home_screen_network_panel").data(
            "kendoValidator"
          );
          if (!validator.validate()) {
            console.warn(loc + "validation failed");
            return;
          }

          if (br0_enabled && !br0_addresses_ds.total()) {
            console.warn(loc + "br0 grid has no rows");
            screen_popup.warning("Please enter an address for Bridge 0.");
            return;
          } else if (eth1_enabled && !eth1_addresses_ds.total()) {
            console.warn(loc + "eth1 grid has no rows");
            screen_popup.warning("Please enter an address for Ethernet Port 1.");
            return;
          } else if (eth2_enabled && !eth2_addresses_ds.total()) {
            console.warn(loc + "eth2 grid has no rows");
            screen_popup.warning("Please enter an address for Ethernet Port 2.");
            return;
          } else if (wifi_enabled && !wifi_addresses_ds.total()) {
            console.warn(loc + "wifi is enabled and grid has no rows");
            screen_popup.warning("Please enter an address for Wi-Fi.");
            return;
          }

          var gateway_arr = [br0_gateway, eth1_gateway, eth2_gateway, wifi_gateway];
          var gateway_arr_not_blank = gateway_arr.filter(str => str.trim().length > 0);
          if (gateway_arr_not_blank.length > 1) {
            console.warn(loc + "more than one gateway detected");
            screen_popup.warning("Only one Gateway is allowed.");
            return;
          }

          // open confirmation
          dialog_submit_network.open();
        } catch (e) {
          console.error(arguments.callee.name + " >> ERROR >> " + e.toString());
          screen_popup.error("Internal Error.  Please see help.");
        }
      },
      submit_network: function submit_network() {
        try {
          var debug = false;
          var loc = "home_screen >> submit_network >> ";

          /****************************************** Get Data ******************************************/

          // br0
          var br0_enabled = this.get("br0_enabled");
          var br0_gateway = this.get("br0_gateway");
          var br0_nameserver0 = this.get("br0_nameserver0");
          var br0_nameserver1 = this.get("br0_nameserver1");

          // eth1
          var eth1_enabled = this.get("eth1_enabled");
          var eth1_gateway = this.get("eth1_gateway");
          var eth1_nameserver0 = this.get("eth1_nameserver0");
          var eth1_nameserver1 = this.get("eth1_nameserver1");

          // eth2
          var eth2_enabled = this.get("eth2_enabled");
          var eth2_gateway = this.get("eth2_gateway");
          var eth2_nameserver0 = this.get("eth2_nameserver0");
          var eth2_nameserver1 = this.get("eth2_nameserver1");

          // wifi
          var wifi_enabled = this.get("wifi_enabled");
          var wifi_gateway = this.get("wifi_gateway");
          var wifi_nameserver0 = this.get("wifi_nameserver0");
          var wifi_nameserver1 = this.get("wifi_nameserver1");
          var wifi_ssid = this.get("wifi_ssid");
          var wifi_ssid_password = this.get("wifi_ssid_password");

          // general
          var contr_ip_addr = this.get("contr_ip_addr");
          var reader_ip_addr = this.get("reader_ip_addr");

          // addresses
          var br0_addresses_ds_view = $("#br0_addresses").data().kendoGrid.dataSource.view();
          var eth1_addresses_ds_view = $("#eth1_addresses").data().kendoGrid.dataSource.view();
          var eth2_addresses_ds_view = $("#eth2_addresses").data().kendoGrid.dataSource.view();
          var wifi_addresses_ds_view = $("#wifi_addresses").data().kendoGrid.dataSource.view();

          /****************************************** Build Addresses ******************************************/

          // br0
          var br0_addresses = [];
          for (var i = 0; i < br0_addresses_ds_view.length; i++) {
            br0_addresses.push(br0_addresses_ds_view[i].address + "/" + br0_addresses_ds_view[i].cidr);
          }

          // eth1
          var eth1_addresses = [];
          for (var i = 0; i < eth1_addresses_ds_view.length; i++) {
            eth1_addresses.push(eth1_addresses_ds_view[i].address + "/" + eth1_addresses_ds_view[i].cidr);
          }

          // eth2
          var eth2_addresses = [];
          for (var i = 0; i < eth2_addresses_ds_view.length; i++) {
            eth2_addresses.push(eth2_addresses_ds_view[i].address + "/" + eth2_addresses_ds_view[i].cidr);
          }

          // wifi
          var wifi_addresses = [];
          for (var i = 0; i < wifi_addresses_ds_view.length; i++) {
            wifi_addresses.push(wifi_addresses_ds_view[i].address + "/" + wifi_addresses_ds_view[i].cidr);
          }

          /****************************************** Build Nameservers ******************************************/

          // br0
          var br0_nameservers = [];
          if (br0_nameserver0) {
            br0_nameservers.push(br0_nameserver0);
          }
          if (br0_nameserver1) {
            br0_nameservers.push(br0_nameserver1);
          }

          // eth1
          var eth1_nameservers = [];
          if (eth1_nameserver0) {
            eth1_nameservers.push(eth1_nameserver0);
          }
          if (eth1_nameserver1) {
            eth1_nameservers.push(eth1_nameserver1);
          }

          // eth2
          var eth2_nameservers = [];
          if (eth2_nameserver0) {
            eth2_nameservers.push(eth2_nameserver0);
          }
          if (eth2_nameserver1) {
            eth2_nameservers.push(eth2_nameserver1);
          }

          // wifi
          var wifi_nameservers = [];
          if (wifi_nameserver0) {
            wifi_nameservers.push(wifi_nameserver0);
          }
          if (wifi_nameserver1) {
            wifi_nameservers.push(wifi_nameserver1);
          }

          /****************************************** Send Data ******************************************/

          var send_obj = {
            br0_enabled: br0_enabled,
            br0_addresses: br0_addresses,
            br0_gateway: br0_gateway,
            br0_nameservers: br0_nameservers,
            eth1_enabled: eth1_enabled,
            eth1_addresses: eth1_addresses,
            eth1_gateway: eth1_gateway,
            eth1_nameservers: eth1_nameservers,
            eth2_enabled: eth2_enabled,
            eth2_addresses: eth2_addresses,
            eth2_gateway: eth2_gateway,
            eth2_nameservers: eth2_nameservers,
            wifi_enabled: wifi_enabled,
            wifi_addresses: wifi_addresses,
            wifi_gateway: wifi_gateway,
            wifi_nameservers: wifi_nameservers,
            wifi_ssid: wifi_ssid,
            wifi_ssid_password: wifi_ssid_password,
            contr_ip_addr: contr_ip_addr,
            reader_ip_addr: reader_ip_addr,
          };
          var url = URL + "/change_interfaces1/" + JSON.stringify(send_obj);
          $.getJSON(url, function (data) {
            try {
              if (debug)
                console.log(loc + "SUCCESS >> " + JSON.stringify(data));

              screen_popup_no_hide.success(
                "Success.  Please wait for the changes to take effect. Reload this page at the new IP Address if changed."
              );
            } catch (e) {
              console.error(loc + "ERROR >> " + e.toString());
              screen_popup.error("Internal Error.  Please see help.");
            }
          });
        } catch (e) {
          console.error(arguments.callee.name + " >> ERROR >> " + e.toString());
          screen_popup.error("Internal Error.  Please see help.");
        }
      },
      get_current_network_values: function get_current_network_values() {
        try {
          var debug = false;
          var loc = "home_screen >> get_current_network_values >> ";

          var url = URL + "/get_interfaces1";
          if (debug) console.log(loc + "url = " + url);
          $.getJSON(url, function (data) {
            try {
              if (debug)
                console.debug(loc + "SUCCESS >> " + JSON.stringify(data));

              /*********************************************** Get Data ***********************************************/

              var br0_addresses = data.br0_addresses;
              var br0_gateway = data.br0_gateway;
              var br0_nameservers = data.br0_nameservers;
              var eth1_addresses = data.eth1_addresses;
              var eth1_gateway = data.eth1_gateway;
              var eth1_nameservers = data.eth1_nameservers;
              var eth2_addresses = data.eth2_addresses;
              var eth2_gateway = data.eth2_gateway;
              var eth2_nameservers = data.eth2_nameservers;
              var wifi_addresses = data.wifi_addresses;
              var wifi_gateway = data.wifi_gateway;
              var wifi_nameservers = data.wifi_nameservers;
              var wifi_ssid = data.wifi_ssid;
              var wifi_ssid_password = data.wifi_ssid_password;
              var contr_ip_addr = data.contr_ip_addr;
              var reader_ip_addr = data.reader_ip_addr;

              // get enabled
              var br0_enabled = false;
              var eth1_enabled = false;
              var eth2_enabled = false;
              var wifi_enabled = false;
              if (br0_addresses) {
                br0_enabled = true;
              }
              if (eth1_addresses) {
                eth1_enabled = true;
              }
              if (eth2_addresses) {
                eth2_enabled = true;
              }
              if (wifi_addresses) {
                wifi_enabled = true;
              }

              /****************** Get Nameservers ******************/

              // br0
              var br0_nameserver0 = "";
              var br0_nameserver1 = "";
              if (br0_nameservers) {
                if (br0_nameservers[0]) {
                  br0_nameserver0 = br0_nameservers[0];
                }
                if (br0_nameservers[1]) {
                  br0_nameserver1 = br0_nameservers[1];
                }
              }

              // eth1
              var eth1_nameserver0 = "";
              var eth1_nameserver1 = "";
              if (eth1_nameservers) {
                if (eth1_nameservers[0]) {
                  eth1_nameserver0 = eth1_nameservers[0];
                }
                if (eth1_nameservers[1]) {
                  eth1_nameserver1 = eth1_nameservers[1];
                }
              }

              // eth2
              var eth2_nameserver0 = "";
              var eth2_nameserver1 = "";
              if (eth2_nameservers) {
                if (eth2_nameservers[0]) {
                  eth2_nameserver0 = eth2_nameservers[0];
                }
                if (eth2_nameservers[1]) {
                  eth2_nameserver1 = eth2_nameservers[1];
                }
              }

              // wifi
              var wifi_nameserver0 = "";
              var wifi_nameserver1 = "";
              if (wifi_nameservers) {
                if (wifi_nameservers[0]) {
                  wifi_nameserver0 = wifi_nameservers[0];
                }
                if (wifi_nameservers[1]) {
                  wifi_nameserver1 = wifi_nameservers[1];
                }
              }

              /*********************************************** Create Addresses DataSources ***********************************************/

              // br0
              var br0_addresses_ds = new kendo.data.DataSource({
                autoSync: true,
                transport: {
                  create: function (e) {
                    e.data.Id = br0_addresses_id++;
                    e.data.cidr = 24; // default
                    e.success(e.data);
                  },
                  read: function (e) {
                    e.success(e.data);
                  },
                  update: function (e) {
                    if (e.data.models) {
                      //batch editing
                      e.success(e.data.models);
                    } else {
                      e.success(e.data);
                    }
                  },
                  destroy: function (e) {
                    if (e.data.models) {
                      //batch editing
                      e.success(e.data.models);
                    } else {
                      e.success(e.data);
                    }
                  }
                },
                schema: {
                  model: {
                    id: "Id",
                    fields: {
                      Id: {
                        type: "number",
                        editable: false,
                        nullable: false,
                      },
                      address: {
                        type: "string",
                        editable: true,
                        validation: {
                          required: true,
                          checkIP: function (input) {
                            if (input.is("[name='address']") && input.val()) {
                              input.attr("data-checkIP-msg", "IP Address format is incorrect");
                              return validate_ip_address(input.val());
                            }
                            return true;
                          }
                        }
                      },
                      cidr: {
                        type: "number",
                        editable: true,
                        validation: {
                          required: true
                        },
                      },
                    }
                  }
                },
                sort: {
                  field: "address",
                  dir: "asc"
                },
              });
              br0_addresses_id = br0_addresses.length;
              for (var i = 0; i < br0_addresses.length; i++) {
                var addr_ar = br0_addresses[i].split("/");
                var address = addr_ar[0];
                var cidr = Number(addr_ar[1]);
                br0_addresses_ds.insert({
                  Id: i,
                  address: address,
                  cidr: cidr,
                });
              }
              br0_addresses_ds.sync();

              // eth1
              var eth1_addresses_ds = new kendo.data.DataSource({
                autoSync: true,
                transport: {
                  create: function (e) {
                    e.data.Id = eth1_addresses_id++;
                    e.data.cidr = 24; // default
                    e.success(e.data);
                  },
                  read: function (e) {
                    e.success(e.data);
                  },
                  update: function (e) {
                    if (e.data.models) {
                      //batch editing
                      e.success(e.data.models);
                    } else {
                      e.success(e.data);
                    }
                  },
                  destroy: function (e) {
                    if (e.data.models) {
                      //batch editing
                      e.success(e.data.models);
                    } else {
                      e.success(e.data);
                    }
                  }
                },
                schema: {
                  model: {
                    id: "Id",
                    fields: {
                      Id: {
                        type: "number",
                        editable: false,
                        nullable: false,
                      },
                      address: {
                        type: "string",
                        editable: true,
                        validation: {
                          required: true,
                          checkIP: function (input) {
                            if (input.is("[name='address']") && input.val()) {
                              input.attr("data-checkIP-msg", "IP Address format is incorrect");
                              return validate_ip_address(input.val());
                            }
                            return true;
                          }
                        }
                      },
                      cidr: {
                        type: "number",
                        editable: true,
                        validation: {
                          required: true
                        },
                      },
                    }
                  }
                },
                sort: {
                  field: "address",
                  dir: "asc"
                },
              });
              eth1_addresses_id = eth1_addresses.length;
              for (var i = 0; i < eth1_addresses.length; i++) {
                var addr_ar = eth1_addresses[i].split("/");
                var address = addr_ar[0];
                var cidr = Number(addr_ar[1]);
                eth1_addresses_ds.insert({
                  Id: i,
                  address: address,
                  cidr: cidr,
                });
              }
              eth1_addresses_ds.sync();

              // eth2
              var eth2_addresses_ds = new kendo.data.DataSource({
                autoSync: true,
                transport: {
                  create: function (e) {
                    e.data.Id = eth2_addresses_id++;
                    e.data.cidr = 24; // default
                    e.success(e.data);
                  },
                  read: function (e) {
                    e.success(e.data);
                  },
                  update: function (e) {
                    if (e.data.models) {
                      //batch editing
                      e.success(e.data.models);
                    } else {
                      e.success(e.data);
                    }
                  },
                  destroy: function (e) {
                    if (e.data.models) {
                      //batch editing
                      e.success(e.data.models);
                    } else {
                      e.success(e.data);
                    }
                  }
                },
                schema: {
                  model: {
                    id: "Id",
                    fields: {
                      Id: {
                        type: "number",
                        editable: false,
                        nullable: false,
                      },
                      address: {
                        type: "string",
                        editable: true,
                        validation: {
                          required: true,
                          checkIP: function (input) {
                            if (input.is("[name='address']") && input.val()) {
                              input.attr("data-checkIP-msg", "IP Address format is incorrect");
                              return validate_ip_address(input.val());
                            }
                            return true;
                          }
                        }
                      },
                      cidr: {
                        type: "number",
                        editable: true,
                        validation: {
                          required: true
                        },
                      },
                    }
                  }
                },
                sort: {
                  field: "address",
                  dir: "asc"
                },
              });
              eth2_addresses_id = eth2_addresses.length;
              for (var i = 0; i < eth2_addresses.length; i++) {
                var addr_ar = eth2_addresses[i].split("/");
                var address = addr_ar[0];
                var cidr = Number(addr_ar[1]);
                eth2_addresses_ds.insert({
                  Id: i,
                  address: address,
                  cidr: cidr,
                });
              }
              eth2_addresses_ds.sync();

              // wifi
              var wifi_addresses_ds = new kendo.data.DataSource({
                autoSync: true,
                transport: {
                  create: function (e) {
                    e.data.Id = wifi_addresses_id++;
                    e.data.cidr = 24; // default
                    e.success(e.data);
                  },
                  read: function (e) {
                    e.success(e.data);
                  },
                  update: function (e) {
                    if (e.data.models) {
                      //batch editing
                      e.success(e.data.models);
                    } else {
                      e.success(e.data);
                    }
                  },
                  destroy: function (e) {
                    if (e.data.models) {
                      //batch editing
                      e.success(e.data.models);
                    } else {
                      e.success(e.data);
                    }
                  }
                },
                schema: {
                  model: {
                    id: "Id",
                    fields: {
                      Id: {
                        type: "number",
                        editable: false,
                        nullable: false,
                      },
                      address: {
                        type: "string",
                        editable: true,
                        nullable: false,
                        validation: {
                          required: true,
                          checkIP: function (input) {
                            if (input.is("[name='address']") && input.val()) {
                              input.attr("data-checkIP-msg", "IP Address format is incorrect");
                              return validate_ip_address(input.val());
                            }
                            return true;
                          }
                        }
                      },
                      cidr: {
                        type: "number",
                        editable: true,
                        nullable: false,
                        validation: {
                          required: true
                        },
                      },
                    }
                  }
                },
                sort: {
                  field: "address",
                  dir: "asc"
                },
              });
              wifi_addresses_id = wifi_addresses.length;
              for (var i = 0; i < wifi_addresses.length; i++) {
                var addr_ar = wifi_addresses[i].split("/");
                var address = addr_ar[0];
                var cidr = Number(addr_ar[1]);
                wifi_addresses_ds.insert({
                  Id: i,
                  address: address,
                  cidr: cidr,
                });
              }
              wifi_addresses_ds.sync();

              /*********************************************** Set Model Data ***********************************************/

              // br0
              APP.models.home_screen.set("br0_enabled", br0_enabled);
              APP.models.home_screen.set("br0_gateway", br0_gateway);
              APP.models.home_screen.set("br0_nameserver0", br0_nameserver0);
              APP.models.home_screen.set("br0_nameserver1", br0_nameserver1);

              // eth1
              APP.models.home_screen.set("eth1_enabled", eth1_enabled);
              APP.models.home_screen.set("eth1_gateway", eth1_gateway);
              APP.models.home_screen.set("eth1_nameserver0", eth1_nameserver0);
              APP.models.home_screen.set("eth1_nameserver1", eth1_nameserver1);

              // eth2
              APP.models.home_screen.set("eth2_enabled", eth2_enabled);
              APP.models.home_screen.set("eth2_gateway", eth2_gateway);
              APP.models.home_screen.set("eth2_nameserver0", eth2_nameserver0);
              APP.models.home_screen.set("eth2_nameserver1", eth2_nameserver1);

              // wifi
              APP.models.home_screen.set("wifi_enabled", wifi_enabled);
              APP.models.home_screen.set("wifi_gateway", wifi_gateway);
              APP.models.home_screen.set("wifi_nameserver0", wifi_nameserver0);
              APP.models.home_screen.set("wifi_nameserver1", wifi_nameserver1);
              APP.models.home_screen.set("wifi_ssid", wifi_ssid);
              APP.models.home_screen.set("wifi_ssid_password", wifi_ssid_password);

              // general
              APP.models.home_screen.set("contr_ip_addr", contr_ip_addr);
              APP.models.home_screen.set("reader_ip_addr", reader_ip_addr);

              /*********************************************** Set Grid Data ***********************************************/

              // br0 
              var br0_grid = $("#br0_addresses").data("kendoGrid");
              br0_grid.setDataSource(br0_addresses_ds);
              if (!br0_addresses_id) {
                br0_grid.dataSource.data([]);
              }

              // eth1
              var eth1_grid = $("#eth1_addresses").data("kendoGrid");
              eth1_grid.setDataSource(eth1_addresses_ds);
              if (!eth1_addresses_id) {
                eth1_grid.dataSource.data([]);
              }

              // eth2
              var eth2_grid = $("#eth2_addresses").data("kendoGrid");
              eth2_grid.setDataSource(eth2_addresses_ds);
              if (!eth2_addresses_id) {
                eth2_grid.dataSource.data([]);
              }

              // wifi
              var wifi_grid = $("#wifi_addresses").data("kendoGrid");
              wifi_grid.setDataSource(wifi_addresses_ds);
              if (!wifi_addresses_id) {
                wifi_grid.dataSource.data([]);
              }

              /*********************************************** Finish ***********************************************/

              // hide error messages
              var validator = $("#home_screen_network_panel").data(
                "kendoValidator"
              );
              validator.hideMessages();

              // show popup
              screen_popup_short.success("Refresh Successful");
            } catch (e) {
              console.error(loc + "ERROR >> " + e.toString());
              screen_popup.error("Internal Error.  Please see help.");
            }
          });
        } catch (e) {
          console.error(arguments.callee.name + " >> ERROR >> " + e.toString());
          screen_popup.error("Internal Error.  Please see help.");
        }
      },
      // VPN Server Bridge
      get_vpn_server_bridge_values: function get_vpn_server_bridge_values() {
        try {
          var debug = false;
          var loc = "home_screen >> get_vpn_server_bridge_values >> ";

          // get data
          var url = URL + "/get_vpn_server_bridge";
          if (debug) console.log(loc + "url = " + url);
          $.getJSON(url, function (data) {
            try {
              if (debug) {
                console.log(loc + "SUCCESS >> " + JSON.stringify(data));
              }

              // get data
              var br0_addresses = data["br0_addresses"];
              var server_dhcp_range_start = data["server_dhcp_range_start"];
              var server_dhcp_range_end = data["server_dhcp_range_end"];
              var bridge_index = data["bridge_index"];
              var server_ip = data["server_ip"];
              var server_subnet = data["server_subnet"];

              // create dropdownlist dataSource
              var server_bridge_network_ds = new kendo.data.DataSource({})
              for (let index = 0; index < br0_addresses.length; index++) {
                const addr = br0_addresses[index];
                server_bridge_network_ds.add({
                  "network": addr,
                  "index": index,
                })
              }

              // set data
              APP.models.home_screen.set("server_bridge_network_index", bridge_index);
              APP.models.home_screen.set("server_bridge_network_ds", server_bridge_network_ds);
              APP.models.home_screen.set("server_bridge_dhcp_range_start", server_dhcp_range_start);
              APP.models.home_screen.set("server_bridge_dhcp_range_end", server_dhcp_range_end);

              // select correct value on dropdownlist
              var dropdownlist = $("#home_screen_server_bridge_network").data("kendoDropDownList");
              dropdownlist.select(bridge_index);

              // hide validation messages
              var validator = $("#home_screen_vpn_server_panel").data(
                "kendoValidator"
              );
              validator.hideMessages();

              screen_popup_short.success("Refresh Successful");
            } catch (e) {
              console.error(loc + "ERROR >> " + e.toString());
              screen_popup.error("Internal Error.  Please see help.");
            }
          });
        } catch (e) {
          console.error(arguments.callee.name + " >> ERROR >> " + e.toString());
          screen_popup.error("Internal Error.  Please see help.");
        }
      },
      submit_vpn_server_bridge: function submit_vpn_server_bridge() {
        try {
          var debug = false;
          var loc = "home_screen >> submit_vpn_server_bridge >> ";

          // validate data
          var validator = $("#home_screen_vpn_server_panel").data("kendoValidator");
          var dropdownlist = $("#home_screen_server_bridge_network").data("kendoDropDownList");
          var dataItem = dropdownlist.dataItem();
          if (!validator.validate()) {
            console.warn(loc + "validation failed");
            return;
          } else if (!dataItem) {
            screen_popup.warning("Server Bridge Network is required");
            return;
          }

          // get data
          var subnet_mask_cidr = this.get("subnet_mask_cidr");
          var server_bridge_dhcp_range_start = this.get("server_bridge_dhcp_range_start");
          var server_bridge_dhcp_range_end = this.get("server_bridge_dhcp_range_end");
          if (debug) {
            console.log(loc + "dropdownlist >> dataItem = " + JSON.stringify(dataItem));
          }
          var network = dataItem.network;
          var network_arr = network.split("/");
          var network_ip = network_arr[0];
          var network_cidr = network_arr[1];
          var network_subnet = "";
          for (let index = 0; index < subnet_mask_cidr.length; index++) {
            const element = subnet_mask_cidr[index];
            const cidr = element.cidr;
            if (cidr == network_cidr) {
              network_subnet = element.subnet_mask;
              break;
            }
          }

          // make server-bridge configuration
          var update_line = "server-bridge " + network_ip + " " + network_subnet + " " + server_bridge_dhcp_range_start + " " + server_bridge_dhcp_range_end;
          if (debug) {
            console.debug(loc + "update_line = " + update_line);
          }

          // send data
          var send_obj = {
            "update_line": update_line,
          };
          var url = URL + "/update_vpn_server_bridge/" + JSON.stringify(send_obj);
          if (debug) console.debug(loc + "url = " + url);
          $.getJSON(url, function (data) {
            try {
              if (debug) {
                console.log(loc + "SUCCESS >> " + JSON.stringify(data));
              }

              screen_popup.success("Settings saved.  VPN service restarting.");
            } catch (e) {
              console.error(loc + "ERROR >> " + e.toString());
              screen_popup.error("Internal Error.  Please see help.");
            }
          });
        } catch (e) {
          console.error(arguments.callee.name + " >> ERROR >> " + e.toString());
          screen_popup.error("Internal Error.  Please see help.");
        }
      },
      // Station Wi-Fi
      submit_wifi_broadcast_validate: function submit_wifi_broadcast_validate() {
        try {
          var debug = false;
          var loc = "home_screen >> submit_wifi_broadcast >> ";

          // 1. validate data
          var validator = $("#home_screen_wifi_panel").data("kendoValidator");
          if (!validator.validate()) {
            console.warn(loc + "validation failed");
            return;
          }

          // 2. open dialog
          dialog_submit_wifi_broadcast.open();
        } catch (e) {
          console.error(arguments.callee.name + " >> ERROR >> " + e.toString());
          screen_popup.error("Internal Error.  Please see help.");
        }
      },
      submit_wifi_broadcast: function submit_wifi_broadcast() {
        try {
          var debug = false;
          var loc = "home_screen >> submit_wifi_broadcast >> ";

          // get data
          var wifi_broadcast_enabled = this.get("wifi_broadcast_enabled");
          var wifi_broadcast_name = this.get("wifi_broadcast_name");
          var wifi_broadcast_password = this.get("wifi_broadcast_password");
          var wifi_broadcast_type = this.get("wifi_broadcast_type");
          var wifi_broadcast_ap_gateway = this.get("wifi_broadcast_ap_gateway");

          // set variable
          if (wifi_broadcast_enabled === true) {
            wifi_broadcast_enabled = 1;
          } else if (wifi_broadcast_enabled === false) {
            wifi_broadcast_enabled = 0;
          }

          // send data
          var send_obj = {
            wifi_broadcast_enabled: wifi_broadcast_enabled,
            wifi_broadcast_name: wifi_broadcast_name,
            wifi_broadcast_password: wifi_broadcast_password,
            wifi_broadcast_type: wifi_broadcast_type,
            wifi_broadcast_ap_gateway: wifi_broadcast_ap_gateway
          };
          var url = URL + "/update_station_wifi/" + JSON.stringify(send_obj);
          if (debug) console.debug(loc + "url = " + url);
          $.getJSON(url, function (data) {
            try {
              if (debug)
                console.log(loc + "SUCCESS >> " + JSON.stringify(data));

              screen_popup.success("Station is rebooting.  Please wait...");
            } catch (e) {
              console.error(loc + "ERROR >> " + e.toString());
              screen_popup.error("Internal Error.  Please see help.");
            }
          });
        } catch (e) {
          console.error(arguments.callee.name + " >> ERROR >> " + e.toString());
          screen_popup.error("Internal Error.  Please see help.");
        }
      },
      get_current_wifi_values: function get_current_wifi_values() {
        try {
          var debug = false;
          var loc = "home_screen >> get_current_wifi_values >> ";

          var url = URL + "/get_station_wifi";
          if (debug) console.log(loc + "url = " + url);
          $.getJSON(url, function (data) {
            try {
              if (debug)
                console.log(loc + "SUCCESS >> " + JSON.stringify(data));

              // get data
              var enable_wifi = Number(data.enable_wifi);
              var broadcast_type = Number(data.broadcast_type);
              var buttongroup = $(
                "#home_screen_wifi_broadcast_type_buttongroup"
              ).data("kendoMobileButtonGroup");

              // b. set data
              if (enable_wifi) {
                APP.models.home_screen.set("wifi_broadcast_enabled", true);
              } else {
                APP.models.home_screen.set("wifi_broadcast_enabled", false);
                APP.models.home_screen.set(
                  "wifi_broadcast_ap_gateway_enabled",
                  false
                );
              }

              APP.models.home_screen.set(
                "wifi_broadcast_name",
                data.network_name
              );
              APP.models.home_screen.set(
                "wifi_broadcast_password",
                data.network_password
              );

              APP.models.home_screen.set(
                "wifi_broadcast_type",
                broadcast_type
              );
              if (broadcast_type == 1) {
                buttongroup.select(0);
              } // bridge
              else if (broadcast_type == 2) {
                buttongroup.select(1);
              } // no bridge
              else {
                console.error(
                  loc +
                  "broadcast_type unhandled >> broadcast_type = " +
                  broadcast_type.toString()
                );
                screen_popup.error("Internal Error.  Please see help.");
              }
              APP.models.home_screen.wifi_broadcast_type_select();

              APP.models.home_screen.set(
                "wifi_broadcast_ap_gateway",
                data.network_ap_gateway
              );

              screen_popup_short.success("Refresh Successful");
            } catch (e) {
              console.error(loc + "ERROR >> " + e.toString());
              screen_popup.error("Internal Error.  Please see help.");
            }
          });
        } catch (e) {
          console.error(arguments.callee.name + " >> ERROR >> " + e.toString());
          screen_popup.error("Internal Error.  Please see help.");
        }
      },
      wifi_broadcast_type_select: function wifi_broadcast_type_select(e) {
        try {
          var debug = false;
          var loc = "home_screen >> wifi_broadcast_type_select >> ";

          // 1. get data
          var buttongroup = $(
            "#home_screen_wifi_broadcast_type_buttongroup"
          ).data("kendoMobileButtonGroup");
          var index = buttongroup.current().index();

          // 2. set data
          this.set("wifi_broadcast_broadcast_type_index", index);
          if (index == 0) {
            this.set("wifi_broadcast_type", 1);
            this.set("wifi_broadcast_ap_gateway_enabled", false);
            $("#home_screen_wifi_broadcast_ap_gateway").prop("required", false);
            var validator = $("#home_screen_wifi_panel").data("kendoValidator");
            validator.hideMessages();
          } // bridge
          else if (index == 1) {
            this.set("wifi_broadcast_type", 2);
            this.set("wifi_broadcast_ap_gateway_enabled", true);
            $("#home_screen_wifi_broadcast_ap_gateway").prop("required", true);
          } // no bridge
          else {
            console.error(
              loc +
              "wifi_broadcast_type unhandled >> wifi_broadcast_type = " +
              wifi_broadcast_type.toString()
            );
            screen_popup.error("Internal Error.  Please see help.");
          }
        } catch (e) {
          console.error(arguments.callee.name + " >> ERROR >> " + e.toString());
          screen_popup.error("Internal Error.  Please see help.");
        }
      },
      // Commands
      reboot_station: function reboot_station() {
        try {
          var debug = false;
          var loc = "home_screen >> reboot_station >> ";

          var url = URL + "/reboot_station";
          if (debug) console.log(loc + "url = " + url);
          $.getJSON(url, function (data) {
            try {
              if (debug)
                console.log(loc + "SUCCESS >> " + JSON.stringify(data));

              // 1. get data
              var status = data.status;
              var response = data.response;

              // 2. handle data
              if (status == "success") {
                screen_popup.success("Station rebooted.");
              } else if (status == "error") {
                console.warn(
                  loc + "status = " + status + "; response = " + response
                );
                screen_popup_no_hide.error("Error = " + response);
              } else {
                console.error(loc + "ERROR >> status unhandled >> " + status);
                screen_popup.error("Internal Error.  Please see help.");
              }
            } catch (e) {
              console.error(loc + "ERROR >> " + e.toString());
              screen_popup.error("Internal Error.  Please see help.");
            }
          });
        } catch (e) {
          console.error(arguments.callee.name + " >> ERROR >> " + e.toString());
          screen_popup.error("Internal Error.  Please see help.");
        }
      },
    })
  }
};

$(document).ready(function document_ready() {
  // this function never stops running
  try {
    var debug = false;
  } catch (e) {
    console.error(arguments.callee.name + " >> ERROR >> " + e.toString());
  }
});

function app_init() {
  // this function runs once, on ready
  try {
    var debug = false;
    var loc = "app_init >> ";

    console.log(
      loc +
      "App Initializing >> app_version = " +
      app_version +
      "; kendo version = " +
      kendo.version
    );
    console.log(
      loc +
      "Browser Information >> CodeName = " +
      navigator.appCodeName +
      "; appName = " +
      navigator.appName +
      "; Version = " +
      navigator.appVersion
    );

    // Popups and Dialogs
    screen_popup = $("#screen_popup")
      .kendoNotification({
        show: show_popup_centered,
        position: {
          top: 30,
          right: 30
        },
        autoHideAfter: 5000
      })
      .data("kendoNotification");
    screen_popup_short = $("#screen_popup")
      .kendoNotification({
        //show: show_popup_centered,
        position: {
          top: 30,
          right: 30
        },
        autoHideAfter: 1777
      })
      .data("kendoNotification");
    screen_popup_no_hide = $("#screen_popup_no_hide")
      .kendoNotification({
        show: show_popup_centered,
        autoHideAfter: 0,
        button: true
      })
      .data("kendoNotification");
    dialog_reboot = $("#home_screen_dialog_reboot").data("kendoDialog");
    dialog_submit_network = $("#home_screen_dialog_submit_network").data(
      "kendoDialog"
    );
    dialog_submit_wifi_broadcast = $(
      "#home_screen_dialog_submit_wifi_broadcast"
    ).data("kendoDialog");

    // Validators
    $("#home_screen_network_panel").kendoValidator({
      rules: {
        checkIP: function (input) {
          if (input.is("[data-checkIP-msg]") && input.val()) {
            return validate_ip_address(input.val());
          }
          return true;
        }
      }
    });
    $("#home_screen_vpn_server_panel").kendoValidator({
      rules: {
        checkIP: function (input) {
          if (input.is("[data-checkIP-msg]") && input.val()) {
            return validate_ip_address(input.val());
          }
          return true;
        },
      }
    });
    $("#home_screen_wifi_panel").kendoValidator({
      rules: {
        checkIP: function (input) {
          if (input.is("[data-checkIP-msg]") && input.val()) {
            return validate_ip_address(input.val());
          }
          return true;
        },
        checkGW: function (input) {
          if (input.is("[data-checkGW-msg]") && input.val()) {
            var val = input.val();
            return val.substr(-2) === ".1";
          }
          return true;
        }
      }
    });

    // Grids
    $("#br0_addresses").kendoGrid({
      height: 300,
      toolbar: ["create"],
      columns: [{
          field: "address",
          title: "Address",
          width: 150
        },
        {
          field: "cidr",
          title: "Subnet Mask",
          editor: function categoryDropDownEditor(container, options) {
            $('<input data-bind="value:' + options.field + '"/>')
              .appendTo(container)
              .kendoDropDownList({
                dataTextField: "subnet_mask",
                dataValueField: "cidr",
                //valuePrimitive: true,
                dataSource: {
                  data: APP.models.home_screen.subnet_mask_cidr
                },
              });
          },
          template: "#=getCidrName(cidr)#",
          width: 200
        },
        {
          command: ["destroy"],
          title: "&nbsp;",
          width: 100,
        }
      ],
      editable: true,
      sortable: {
        mode: "single",
        allowUnsort: false
      },
    });
    $("#eth1_addresses").kendoGrid({
      height: 300,
      toolbar: ["create"],
      columns: [{
          field: "address",
          title: "Address",
          width: 150
        },
        {
          field: "cidr",
          title: "Subnet Mask",
          editor: function categoryDropDownEditor(container, options) {
            $('<input data-bind="value:' + options.field + '"/>')
              .appendTo(container)
              .kendoDropDownList({
                dataTextField: "subnet_mask",
                dataValueField: "cidr",
                //valuePrimitive: true,
                dataSource: {
                  data: APP.models.home_screen.subnet_mask_cidr
                },
              });
          },
          template: "#=getCidrName(cidr)#",
          width: 200
        },
        {
          command: ["destroy"],
          title: "&nbsp;",
          width: 100,
        }
      ],
      editable: true,
      sortable: {
        mode: "single",
        allowUnsort: false
      },
    });
    $("#eth2_addresses").kendoGrid({
      height: 300,
      toolbar: ["create"],
      columns: [{
          field: "address",
          title: "Address",
          width: 150
        },
        {
          field: "cidr",
          title: "Subnet Mask",
          editor: function categoryDropDownEditor(container, options) {
            $('<input data-bind="value:' + options.field + '"/>')
              .appendTo(container)
              .kendoDropDownList({
                dataTextField: "subnet_mask",
                dataValueField: "cidr",
                //valuePrimitive: true,
                dataSource: {
                  data: APP.models.home_screen.subnet_mask_cidr
                },
              });
          },
          template: "#=getCidrName(cidr)#",
          width: 200
        },
        {
          command: ["destroy"],
          title: "&nbsp;",
          width: 100,
        }
      ],
      editable: true,
      sortable: {
        mode: "single",
        allowUnsort: false
      },
    });
    $("#wifi_addresses").kendoGrid({
      height: 300,
      toolbar: ["create"],
      columns: [{
          field: "address",
          title: "Address",
          width: 150
        },
        {
          field: "cidr",
          title: "Subnet Mask",
          editor: function categoryDropDownEditor(container, options) {
            $('<input data-bind="value:' + options.field + '"/>')
              .appendTo(container)
              .kendoDropDownList({
                dataTextField: "subnet_mask",
                dataValueField: "cidr",
                //valuePrimitive: true,
                dataSource: {
                  data: APP.models.home_screen.subnet_mask_cidr
                },
              });
          },
          template: "#=getCidrName(cidr)#",
          width: 200
        },
        {
          command: ["destroy"],
          title: "&nbsp;",
          width: 100,
        }
      ],
      editable: true,
      sortable: {
        mode: "single",
        allowUnsort: false
      },
    });

    console.log(loc + "App initialized.");
  } catch (e) {
    console.error(arguments.callee.name + " >> ERROR >> " + e.toString());
  }
}

function getCidrName(cidr) {
  var subnet_mask_cidr = APP.models.home_screen.get("subnet_mask_cidr");
  for (var i = 0; i < subnet_mask_cidr.length; i++) {
    if (subnet_mask_cidr[i].cidr == cidr) {
      return subnet_mask_cidr[i].subnet_mask;
    }
  }
}

app = new kendo.mobile.Application($(document.body), {
  initial: "home_screen",
  skin: "bootstrap",
  statusBarStyle: "black-translucent",
  init: app_init
});

// Saved Code
/*
Netplan: https://netplan.io/
*******************************************************************************************
screen_popup.info("information");
screen_popup.success("success");
screen_popup.warning("warning");
screen_popup.error("error");
*******************************************************************************************
console.log("logging");
console.info("information");
console.error("error");
console.warn("warning");
console.info("debugging");
*******************************************************************************************
try {

}
catch (e) {
    console.log(" >> ERROR >> " + e.toString());
}
*******************************************************************************************

*/