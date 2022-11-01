<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <title>Login</title>
    <script>
        function translate() {
            location.replace("http://localhost/LameProject/translate.php");
        }
    </script>
</head>

<body>
    <button onclick="translate()">Back</button><br /><br />
    <form method="post" action="http://localhost/LameProject/login.php">
        <label>Username</label>
        <input type="text" name="username" pattern="[a-zA-Z0-9]+" required /><br>
        <label>Password</label>
        <input type="password" name="password" required /><br>
        <button type="submit" name="login" value="login">Log In</button><br>
    </form>

    <?php
    include('connection.php');
    session_start();

    if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['login'])) {

        try {
            $username = $_POST['username'];
            $password = $_POST['password'];

            $sql = $connection->prepare("SELECT * FROM users WHERE username=:username LIMIT 1");
            $sql->bindParam("username", $username, PDO::PARAM_STR);
            $sql->execute();
            $result = $sql->fetch(PDO::FETCH_ASSOC);

            if (isset($result['id'])) {
                if (password_verify($password, $result['password'])) {
                    $_SESSION["user_id"] = $result['id'];
                    echo "<script>window.location.href='translate.php'</script>";
                }
            }else {
                echo "Wrong usernamer/password";
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