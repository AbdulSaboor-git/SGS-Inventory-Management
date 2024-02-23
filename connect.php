<?php
$connection = odbc_connect('inventory','abdsab','asdf1234');
if (!$connection) {
    die('Connection failed: ' . odbc_errormsg());
}
