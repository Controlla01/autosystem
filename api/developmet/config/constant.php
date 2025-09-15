<?php
$appName = "Autosystem";
$appDescription = "This is Autosystem, a system for managing user data and profiles.";
$apiKey = isset($_SERVER['HTTP_APIKEY']) ? $_SERVER['HTTP_APIKEY'] : null;
$expectedApiKey = '26d44a89-6692-427d-8875-1a4f6ed1ad7d';

$websiteUrl = "http://localhost/autosystem";
$documentStoragePath = $websiteUrl . "/api/uploaded-files/dev";
$userProfilePixPath = '../../uploaded-files/dev/user-pics/';

///// check for API security
$checkBasicSecurity = true;
if ($apiKey != $expectedApiKey) {
  $response = [
    'response' => 401,
    'success' => false,
    'message' => 'SECURITY ACCESS DENIED! You are not allowed to execute this command due to a security breach.'
  ];
  $checkBasicSecurity = false;
}
