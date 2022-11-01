<?php
include('connection.php');
session_start();

if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['download'])) {
    try {

        if (isset($_SESSION["user_id"])) {
            $user_id = $_SESSION["user_id"];
        } else {
            throw new Exception("login first");
        }

        $sql = $connection->prepare("SELECT en,fa FROM dict${user_id};");
        $sql->execute();
        $result = $sql->fetchAll(PDO::FETCH_ASSOC);

        header("Content-Type: application/json; charset=UTF-8");                           
        header('Content-Disposition: attachment; filename="myDict.json"');                              
        echo json_encode($result, JSON_UNESCAPED_UNICODE);

    } catch (PDOException $e) {
        exit("Error: " . $e->getMessage());
    } catch (Exception $e) {
        exit("Error: " . $e->getMessage());
    } finally {
        $connection = null;
    }
}
