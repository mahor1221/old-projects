<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    try {
        session_destroy();
        echo "<script>window.location.href='translate.php'</script>";
    } catch (Exception $e) {
        exit("Error: " . $e->getMessage());
    }
}
