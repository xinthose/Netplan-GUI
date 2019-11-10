/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code bundle.
 */

/// Singletons
function MyClass() {
    if (arguments.callee._singletonInstance)
        return arguments.callee._singletonInstance;
    arguments.callee._singletonInstance = this;
    this.ajax_in_use = false;
}
var myglobal = new MyClass();

/// Input Filtering

function numeric(e) {
    var key;
    var keychar;
    if (window.event) key = window.event.keyCode;
    else if (e) key = e.which;
    else return true;
    keychar = String.fromCharCode(key);
    keychar = keychar.toLowerCase();
    // control keys 
    if ((key === null) || (key === 0) || (key === 8) || (key === 9) || (key === 13) || (key === 27))
        return true;
    // alphas and numbers 
    else if ((("0123456789").indexOf(keychar) > -1))
        return true;
    else
        return false;
}

function numeric_with_dash(e) {
    var key;
    var keychar;
    if (window.event) key = window.event.keyCode;
    else if (e) key = e.which;
    else return true;
    keychar = String.fromCharCode(key);
    keychar = keychar.toLowerCase();
    // control keys 
    if ((key === null) || (key === 0) || (key === 8) || (key === 9) || (key === 13) || (key === 27))
        return true;
    // alphas and numbers 
    else if ((("0123456789-").indexOf(keychar) > -1))
        return true;
    else
        return false;
}

function numeric_with_period(e) {
    var key;
    var keychar;
    if (window.event) key = window.event.keyCode;
    else if (e) key = e.which;
    else return true;
    keychar = String.fromCharCode(key);
    keychar = keychar.toLowerCase();
    // control keys 
    if ((key === null) || (key === 0) || (key === 8) || (key === 9) || (key === 13) || (key === 27))
        return true;
    // alphas and numbers 
    else if ((("0123456789.").indexOf(keychar) > -1))
        return true;
    else
        return false;
}

function alphanumeric(e) {
    var key;
    var keychar;
    if (window.event) key = window.event.keyCode;
    else if (e) key = e.which;
    else return true;
    keychar = String.fromCharCode(key);
    keychar = keychar.toLowerCase();
    // control keys 
    if ((key === null) || (key === 0) || (key === 8) || (key === 9) || (key === 13) || (key === 27))
        return true;
    // alphas and numbers 
    else if ((("abcdefghijklmnopqrstuvwxyz0123456789").indexOf(keychar) > -1))
        return true;
    else
        return false;
}

function alphanumeric_dash_underscore(e) {
    var key;
    var keychar;
    if (window.event) key = window.event.keyCode;
    else if (e) key = e.which;
    else return true;
    keychar = String.fromCharCode(key);
    keychar = keychar.toLowerCase();
    // control keys 
    if ((key === null) || (key === 0) || (key === 8) || (key === 9) || (key === 13) || (key === 27))
        return true;
    // alphas and numbers 
    else if ((("abcdefghijklmnopqrstuvwxyz0123456789-_").indexOf(keychar) > -1))
        return true;
    else
        return false;
}

function alphanumeric_with_space(e) {
    var key;
    var keychar;
    if (window.event) key = window.event.keyCode;
    else if (e) key = e.which;
    else return true;
    keychar = String.fromCharCode(key);
    keychar = keychar.toLowerCase();
    // control keys 
    if ((key === null) || (key === 0) || (key === 8) || (key === 9) || (key === 13) || (key === 27))
        return true;
    // alphas and numbers 
    else if ((("abcdefghijklmnopqrstuvwxyz0123456789 ").indexOf(keychar) > -1))
        return true;
    else
        return false;
}

function alphanumeric_with_space_dash(e) {
    var key;
    var keychar;
    if (window.event) key = window.event.keyCode;
    else if (e) key = e.which;
    else return true;
    keychar = String.fromCharCode(key);
    keychar = keychar.toLowerCase();
    // control keys 
    if ((key === null) || (key === 0) || (key === 8) || (key === 9) || (key === 13) || (key === 27))
        return true;
    // alphas and numbers 
    else if ((("abcdefghijklmnopqrstuvwxyz0123456789 -").indexOf(keychar) > -1))
        return true;
    else
        return false;
}

function alphabetical(e) {
    var key;
    var keychar;
    if (window.event) key = window.event.keyCode;
    else if (e) key = e.which;
    else return true;
    keychar = String.fromCharCode(key);
    keychar = keychar.toLowerCase();
    // control keys 
    if ((key === null) || (key === 0) || (key === 8) || (key === 9) || (key === 13) || (key === 27))
        return true;
    // alphas and numbers 
    else if ((("abcdefghijklmnopqrstuvwxyz").indexOf(keychar) > -1))
        return true;
    else
        return false;
}

function alphabetical_with_space(e) {
    var key;
    var keychar;
    if (window.event) key = window.event.keyCode;
    else if (e) key = e.which;
    else return true;
    keychar = String.fromCharCode(key);
    keychar = keychar.toLowerCase();
    // control keys 
    if ((key === null) || (key === 0) || (key === 8) || (key === 9) || (key === 13) || (key === 27))
        return true;
    // alphas and numbers 
    else if ((("abcdefghijklmnopqrstuvwxyz ").indexOf(keychar) > -1))
        return true;
    else
        return false;
}

function prevent_spaces(e) {
    if (e.which === 32)
        return false;
}

/// Validation

function validate_email(email) {
    var regex = /\S+@\S+\.\S+/;
    return regex.test(email);
}

function validate_ip_address(ip_address) {
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip_address)) {
        return (true)
    } else return (false)
}

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

/// Formating

function show_popup_centered(e) {
    if (!$("." + e.sender._guid)[1]) {
        var element = e.element.parent(),
            eWidth = element.width(),
            eHeight = element.height(),
            wWidth = $(window).width(),
            wHeight = $(window).height(),
            newTop, newLeft;

        newLeft = Math.floor(wWidth / 2 - eWidth / 2);
        newTop = Math.floor(wHeight / 2 - eHeight / 2);

        e.element.parent().css({
            top: newTop,
            left: newLeft,
            zIndex: 22222
        });
    }
}

function remove_phone_mask(str) {
    try {
        if (!str) return "";
        str = str.replace(/\(/g, '');
        str = str.replace(/\)/g, '');
        str = str.replace(/-/g, '');
        str = str.replace(/_/g, '');
        str = str.replace(/ /g, '');
    } catch (e) {
        console.error(arguments.callee.name + " >> ERROR >> " + e.toString());
    }

    return str;
}

var currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
});

function precise_round(num, decimals) {
    var t = Math.pow(10, decimals);
    return (Math.round((num * t) + (decimals > 0 ? 1 : 0) * (Math.sign(num) * (10 / Math.pow(100, decimals)))) / t).toFixed(decimals);
}

function format_telephone_number(telephone_number) {
    var telephone_number_formatted = "";

    try {
        var len = telephone_number.length;

        switch (len) {
            // less than 10 characters
            case 0:
                break; // empty number
            case 8: {
                telephone_number_formatted = telephone_number.replace(/(\d{1})(\d{3})(\d{4})/, '($1) $2-$3');
                break;
            }
            case 9: {
                telephone_number_formatted = telephone_number.replace(/(\d{2})(\d{3})(\d{4})/, '($1) $2-$3');
                break;
            }
            // no country code
            case 10: {
                telephone_number_formatted = telephone_number.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
                break;
            }
            // include varying country code sizes
            case 11: {
                telephone_number_formatted = telephone_number.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+$1 ($2) $3-$4');
                break;
            }
            case 12: {
                telephone_number_formatted = telephone_number.replace(/(\d{2})(\d{3})(\d{3})(\d{4})/, '+$1 ($2) $3-$4');
                break;
            }
            case 13: {
                telephone_number_formatted = telephone_number.replace(/(\d{3})(\d{3})(\d{3})(\d{4})/, '+$1 ($2) $3-$4');
                break;
            }
            case 14: {
                telephone_number_formatted = telephone_number.replace(/(\d{4})(\d{3})(\d{3})(\d{4})/, '+$1 ($2) $3-$4');
                break;
            }
            case 15: {
                telephone_number_formatted = telephone_number.replace(/(\d{5})(\d{3})(\d{3})(\d{4})/, '+$1 ($2) $3-$4');
                break;
            }
            case 16: {
                telephone_number_formatted = telephone_number.replace(/(\d{6})(\d{3})(\d{3})(\d{4})/, '+$1 ($2) $3-$4');
                break;
            }
            default: {
                console.log(arguments.callee.name + " >> ERROR >> telephone_number length not handled >> " + len);
                break;
            }
        }
    } catch (e) {
        console.error(arguments.callee.name + " >> ERROR >> " + e.toString());
    }
    return telephone_number_formatted;
}

// Global ajax Setup

$(document).ajaxSend(function ajaxSend(event, jqXHR, ajaxSettings) {
    try {
        app.showLoading();
    } catch (e) {
        console.error(arguments.callee.name + " >> ERROR >> " + e.toString());
    }
});

$(document).ajaxError(function ajaxError(event, jqXHR, ajaxSettings, thrownError) {
    try {
        var url = ajaxSettings.url;
        var http_status_code = jqXHR.status;
        var response = jqXHR.responseText;
        var message = "";
        if (isJson(response)) {
            var json_obj = JSON.parse(response);
            if (json_obj.hasOwnProperty("message")) {
                message = "  " + json_obj.message;
            }
        }
        var error_str = "";

        // 1. handle HTTP status code
        switch (http_status_code) {
            case 0: {
                error_str = "No Connection.  Cannot connect to " + new URL(url).hostname + ".";
                break;
            } // No Connection
            case 400: {
                if (message) {
                    error_str = "Bad Request.  " + message;
                } else {
                    error_str = "Bad Request.  Please see help.";
                }
                break;
            } // Bad Request
            case 401: {
                error_str = "Unauthorized." + message + "  Please see help.";
                break;
            } // Unauthorized
            case 402: {
                error_str = "Request Failed." + message;
                break;
            } // Request Failed
            case 404: {
                error_str = "Not Found." + message + "  Please see help.";
                break;
            } // Not Found
            case 405: {
                error_str = "Method Not Allowed." + message + "  Please see help.";
                break;
            } // Method Not Allowed
            case 409: {
                error_str = "Conflict." + message + "  Please see help.";
                break;
            } // Conflict
            case 429: {
                error_str = "Too Many Requests." + message + "  Please try again later.";
                break;
            } // Too Many Requests
            case 500: {
                if (message) {
                    error_str = message;
                } else {
                    error_str = "Internal Server Error.  Please see help.";
                }
                break;
            } // Internal Server Error
            case 502: {
                error_str = "Bad Gateway." + message + "  Please see help.";
                break;
            } // Bad Gateway
            case 503: {
                error_str = "Service Unavailable." + message + "  Please see help.";
                break;
            } // Service Unavailable
            case 504: {
                error_str = "Gateway Timeout." + message + "  Please see help.";
                break;
            } // Gateway Timeout
            default: {
                console.error(arguments.callee.name + " >> http_status_code unhandled >> http_status_code = " + http_status_code);
                error_str = "Unknown Error." + message + "  Please see help.";
                break;
            }
        }

        // 2. show popup
        screen_popup_no_hide.error(error_str);
        var error_info = arguments.callee.name + " >> http_status_code = " + http_status_code.toString() + "; thrownError = " + thrownError + "; URL = " + url + "; Response = " + response + "; error_str = " + error_str;
        console.error(error_info);
        //APP.models.home_screen.log_message(error_info, "error");
    } catch (e) {
        console.error(arguments.callee.name + " >> " + e.toString());
        screen_popup_no_hide.error("Error: " + e.toString());
    }
});


$(document).ajaxComplete(function ajaxComplete(event, jqXHR, ajaxSettings) {
    try {
        var debug = false;

        if (debug) console.log(arguments.callee.name + " >> URL = " + ajaxSettings.url + "; Response = " + jqXHR.responseText);

        app.hideLoading();
    } catch (e) {
        console.error(arguments.callee.name + " >> ERROR >> " + e.toString());
    }
});

// Kendo UI Custom Bindings

kendo.data.binders.widget.required = kendo.data.Binder.extend({
  init: function (widget, bindings, options) {
    //call the base constructor
    kendo.data.Binder.fn.init.call(this, widget.element[0], bindings, options);
  },
  refresh: function () {
    var that = this,
      value = that.bindings["required"].get(); //get the value from the View-Model
    $(that.element).prop("required", value); //update the widget
  }
});

/////// Miscellaneous ///////

// Dialogs
function close_dialog() {
    return true;
};

function reboot_station() {
    try {
        APP.models.home_screen.reboot_station();
    } catch (e) {
        console.error(arguments.callee.name + " >> ERROR >> " + e.toString());
        screen_popup.error("Internal Error.  Please see help.");
    }

    return;
};

function submit_network() {
    try {
        APP.models.home_screen.submit_network();
    } catch (e) {
        console.error(arguments.callee.name + " >> ERROR >> " + e.toString());
        screen_popup.error("Internal Error.  Please see help.");
    }

    return;
};

function submit_wifi_broadcast() {
    try {
        APP.models.home_screen.submit_wifi_broadcast();
    } catch (e) {
        console.error(arguments.callee.name + " >> ERROR >> " + e.toString());
        screen_popup.error("Internal Error.  Please see help.");
    }

    return;
};

// Classless Inter-Domain Routing
var subnet_mask_cidr_arr = [{
        subnet_mask: "255.255.255.255",
        cidr: 32
    },
    {
        subnet_mask: "255.255.255.254",
        cidr: 31
    },
    {
        subnet_mask: "255.255.255.252",
        cidr: 30
    },
    {
        subnet_mask: "255.255.255.248",
        cidr: 29
    },
    {
        subnet_mask: "255.255.255.240",
        cidr: 28
    },
    {
        subnet_mask: "255.255.255.224",
        cidr: 27
    },
    {
        subnet_mask: "255.255.255.192",
        cidr: 26
    },
    {
        subnet_mask: "255.255.255.128",
        cidr: 25
    },
    {
        subnet_mask: "255.255.255.0",
        cidr: 24
    },
    {
        subnet_mask: "255.255.254.0",
        cidr: 23
    },
    {
        subnet_mask: "255.255.252.0",
        cidr: 22
    },
    {
        subnet_mask: "255.255.248.0",
        cidr: 21
    },
    {
        subnet_mask: "255.255.240.0",
        cidr: 20
    },
    {
        subnet_mask: "255.255.224.0",
        cidr: 19
    },
    {
        subnet_mask: "255.255.192.0",
        cidr: 18
    },
    {
        subnet_mask: "255.255.128.0",
        cidr: 17
    },
    {
        subnet_mask: "255.255.0.0",
        cidr: 16
    },
    {
        subnet_mask: "255.254.0.0",
        cidr: 15
    },
    {
        subnet_mask: "255.252.0.0",
        cidr: 14
    },
    {
        subnet_mask: "255.248.0.0",
        cidr: 13
    },
    {
        subnet_mask: "255.240.0.0",
        cidr: 12
    },
    {
        subnet_mask: "255.224.0.0",
        cidr: 11
    },
    {
        subnet_mask: "255.192.0.0",
        cidr: 10
    },
    {
        subnet_mask: "255.128.0.0",
        cidr: 9
    },
    {
        subnet_mask: "255.0.0.0",
        cidr: 8
    },
    {
        subnet_mask: "254.0.0.0",
        cidr: 7
    },
    {
        subnet_mask: "252.0.0.0",
        cidr: 6
    },
    {
        subnet_mask: "248.0.0.0",
        cidr: 5
    },
    {
        subnet_mask: "240.0.0.0",
        cidr: 4
    },
    {
        subnet_mask: "224.0.0.0",
        cidr: 3
    },
    {
        subnet_mask: "192.0.0.0",
        cidr: 2
    },
    {
        subnet_mask: "128.0.0.0",
        cidr: 1
    },
    {
        subnet_mask: "0.0.0.0",
        cidr: 0
    }
];

/* Saved Code
*******************************************************************************************
function empty_function() {
    try {

    }
    catch (e) {
        console.error(arguments.callee.name + " >> ERROR >> " + e.toString());
        screen_popup.error("Internal Error.  Please see help.");
    }

    return;
}
*******************************************************************************************

*/