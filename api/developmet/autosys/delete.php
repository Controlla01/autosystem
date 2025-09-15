<?php require_once '../config/connection.php'; ?>

<?php

///// check for API security
if ($apiKey != $expectedApiKey) {
  $response = [
    'response' => 100,
    'success' => false,
    'message' => 'SECURITY ACCESS DENIED! You are not allowed to execute this command due to a security breach.'
  ];
  goto end;
}

// Declaration of variables
$userId = trim($_GET['userId']);

if (empty($userId)) {
  $response = [
    'response' => 101,
    'success' => false,
    'message' => "ALL FIELDS REQUIRED! Provide a User ID."
  ];
  goto end;
}

// Check if user exists
$query = mysqli_query($conn, "SELECT passport FROM users_tab WHERE userId = '$userId'");

if (mysqli_num_rows($query) == 0) {
  $response = [
    'response' => 404,
    'success' => false,
    'message' => "User not found."
  ];
  goto end;
}


$userArray = $callclass->_getUserDetails($conn, $userId);
$fetchArray = json_decode($userArray, true);
$dbPassport = $fetchArray[0]['passport'];

unlink($userProfilePixPath . $dbPassport);

$row = mysqli_fetch_assoc($query);
$passport = $row['passport'];

// Attempt to delete record
$deleteQuery = mysqli_query($conn, "DELETE FROM users_tab WHERE userId = '$userId'");

if ($deleteQuery) {
  // Optionally delete passport file if stored
  $filePath = $userProfilePixPath . $passport;
  if (file_exists($filePath)) {
    unlink($filePath);
  }

$response = [
  'response' => 200,
  'success' => true,
  'message' => "Record deleted successfully",
  'data' => [
    'userId' => $userId
  ]
];
} else {
  $response = [
  'response' => 102,
  'success' => false,
  'message' => "Failed to delete record. Please try again.",
  'data' => [
    'userId' => $userId
  ]
  ];
}


goto end;

end:
echo json_encode($response);
?>