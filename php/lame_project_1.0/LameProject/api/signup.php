<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <title>Signup</title>
    <script>
        function translate() {
            location.replace("http://localhost/LameProject/translate.php");
        }
    </script>
</head>

<body>
    <button onclick="translate()">Back</button><br /><br />
    <form method="post" action="http://localhost/LameProject/signup.php">
        <label>Username</label>
        <input type="text" name="username" /><br>
        <label>Email</label>
        <input type="email" name="email" /><br>
        <label>Password</label>
        <input type="password" name="password" /><br>
        <button type="submit" name="signup" value="signup">Signup</button><br>
    </form><br>

    <?php
    include('connection.php');
    session_start();

    if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['signup'])) {

        try {
            $username = $_POST['username'];
            $email = $_POST['email'];
            $password = $_POST['password'];
            $password_hash = password_hash($password, PASSWORD_BCRYPT);

            $sql = $connection->prepare("SELECT * FROM users WHERE EMAIL=:email");
            $sql->bindParam("email", $email, PDO::PARAM_STR);
            $sql->execute();

            if ($sql->rowCount() > 0) {
                echo 'The email address is already registered';
            } else if ($sql->rowCount() == 0) {
                $sql = $connection->prepare("INSERT INTO users(USERNAME,PASSWORD,EMAIL) VALUES (:username,:password_hash,:email)");
                $sql->bindParam("username", $username, PDO::PARAM_STR);
                $sql->bindParam("password_hash", $password_hash, PDO::PARAM_STR);
                $sql->bindParam("email", $email, PDO::PARAM_STR);
                $result = $sql->execute();

                $lastInsertId = $connection->lastInsertId();
                $_SESSION["user_id"] = $lastInsertId;
                echo "<script>window.location.href='translate.php'</script>";
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