<?php require_once '../config/connection.php'; ?>
<?php if (!$checkBasicSecurity) {goto end;}?>

<?php

$userId = isset($_GET['userId']) ? trim($_GET['userId']) : '';
$searchKeywords = isset($_GET['searchKeywords']) ? trim($_GET['searchKeywords']) : '';

// Search users if no userId
$userId = $_GET['userId'];
if($userId!=''){
    $userIds= "WHERE userId = '$userId'";
}

$query = mysqli_query($conn, "SELECT userId, fullName, emailAddress, phoneNumber, passport, createdTime FROM users_tab $userIds");
$queryCounts= mysqli_num_rows($query);

if ( $queryCounts == 0) {
    $response = [
        'success' => false,
        'message' => 'No users found'
    ];
    goto end;
}

$response = [
    'success' => true,
    'message' => "User Fetched Succeful"
];

$response['data']=array();
while ($fetchQuery = mysqli_fetch_assoc($query)) {
    $fetchQuery['documentStoragePath'] = "$documentStoragePath/user-pics";
    $response['data'][]=$fetchQuery;
}


end:
echo json_encode($response);
?>
