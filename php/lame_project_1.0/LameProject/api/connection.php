<?php
$dbhost = "localhost";
$dbname = "lame_project";
$dbuser = "root";
$dbpass = "";

try {
    $connection = new PDO("mysql:host=$dbhost;dbname=${dbname}", $dbuser, $dbpass);
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
