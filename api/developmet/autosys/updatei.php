<?php require_once '../config/connection.php'; ?>
<?php if (!$checkBasicSecurity) {goto end;}?>

<?php

$userId = trim($_GET['userId']);
$fullName = strtoupper(trim($_POST['fullName']));
$emailAddress = trim($_POST['emailAddress']);
$phoneNumber = trim($_POST['phoneNumber']);
$passport = isset($_FILES['passport']['name']) ? $_FILES['passport']['name'] : '';

validateEmptyField($userId, 'USER ID');
validateEmptyField($fullName, 'FULL NAME');
validateEmptyField($emailAddress, 'EMAIL');
validateEmptyField($phoneNumber, 'PHONE NUMBER');

if (!preg_match('/^[A-Z\s]+$/', $fullName)) {
  $response = [
    'response' => 102,
    'success' => false,
    'message' => "INVALID INPUT! Full Name can only contain letters and spaces."
  ];
  goto end;
}

if (!filter_var($emailAddress, FILTER_VALIDATE_EMAIL)) {
  $response = [
    'response' => 103,
    'success' => false,
    'message' => "INVALID INPUT! Email address is not valid."
  ];
  goto end;
}

if (!preg_match('/^(?:\+234|0)[789][01]\d{8}$/', $phoneNumber)) {
  $response = [
    'response' => 104,
    'success' => false,
    'message' => "INVALID INPUT! Phone number format is not valid."
  ];
  goto end;
}

$query = mysqli_query($conn, "SELECT * FROM users_tab WHERE userId = '$userId'") or die(mysqli_error($conn));
if (mysqli_num_rows($query) == 0) {
  $response = [
    'response' => 404,
    'success' => false,
    'message' => "User not found."
  ];
  goto end;
}

$queryEmail = mysqli_query($conn, "SELECT emailAddress FROM users_tab WHERE emailAddress = '$emailAddress' AND userId != '$userId'") or die(mysqli_error($conn));
if (mysqli_num_rows($queryEmail) > 0) {
  $response = [
    'response' => 105,
    'success' => false,
    'message' => "This email ('$emailAddress') is already in use. Please try another Email Address."
  ];
  goto end;
}

// Update user basic info
mysqli_query($conn, "UPDATE users_tab SET 
  fullName = '$fullName', 
  emailAddress = '$emailAddress', 
  phoneNumber = '$phoneNumber'
  WHERE userId = '$userId'
") or die(mysqli_error($conn));

$allowedExts = ["jpg", "jpeg", "JPEG", "JPG", "gif", "png", "PNG", "GIF", "webp", "WEBP"];
$passportFinal = '';

if (isset($_FILES['passport']) && $_FILES['passport']['error'] != UPLOAD_ERR_NO_FILE) {
  $extension = pathinfo($_FILES['passport']['name'], PATHINFO_EXTENSION);

  if (in_array($extension, $allowedExts)) {
    // Fetch old passport and delete it
    $query =  mysqli_query($conn, "SELECT passport FROM users_tab WHERE userId='$userId'") or die(mysqli_error($conn));
    $fetchQuery = mysqli_fetch_assoc($query);
    $dbPassport = $fetchQuery['passport'];
    unlink($userProfilePixPath . $dbPassport);

    $passport = $userId . $passport;
    $uploadPath = $userProfilePixPath . $passport;
    move_uploaded_file($_FILES["passport"]["tmp_name"], $uploadPath);

    ////////Update Passport////////
    $update = "UPDATE users_tab SET passport = '$passport' WHERE userId = '$userId'";
    mysqli_query($conn, $update) or die(mysqli_error($conn));
  }
}

$response = [
  'response' => 200,
  'success' => true,
  'message' => "Record updated successfully",
  'data' => [
    'userId' => $userId,
    'fullName' => $fullName,
    'emailAddress' => $emailAddress,
    'phoneNumber' => $phoneNumber,
    'passport' => $passport
  ]
];

end:
echo json_encode($response);
?>
