<?php include 'config/config.php'; ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">

<head>
   <title><?php echo $appName ?></title>
   <?php include 'meta.php'; ?>
   <meta name="keywords" content="ABCC parent portal, Advanced Breed Group Of Schools parent portal, Advanced Breed Group Of Schools portal" />
   <meta name="description" content="Your Child's Education is at Your Fingertips!" />
</head>

<body>
   <?php include 'alert.php'; ?>
   <section class="main-div">
      <div class="main-back-div">

         <header>
            <div class="main-header">
               <div class="logo-links">
                  <img src="<?php echo $websiteUrl ?>/images/logo.png" class="logo">
               </div>
               <nav>
                  <ul>
                     <li><a href="#" title="HOME">Home</a></li>
                     <li><a href="#" title="VIEW RECORD" onclick="_actionModal('open')">View Record</a></li>
                  </ul>
               </nav>
            </div>
         </header>

         <div class="form-section">
            <div class="form-back-top">
               <div class="form-group">
                  <div class="text_field_container" id="selectUser_container">
                     <script>
                        selectField({
                           id: 'selectUser',
                           title: 'Select User'
                        });
                        _getSelectUser('selectUser')
                     </script>
                  </div>
               </div>
               <div class="button-group">
                  <button class="fetch-btn" onclick="_fetchUser()" title="SAVE">Fetch</button>
                  <button class="delete-btn" onclick="deleteUser()" title="DELETE">Delete</button>
               </div>
            </div>

            <div class="form-back-down">
               <div class="form-left">

                  <h3>Registration</h3>

                  <div class="text_field_container" id="fullName_container" title="Field for full name">
                     <script>
                        textField({
                           id: 'fullName',
                           title: 'Enter Full Name'
                        });
                     </script>
                  </div>

                  <div class="text_field_container" id="emailAddress_container" title="Field for email address">
                     <script>
                        textField({
                           id: 'emailAddress',
                           title: 'Enter Email address'
                        });
                     </script>
                  </div>

                  <div class="text_field_container" id="phoneNumber_container" title="Field for phone number">
                     <script>
                        textField({
                           id: 'phoneNumber',
                           title: 'Eneter Phone number'
                        });
                     </script>
                  </div>

                  <div class="form-buttons">
                     <button class="btn save" onclick="_submitUser()" title="SUBMIT">Submit</button>
                     <button class="btn clear" onclick="_clearUserForm()" title="CLEAR">Clear</button>
                  </div>
               </div>
               <div class="form-right">
                  <h3>Profile Picture</h3>
                  <label>
                     <div class="profile-pic">
                        <img id="userPixPreview" src="images/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg" alt="">
                        <input type="file" id="passport" style="display:none" accept=".jpg, .jpeg, .png, .gif, .bmp, .tiff, .webp, .svg, .avif" onchange="userPixPreview.UpdatePreview(this);" />
                        <div class="overlay">Click To Change</div>
                        <div id="issue_passport" class="issue-text"></div>
                  </label>
               </div>
            </div>
         </div>
      </div>

      <!-- Modal for User Record -->
      <div class="auto-back-div" id="modal">
         <div class="auto-back-div-in">
            <div class="auto-details">
               <div class="auto-details-header">
                  <h2>User Record</h2>
                  <button onclick="_actionModal('close')" title="CLOSE">Close</button>
               </div>
            </div>
            <div class="auto-repay-div">
               <div class="table-wrapper">
                  <div class="table-scroll">
                     <table id="autoBreakdown">
                        <thead>
                           <tr>
                              <th>S/N</th>
                              <th>User ID</th>
                              <th>Full Name</th>
                              <th>Email Address</th>
                              <th>Phone Number</th>
                              <th>Passport</th>
                           </tr>
                        </thead>
                        <tbody id="autoBreakdownBody">

                           <script>
                              fetchAllUsers();
                           </script>
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
         </div>
      </div>

   </section>
</body>


</html>