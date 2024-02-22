<?php
$connection = odbc_connect('inventory','adbsab','asdf1234');
if (!$connection) {
    die('Connection failed: ' . odbc_errormsg());
}
