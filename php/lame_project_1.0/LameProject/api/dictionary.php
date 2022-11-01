<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <title>Dictionary</title>
    <script>
        function translate() {
            location.replace("http://localhost/LameProject/translate.php");
        }
    </script>
</head>

<body>
    <button onclick="translate()">Back</button><br /><br />

    <form method="post" action="http://localhost/LameProject/dictionary.php" enctype="multipart/form-data">
        <input type="file" name="dictionary" />
        <input type="submit" name="upload" value="upload" /><br /><br />
        <input type="submit" name="delete" value="delete" />
    </form><br />
    <form method="get" action="http://localhost/LameProject/download.php">
        <input type="submit" name="download" value="download" />
    </form><br />

    <?php
    include('connection.php');
    session_start();

    if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['upload'])) {
        try {
            if (isset($_SESSION["user_id"])) {
                $user_id = $_SESSION["user_id"];
            } else {
                throw new Exception("login first");
            }

            $dictionary = json_decode(file_get_contents($_FILES['dictionary']['tmp_name']));
            $file_type = strtolower(pathinfo($_FILES["dictionary"]["name"], PATHINFO_EXTENSION));
            if ($file_type != "json") {
                throw new Exception("Uploaded file is not json");
            }

            $sql = $connection->prepare("CREATE TABLE IF NOT EXISTS dict${user_id} (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, en VARCHAR(64) NOT NULL, 
            fa VARCHAR(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_persian_ci NOT NULL );");
            $sql->execute();

            $sql = $connection->prepare("INSERT INTO dict${user_id} (en, fa) VALUES (:en, :fa)");
            $sql->bindParam(':en', $en);
            $sql->bindParam(':fa', $fa);
            foreach ($dictionary as $word) {
                $en = $word->en;
                $fa = $word->fa;
                $sql->execute();
            }
            echo "<script>window.location.href='translate.php'</script>";
        } catch (PDOException $e) {
            exit("Error: " . $e->getMessage());
        } catch (Exception $e) {
            exit("Error: " . $e->getMessage());
        } finally {
            $connection = null;
        }
    } else if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['delete'])) {
        try {
            if (isset($_SESSION["user_id"])) {
                $user_id = $_SESSION["user_id"];
            } else {
                throw new Exception("login first");
            }
            $sql = $connection->prepare("DROP TABLE dict${user_id};");
            $sql->execute();
            echo "deleted your dictionary from database";
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