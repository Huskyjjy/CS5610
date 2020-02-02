(function () {
    // declare
    var $usernameFld, $passwordFld;
    var $removeBtn, $editBtn, $createBtn, $updateBtn; 
    var $firstNameFld, $lastNameFld, $roleFld;
    var $userRowTemplate, $tbody; 
    var curUserId;
    var curUser;
    var userCollection;
    
    var userService = new AdminUserServiceClient(); // instantiate 
    $(main);

    // executes on document load, when the browser is done parsing the html page and the DOM is ready
    function main() {
        // actual binding
        // retrieve the DOM elements needed later in the controller - the form elements
        $usernameFld = $("#usernameFld");
        $passwordFld = $("#passwordFld");
        $firstNameFld = $("#firstNameFld");
        $lastNameFld = $("#lastNameFld");
        $roleFld = $("#roleFld");

        curUserId = -1;
        curUser = null;
        userCollection = null;
        
        // retrieve the DOM elements needed later in the controller - templates
        $userRowTemplate = $(".wbdv-template"); // a reference to it in memory
        $tbody = $('.wbdv-tbody');

        // retrieve the DOM elements needed later in the controller - action icons
        $createBtn = $(".wbdv-create");
        $updateBtn = $(".wbdv-update");
        $editBtn = $("#wbdv-edit");
        $removeBtn = $("#wbdv-remove");

        // bind event handlers to the "click" JavaScript event; event handler: a function to execute each time the event is triggered
        $createBtn.click(createUser); // must bind here!! this format is OK, or click(() => createUser())
        $updateBtn.click(updateUser); // must bind here

        findAllUsers(); // the initial state is the table only has table head, template row is not shown
    }

    // implement the following event handlers:

    // handle create user event when user clicks on plus icon
    function createUser() { 
        // read from the form elements
        var username = $usernameFld.val(); // val() as a getter: get the current value of the first element in the set of matched elements
        $usernameFld.val("");
        var password = $passwordFld.val(); 
        $passwordFld.val("");
        var firstName = $firstNameFld.val();
        // console.log(firstName);
        $firstNameFld.val("");
        var lastName = $lastNameFld.val();
        $lastNameFld.val("");
        var role = $roleFld.val();
        // console.log(role);
        $roleFld.val(""); // check: or choose a default value?

        // checks for empty field
        if (username === "" || password === "" || firstName === "" || lastName === "" || role === null) { // there is a difference between the return value of val() of <input> and <select>! if the field is not filled in, val() of <input> will return an empty string(""), while val() of <select> will return null! But if filled in, val() of both elements will return a string!  
            alert("invalid input!");
            return;
        }

        // creates a user object
        var newUser = {
            username,
            password,
            firstName,
            lastName,
            role
        };

        userService.createUser(newUser) // use the user service createUser() function to create the new user
            .then(new_user => {
                findAllUsers(); // re-render / refresh
            }); // finally, update the list of users on server response; this findAllUsers() refers to the function in controller!
    }

    // called whenever a particular user needs to be retrieved by their id, as in when a user is selected for editing
    // search for a specific user from the array of users that you already have
    function findUserById() {  
        // identifies the current target (DOM element) for the event  
        var editBtn = $(event.currentTarget); 
        // event bubbling - read the user id from the icon id attribute / access a specific row by accessing 
        // the class or ID of the tr which has each row / move up the tags until you find the <tr> tag for that row
        var userId = editBtn
                        .parent() // traverses to the immediate parent, only travels a single level up the DOM tree. Since we do not supply a selector expression, the parent element is unequivocally included as part of the object.
                        .parent()
                        .parent()
                        .attr('id'); // attr(): get the value of an attribute for the first element in the set of matched elements
        curUserId = userId;
        
        // return a promise
        return userService.findUserById(userId); // use user service findUserById() to retrieve/fetch a user from the server     
    }

    // accepts a user object as parameter and updates the form with the user properties, i.e. render a single 
    // user like in the case of adding 1 new user to the already existing list of users
    function renderUser(user) {  
        curUser = user;

        $usernameFld.val(user.username);
        $passwordFld.val(""); // for security reason, the password field in edit information should be empty when user tries to edit profile
        // console.log(user.password);
        $firstNameFld.val(user.firstName);
        $lastNameFld.val(user.lastName);
        $roleFld.val(user.role);
    }
    
    // select a particular user from the displayed list and populate its values in the top user form row for editing
    // clicking the edit button for each row is basically selecting that user to be edited
    // fetch a single user from the server by id and updated the form element for editing
    function selectUser() { 
        findUserById().then(user => { 
            // then updates the form on server response / update the form element for editing / fill in the info
            // fill the top input form with the existing information of the user; setter
            renderUser(user);
            // $usernameFld.val(user.username);
            // $passwordFld.val(""); // for security reason, the password field in edit information should be empty when user tries to edit profile
            // // console.log(user.password);
            // $firstNameFld.val(user.firstName);
            // $lastNameFld.val(user.lastName);
            // $roleFld.val(user.role);
        });   
    }

    // the checkbox on the top form allows for the update function to be called with the updated values for that user
    function updateUser() { 
        // access each column of the row which is each input element
        var username = $usernameFld.val();
        $usernameFld.val(""); // clear
        var password = $passwordFld.val();
        $passwordFld.val("")
        var firstName = $firstNameFld.val();
        $firstNameFld.val("");
        var lastName = $lastNameFld.val();
        $lastNameFld.val("");
        var role = $roleFld.val(); // get the value from a dropdown select directly
        // console.log(role);
        $roleFld.val("");

        // check for empty field and update if it is populated by user. Ideally there should be a verification field also 
        if (username === "" || firstName === "" || lastName === "") { 
            alert("invalid input!");
            return;
        }
        // if password field is still empty (not filled by customer), then keep the old password 
        if (password === "") {
            password = curUser.password; 
        }

        // creates a user object
        var updatedUser = {
            username,
            password,
            firstName,
            lastName,
            role
        };

        // updating could essentially be thought as selecting a user + creating. (but not really because the id already exists)
        userService.updateUser(curUserId, updatedUser)
            .then(newUser => {
                findAllUsers();
            });     
    }

    // handles delete user event when user clicks the cross icon
    function deleteUser() { 
        var removeBtn = $(event.currentTarget);
        // event bubbling - read the user id from the icon id attribute
        var userId = removeBtn.parent().parent().parent().attr('id'); 

        userService.deleteUser(userId) // use user service deleteUser() to send a delete request to the server
            .then(() => {
                findAllUsers();
            }); // update user list on server response; then() 不一定要 specify the arg (i.e. the promise)!
    }

    // called whenever the list of users needs to be refreshed
    function findAllUsers() {   
        userService.findAllUsers() // use user service findAllUsers() to retrieve all the users and passes response to renderUsers
            .then(users => { 
                userCollection = users;
                // console.log(users); // at first: []
                // console.log("hello");
                renderUsers(users);
            }); 
    }

    // render a list of users to the webpage
    function renderUsers(users) { // users is a JS array / accepts an array of user instances
        // clears the current content of the table body
        $tbody.empty(); // -> <tbody class="wbdv-tbody"></tbody>; remove all child nodes of the matched element from the DOM

        // iterates over the array of users
        for (var i = 0; i < users.length; i++) { 
            var user = users[i];
            
            // clones a table row template for each user instance; check: didn't use its invisibile class?
            var rowClone = $userRowTemplate.clone(); // clone performs a deep copy of the set of matched elements; why the template row still exists and can be accessed? It gets saved in the variable! (it is a reference, not a copy: the template row keeps living in memory, empty() just removes it from the DOM)

            // encode the ID on the DOM somewhere and then read it back by adding it to the <tr>’s ID attribute and then read it back with JQuery
            rowClone.attr('id', user._id); // set one or more attributes for every matched element, attr can be either a getter or a setter!

            // populate the table row with the user object properties
            rowClone.find('.wbdv-username').html(user.username); // html: set the HTML contents of every matched element
            // password will be hidden on the web page, but is saved in the server
            rowClone.find('.wbdv-first-name').html(user.firstName);
            rowClone.find('.wbdv-last-name').html(user.lastName);
            rowClone.find('.wbdv-role').html(user.role); 

            // bind event handlers to the "click" JavaScript event - must bind here in renderUsers(), as only 
            // when the row renders/shows can we find the two buttons and address them!
            rowClone.find('#wbdv-remove').click(deleteUser); 
            rowClone.find('#wbdv-edit').click(selectUser);

            // add the table row to the table body
            $tbody.append(rowClone); // append: Insert content, specified by the parameter, to the end of the tbody element
        }
    }

})();
