<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8" />
    <title>Translate</title>
    <script>
        function signup() {
            location.replace("http://localhost/LameProject/signup.php");
        }

        function login() {
            location.replace("http://localhost/LameProject/login.php");
        }

        function signout() {
            location.replace("http://localhost/LameProject/signout.php");
        }

        function dictionary() {
            location.replace("http://localhost/LameProject/dictionary.php");
        }
    </script>
</head>

<body>

    <?php
    session_start();
    if (isset($_SESSION["user_id"])) {
        echo '<button onclick="signout()">Sign out</button>
        <button onclick="dictionary()">Dictionary</button><br /><br />';
    } else {
        echo '<button onclick="signup()">Sign up</button>
        <button onclick="login()">Login</button><br /><br />';
    }
    ?>

    <form method="get" action="http://localhost/LameProject/translate.php">
        <input type="radio" name="lan" value="en fa" checked />
        <label for="en">EN->FA</label>
        <input type="radio" name="lan" value="fa en" />
        <label for="fa">FA->EN</label><br />
        <input type="text" name="word" />
    </form>
    <br />
    <br />

    <?php
    include('connection.php');

    if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['word']) && isset($_GET['lan'])) {
        try {
            $word = $_GET["word"];
            $lan = explode(" ", $_GET["lan"]);
            if (isset($_SESSION["user_id"])) {
                $user_id = $_SESSION["user_id"];
            } else {
                $user_id = "1"; //admin's id
            }

            $sql = $connection->prepare("SELECT ${lan[1]} FROM dict${user_id} WHERE ${lan[0]} LIKE '${word}';");
            $sql->execute();
            $result = $sql->fetch(PDO::FETCH_ASSOC);
            if ($result) {
                echo json_encode($result[$lan[1]], JSON_UNESCAPED_UNICODE);
            } else {
                echo "no result";
            }
        } catch (PDOException $e) {
            exit("Error: " . $e->getMessage());
        } catch (Exception $e) {
            exit("Error: " . $e->getMessage());
        } finally {
            $connection = null;
        }
    }

    ?>
</body>

</html>