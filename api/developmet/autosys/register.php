<?php require_once '../config/connection.php'; ?>
<?php if (!$checkBasicSecurity) {goto end;}?>

<?php
/// Declaration of variables ///
$fullName = strtoupper(trim($_POST['fullName']));
$emailAddress = trim($_POST['emailAddress']);
$phoneNumber = trim($_POST['phoneNumber']);
$passport = $_FILES['passport']['name'];


// Validate inputs ///
validateEmptyField($fullName, 'FULL NAME');
validateEmptyField($emailAddress, 'EMAIL');
validateEmptyField($phoneNumber, 'PHONE NUMBER');

if (!filter_var($emailAddress, FILTER_VALIDATE_EMAIL)) {
  $response = [
    'response' => 104,
    'success' => false,
    'message' => "INVALID INPUT! Email address is not valid."
  ];
  goto end;
}

if ($phoneNumber === '') {
  $response = [
    'response' => 105,
    'success' => false,
    'message' => "ALL FIELDS REQUIRED! Provide Phone Number."
  ];
  goto end;
}

if (!preg_match('/^(?:\+234|0)[789][01]\d{8}$/', $phoneNumber)) {
  $response = [
    'response' => 106,
    'success' => false,
    'message' => "INVALID INPUT! Phone number format is not valid."
  ];
  goto end;
}

// Check if profile picture is empty
if (!$passport) {
  $response = [
    'response' => 107,
    'success' => false,
    'message' => 'PASSPORT REQUIRED! Check Passport and try again.'
  ];
  goto end;
}

// Check if email already exists
$query = mysqli_query($conn, "SELECT emailAddress FROM users_tab WHERE emailAddress = '$emailAddress'") or die(mysqli_error($conn));
$checkEmailExists = mysqli_num_rows($query);

if ($checkEmailExists > 0) {
  $response = [
    'response' => 110,
    'success' => false,
    'message' => "This email ('$emailAddress') is already in use. Please try another Email Address."
  ];
  goto end;
}

////////////// Get sequence //////////////////////////
$sequence = $callclass->_getSequenceCount($conn, 'USER');
$array = json_decode($sequence, true);
$no = $array[0]['no'];

/// Generate userId ////////
$userId = 'USER' . $no . date("Ymdhis");

/// Handle passport upload ///
$allowedExts = array("jpg", "jpeg", "JPEG", "JPG", "gif", "png", "PNG", "GIF", "webp", "WEBP");
$extension = pathinfo($_FILES['passport']['name'], PATHINFO_EXTENSION);

if (!in_array($extension, $allowedExts)) {
  $response = [
    'response' => 111,
    'success' => false,
    'message' => 'INVALID PICTURE FORMAT! Check the picture format and try again.'
  ];
  goto end;
}

$passport = $userId . '' . $passport;
$uploadPath = $userProfilePixPath . $passport;

if (!move_uploaded_file($_FILES["passport"]["tmp_name"], $uploadPath)) {
  $response = [
    'response' => 112,
    'success' => false,
    'message' => 'PICTURE UPLOAD ERROR! Contact your Engineer For Help'
  ];
  goto end;
}

// Insert into users_tab
mysqli_query($conn, "INSERT INTO users_tab 
  (userId, fullName, emailAddress, phoneNumber, passport, createdTime, updatedTime) VALUES 
  ('$userId', '$fullName', '$emailAddress', '$phoneNumber', '$passport', NOW(), NOW())") or die(mysqli_error($conn));

$response = [
  'response' => 200,
  'success' => true,
  'message' => "User Record created successfully",
];

///// get user
    $query = mysqli_query($conn, "SELECT userId, fullName, emailAddress, phoneNumber, passport, createdTime FROM users_tab WHERE userId = '$userId'");
    $response['data']=array();
    $fetchQuery = mysqli_fetch_assoc($query);
    $fetchQuery['documentStoragePath'] = "$documentStoragePath/user-pics";
    $response['data']=$fetchQuery;

goto end;

end:
echo json_encode($response);
?>
