**SETUP GUIDE**
// TODO - how to setup and run the application.

**BACKEND’s API functions**

**“/register”** (receives entered email and password)
* Runs checks on the received
  * email not to be
    * already existent in database
    * a non-email format
    * empty
    * longer than 254 characters
  * password not to be
    * shorter than 8 characters
* If the before-mentioned criteria has
  * been met:
    * Creates hashed password
    * Saves the user to the database
    * Sends an email to the registered user that includes an account confirmation link (using postmark)
  * not been met:
    * Sends frontend an error code and message containing the issue’s description to show to the user

**“/login”** (receives entered email and password)
* Runs checks on the received
  * email to exist in the database
  * password to match the one in the database (using bcrypt)
  * user to be confirmed
* If the before-mentioned criteria has
  * been met:
    * Creates a current timestamp
    * Gives the user a JWT token
    * Adds the created current timestamp to the user’s login history in the database
  * not been met:
    * Sends frontend an error code and message containing the issue’s description to show to the user

**“/confirm-account”** (receives entered email and password)
* Runs checks on the received
  * email to exist in the database
  * password to match the one in the database (using bcrypt)
* If the before-mentioned criteria has
  * been met:
    * Changes the user’s verified state in the database to be true
    * Sends frontend a success message to show to the user
  * not been met:
    * Sends frontend an error code and message containing the issue’s description to show to the user

**“/forgot-password”** (receiver entered email)
* Checks if the entered email exists in the database:
  * If the email
    * exists:
      * Creates a new password that consists of 12 random characters (numbers, letters, symbols)
      * Hashes and updates the password in the database
      * Sends an email to the user notifying them of the password change and giving them the new password (using postmark)
      * Sends frontend a success message to show to the user
    * doesn’t exist:
      * Sends frontend an error code and message containing the issue’s description to show to the user

**“/users/paginated”** (receives the amount of results per page, current page number and state)
* Gets all users from database (and reverses the received list, so the newest users are at the start of the list)
* Forwards the users to a function called paginate along with the received data
* The paginate function:
  * Calculates starting and last index using the current page number and results per page
  * If the received state is “initial”, calculates the number of pages
* Returns the specific range of users (and page number, if the page is loaded for the first time)

**“/users/delete-user”** (receives selected user id and current user email) 
* Deletes the user that matches the received user id from the database
* Sends the deleted user an email notifying them of the action
* If the deleted user email
  * matches the current user email, sends frontend message to re-route the user to the login page
  * doesn’t match the current user email, sends frontend a success message to show to the user

**“/users/:id/history/paginated”** (receives specific user id, amount of results per page, current page number and state)
* Gets the user’s history that matches the user id received and reverses the list (so the latest login times are at the start of the list)
* The paginate function:
  * Calculates starting and last index using the current page number and results per page
  * If the received state is “initial”, calculates the number of pages
* Returns the specific range of login history timestamps (and page number, if the page is loaded for the first time)
