<?php
    /* This file is subject to the terms and conditions defined in
       file 'LICENSE.txt', which is part of this source code bundle.
    */

    // Setup
    define("LOGFILE_DIR", "/var/www/html/logs/app/");
    define("LOGFILE", (LOGFILE_DIR . "netplan-gui_" . date("Y-m-d") . ".log"));
    define("LOGFILE_DELETE_DAYS", 30);

    /****************** Main Code *********************/


    function error_handler($errno, $errstr, $errfile, $errline) {
        /* #region */
        // Source: http://php.net/set_error_handler >> Examples

        // this error code is not included in error_reporting, so let it fall through to the standard PHP error handler
        if (!(error_reporting() & $errno)) {
            return false;
        }

        // set filename
        $filename = basename($errfile);

        // set timezone
        date_default_timezone_set("America/Chicago");

        // add line to log file
        switch ($errno) {
            case E_USER_NOTICE:
                file_put_contents(LOGFILE, date("Y-m-d H:i:s.").gettimeofday()["usec"] . " $filename ($errline): " . "NOTICE >> message = $errstr\n", FILE_APPEND | LOCK_EX);
                break;
            case E_USER_WARNING:
                file_put_contents(LOGFILE, date("Y-m-d H:i:s.").gettimeofday()["usec"] . " $filename ($errline): " . "WARNING >> message = $errstr\n", FILE_APPEND | LOCK_EX);
                break;
            case E_USER_ERROR:
                file_put_contents(LOGFILE, date("Y-m-d H:i:s.").gettimeofday()["usec"] . " $filename ($errline): " . "ERROR >> message = [$errno] $errstr\n", FILE_APPEND | LOCK_EX);
                //exit(1);
                break;
            default:
                file_put_contents(LOGFILE, date("Y-m-d H:i:s.").gettimeofday()["usec"] . " $filename ($errline): " . "UNKNOWN >> message = $errstr\n", FILE_APPEND | LOCK_EX);
                break;
        }

        // delete any files older than 30 days
        $files = glob(LOGFILE_DIR . "*");
        $now = time();
        foreach ($files as $file)
            if (is_file($file))
                if ($now - filemtime($file) >= 60 * 60 * 24 * LOGFILE_DELETE_DAYS)
                    unlink($file);

        // return; do not execute PHP internal error handler
        return true;
        /* #endregion */
    }

    function log_message () {
        /* #region */
        $loc = "log_message >> ";
        $debug = false;

        try
        {
            if ($debug) trigger_error("$loc started", E_USER_NOTICE);

            // get data
            $json_str = file_get_contents('php://input');
            if ($debug) echo var_dump($json_str);
            $json_obj = json_decode($json_str);

            // parse data
            $level = intval($json_obj->{"level"});
            $message = $json_obj->{"message"};
            if ($debug) trigger_error("$loc level = $level; message = $message", E_USER_NOTICE);

            // log message (see file ngx-logger/lib/types/logger-level.enum.d.ts)
            switch ($level)
            {
            	case 0: // TRACE
                    file_put_contents(LOGFILE, "[" . date("Y-m-d H:i:s.").gettimeofday()["usec"] . "] [TRACE] $message\n", FILE_APPEND | LOCK_EX);
                    break;
            	case 1: // DEBUG
                    file_put_contents(LOGFILE, "[" . date("Y-m-d H:i:s.").gettimeofday()["usec"] . "] [DEBUG] $message\n", FILE_APPEND | LOCK_EX);
                    break;
            	case 2: // INFO
                    file_put_contents(LOGFILE, "[" . date("Y-m-d H:i:s.").gettimeofday()["usec"] . "] [INFO] $message\n", FILE_APPEND | LOCK_EX);
                    break;
            	case 3: // LOG
                    file_put_contents(LOGFILE, "[" . date("Y-m-d H:i:s.").gettimeofday()["usec"] . "] [LOG] $message\n", FILE_APPEND | LOCK_EX);
                    break;
            	case 4: // WARN
                    file_put_contents(LOGFILE, "[" . date("Y-m-d H:i:s.").gettimeofday()["usec"] . "] [WARN] $message\n", FILE_APPEND | LOCK_EX);
                    break;
            	case 5: // ERROR
                    file_put_contents(LOGFILE, "[" . date("Y-m-d H:i:s.").gettimeofday()["usec"] . "] [ERROR] $message\n", FILE_APPEND | LOCK_EX);
                    break;
            	case 6: // FATAL
                    file_put_contents(LOGFILE, "[" . date("Y-m-d H:i:s.").gettimeofday()["usec"] . "] [FATAL] $message\n", FILE_APPEND | LOCK_EX);
                    break;
                default:
                    throw new Exception("level unhandled >> level = $level");
                    break;
            }

            // set code
            http_response_code(200);    // OK
        }
        catch (Exception $e)
        {
            $return_array = [
                "message" => $e->getMessage(),
            ];
            $return_str = json_encode($return_array);
            trigger_error("$loc $return_str", E_USER_ERROR);
            http_response_code(500);    // Internal Server Error
            echo $return_str;
        }

        if ($debug) trigger_error("$loc ended", E_USER_NOTICE);
        /* #endregion */
    }

    set_error_handler("error_handler");

    log_message();

    /* Notes
    ********************************************************************************************************************
    trigger_error("$loc ", E_USER_NOTICE);
    trigger_error("$loc ", E_USER_WARNING);
    trigger_error("$loc ", E_USER_ERROR);
    ********************************************************************************************************************
    */

    // ! NOTE: do not put any text/comments outside of this ending bracket
?>
