let issueCount = 0;

function _actionModal(action) {
	if (action === 'open') {
		$('#modal').css('display', 'flex');
	} else {
		$('#modal').css('display', 'none');
	}
}



/// Trigger File Upload function ///
$(function () {
	userPixPreview = {
		UpdatePreview: function (obj) {
			if (!window.FileReader) {
				// Handle browsers that don't support FileReader
				console.error("FileReader is not supported.");
			} else {
				var reader = new FileReader();

				reader.onload = function (e) {
					$('#userPixPreview').prop("src", e.target.result);
				};
				reader.readAsDataURL(obj.files[0]);
			}
		},
	};
});



function _clearUserForm() {
	$('#selectUser').val('');
	$('#userId').val('');
	$('#fullName').val('');
	$('#emailAddress').val('');
	$('#phoneNumber').val('');
	$('#passport').val('');
	$('#userPixPreview').attr('src', 'images/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg');

	$('#fullName, #emailAddress, #phoneNumber, #passport').removeClass('issue');
	$('#issue_fullName, #issue_emailAddress, #issue_phoneNumber, #issue_passport').html('');
	$("#userPixPreview").removeClass("issue");
	$("#issue_passport").html("");

}

// Register user
function _registerUser() {
	if (!confirm("Are you sure you want to Register this user?")) return;

	const fullName = $('#fullName').val();
	const emailAddress = $('#emailAddress').val();
	const phoneNumber = $('#phoneNumber').val();
	const passport = $('#passport')[0].files[0];

	// Remove previous error highlights
	$('#fullName, #emailAddress, #phoneNumber, #passport').removeClass('issue');

	// Validation 
	if (!fullName) {
		_actionAlert("Provide your full name.", false);
		$('#fullName').addClass('issue');
		return;
	}
	if (!/^[A-Za-z\s]+$/.test(fullName)) {
		_actionAlert("Full Name can only contain letters and spaces.", false);
		$('#fullName').addClass('issue');
		return;
	}
	if (!emailAddress) {
		_actionAlert("Provide your email address.", false);
		$('#emailAddress').addClass('issue');
		return;
	}
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
		_actionAlert("Invalid email address.", false);
		$('#emailAddress').addClass('issue');
		return;
	}
	if (!phoneNumber) {
		_actionAlert("Provide your phone number.", false);
		$('#phoneNumber').addClass('issue');
		return;
	}
	if (!/^(?:\+234|0)[789][01]\d{8}$/.test(phoneNumber)) {
		_actionAlert("Invalid phone number format.", false);
		$('#phoneNumber').addClass('issue');
		return;
	}
	if (!passport) {
		_actionAlert("Please upload a passport photo.", false);
		$('#passport').addClass('issue');
		return;
	}

	// Prepare form data
	const formData = new FormData();
	formData.append("fullName", fullName);
	formData.append("emailAddress", emailAddress);
	formData.append("phoneNumber", phoneNumber);
	formData.append("passport", passport);

	$.ajax({
		type: "POST",
		url: endPoint + '/autosys/register',
		data: formData,
		dataType: "json",
		contentType: false,
		cache: false,
		processData: false,
		headers: { 'apiKey': apiKey },
		success: function (info) {
			if (info.success) {
				_actionAlert(info.message, true);
				_clearUserForm();
				_fetchAllUsers();
			} else {
				_actionAlert(info.message, false);
			}
		},
		error: function () {
			_actionAlert('Network error! Unable to register user.', false);
		}
	});
}


// Update user
function updateUser() {
	const userId = $('#selectUser').val();
	const fullName = $('#fullName').val().trim();
	const emailAddress = $('#emailAddress').val().trim();
	const phoneNumber = $('#phoneNumber').val().trim();
	const passport = $('#passport')[0].files[0];


	if (!userId || !fullName || !emailAddress || !phoneNumber) {
		_actionAlert("All fields are required.", false);
		return;
	}

	const formData = new FormData();
	formData.append("fullName", fullName);
	formData.append("emailAddress", emailAddress);
	formData.append("phoneNumber", phoneNumber);
	if (passport) {
		formData.append("passport", passport);
	}

	$.ajax({
		type: "POST",
		url: endPoint + "/autosys/updatei.php?userId=" + userId,
		data: formData,
		dataType: "json",
		contentType: false,
		cache: false,
		processData: false,
		headers: { 'apiKey': apiKey },
		success: function (info) {
			const success = info.success;
			const message = info.message;
			if (success) {
				_actionAlert(message, true);
				_clearUserForm();
				$('#selectUser').val('');
				_getSelectUser('selectUser');
				fetchAllUsers();
			} else {
				_actionAlert(message, false);
			}
		},
		error: function () {
			_actionAlert('Network error! Unable to update user.', false);
		}
	});
}

// Register,update user
function _submitUser() {
	issueCount = 0;

	const fullName = $("#fullName").val().trim();
	const emailAddress = $("#emailAddress").val();
	const phoneNumber = $("#phoneNumber").val();
	const passport = $("#passport")[0].files[0];
	const userId = $("#selectUser").val();
	const isUpdate = Boolean(userId);

	if (!confirm("Are you sure you want to " + (isUpdate ? "update" : "register") + " this user?")) {
		return;
	}

	$("#fullName, #emailAddress, #phoneNumber, #passport").removeClass("issue");
	$('#issue_fullName, #issue_emailAddress, #issue_phoneNumber, #issue_passport').html('');

	// === VALIDATIONS ===
	if (!fullName) {
		$("#fullName").addClass("issue");
		$('#issue_fullName').html('USER ERROR! Kindy provide fullname to continue');
		issueCount++;
	}
	
	if (!emailAddress) {
		$("#emailAddress").addClass("issue");
		$('#issue_emailAddress').html('USER ERROR! Kindy provide emailAddress to continue');
		issueCount++;
	} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
		$("#emailAddress").addClass("issue");
		$('#issue_emailAddress').html('USER ERROR! Email address format is not valid');
		issueCount++;
	}

	if (!phoneNumber) {
		$("#phoneNumber").addClass("issue");
		$('#issue_phoneNumber').html('USER ERROR! Kindy provide phone number to continue');
		issueCount++;
	} else if (!/^(?:\+234|0)[789][01]\d{8}$/.test(phoneNumber)) {
		$("#phoneNumber").addClass("issue");
		$('#issue_phoneNumber').html('USER ERROR! Phone number format is not valid');
		issueCount++;
	}


	if (!passport && !isUpdate) {
		$("#userPixPreview").addClass("issue");
		$("#issue_passport").html("USER ERROR! Kindly upload a profile picture to continue");
		issueCount++;
	}

	if (issueCount > 0) {
		return;
	}

	// === FORM DATA ===
	const formData = new FormData();
	formData.append("fullName", fullName);
	formData.append("emailAddress", emailAddress);
	formData.append("phoneNumber", phoneNumber);
	if (passport) {
		formData.append("passport", passport);
	}
	if (isUpdate) {
		formData.append("userId", userId);
	}

	const apiEndPoint = isUpdate
		? `${endPoint}/autosys/updatei?userId=${userId}`
		: `${endPoint}/autosys/register`;

	const successMsg = isUpdate ? "User updated successfully!" : "User registered successfully!";
	const errorMsg = isUpdate
		? "An error occurred while updating user."
		: "An error occurred while registering user.";

	// === AJAX REQUEST ===
	$.ajax({
		type: "POST",
		url: apiEndPoint,
		data: formData,
		dataType: "json",
		contentType: false,
		cache: false,
		processData: false,
		headers: {
			apiKey: apiKey,
		},
		success: function (info) {
			const success = info.success;
			const message = info.message;

			if (success === true) {
				_actionAlert(successMsg, true);
				_clearUserForm();
				$('#selectUser').val('');
				$('#searchList_selectUser').empty();
				_getSelectUser('selectUser');
				fetchAllUsers();
			} else {
				_actionAlert(message || "Operation failed. Please try again.", false);
			}
		},
		error: function () {
			_actionAlert(errorMsg + " Please try again.", false);
		},
	});
}


// Fetch user details
function _fetchUser() {
	const userId = $('#selectUser').val();

	if (!userId) {
		_actionAlert("Please select a user to fetch.", false);
		return;
	}

	$.ajax({
		type: "GET",
		url: endPoint + '/autosys/fetch?userId=' + userId,
		dataType: "json",
		headers: { 'apiKey': apiKey },

		success: function (info) {
			const success = info.success;
			const message = info.message;
			const fetch = info.data[0];

			if (success) {
				const fullName = fetch.fullName;
				const emailAddress = fetch.emailAddress;
				const phoneNumber = fetch.phoneNumber;
				const documentStoragePath = fetch.documentStoragePath;
				const passport = fetch.passport;

				$('#fullName').val(fullName);
				$('#emailAddress').val(emailAddress);
				$('#phoneNumber').val(phoneNumber);
				$("#userPixPreview").attr("src", documentStoragePath +'/'+passport);
			} else {
				_actionAlert(message, false);
			}
		},
		error: function () {
			_actionAlert('Network error! Unable to fetch user.', false);
		}
	});
}


// get user details
function _getSelectUser(fieldId) {
	try {
		$.ajax({
			type: "GET",
			url: endPoint + "/autosys/fetch",
			dataType: "json",
			cache: false,
			headers: {
				'apiKey': apiKey
			},
			success: function (info) {
				const data = info.data;
				const success = info.success;

				if (success === true) {
					for (let i = 0; i < data.length; i++) {
						const id = data[i].userId;
						const value = data[i].fullName;
						$('#searchList_' + fieldId).append('<li onclick="_clickOption(\'searchList_' + fieldId + '\', \'' + id + '\', \'' + value + '\');">' + value + '</li>');
					}
				} else {
					_actionAlert(info.message, false);
				}
			}
		});
	} catch (error) {
		console.error("Error: ", error);
		_actionAlert('An unexpected error occurred. Please try again.', false);
	}
}


// fetchAll user
function fetchAllUsers() {
	$.ajax({
		type: "GET",
		url: endPoint + '/autosys/fetch',
		dataType: "json",
		headers: { 'apiKey': apiKey },

		success: function (info) {
			const success = info.success;
			const message = info.message;
			const data = info.data;

			if (success && Array.isArray(data)) {
				let rows = "";

				data.forEach(function (user, index) {
					rows += `
						<tr>
							<td>${index + 1}</td>
							<td>${user.userId}</td>
							<td>${user.fullName}</td>
							<td>${user.emailAddress}</td>
							<td>${user.phoneNumber}</td>
							<td><img src="${user.passport}" width="60" alt="Passport" onerror="this.src='images/default.jpg'"></td>
						</tr>
					`;
				});

				$('#autoBreakdownBody').html(rows);
			} else {
				_actionAlert(message || 'No users found.', false);
			}
		},
		error: function () {
			_actionAlert('Network error! Unable to fetch users.', false);
		}
	});
}


// Delete user
function deleteUser() {
	const userId = $('#selectUser').val();

	if (!userId) {
		_actionAlert("Please select a user to delete.", false);
		return;
	}

	if (!confirm("Are you sure you want to delete this user?")) return;

	$.ajax({
		type: "GET",
		url: endPoint + '/autosys/delete?userId=' + userId,
		dataType: "json",
		headers: { 'apiKey': apiKey },
		success: function (info) {
			const success = info.success;
			const message = info.message;

			if (success === true) {
				_actionAlert(message, true);

				// Clear the form and reset the user selection
				_clearUserForm();
				$('#searchList_selectUser').empty()
				$('#selectUser').val('');
				_getSelectUser('selectUser');
				_fetchAllUsers();
			} else {
				_actionAlert(message, false);
			}
		},
		error: function () {
			_actionAlert('Network error! Unable to delete user.', false);
		}
	});
}






