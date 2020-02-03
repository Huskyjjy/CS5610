(function () {
    var $usernameFld, $passwordFld;
    var $removeBtn, $editBtn, $createBtn, $updateBtn; 
    var $firstNameFld, $lastNameFld, $roleFld;
    var $userRowTemplate, $tbody;
    var currentUser;
    var currentUserId;
    var userService = new AdminUserServiceClient();
    $(main);
    function createUser() { 
        var username = $usernameFld.val();
        var password = $passwordFld.val();
        var firstName = $firstNameFld.val();
        var lastName = $lastNameFld.val();
        var role = $roleFld.val();
        if (username === "" || password === "" || firstName === "" || lastName ===""){
            alert("Please enter correct user information.");
            return;
        }
        $usernameFld.val("");
        $passwordFld.val("");
        $firstNameFld.val("");
        $lastNameFld.val("");
        $roleFld.val("");
        var newUser = {
            username,
            password,
            firstName,
            lastName,
            role
        };
        currentUser = newUser;
        currentUserId = newUser._id;
        userService
            .createUser(newUser)
            .then(response => {
                findAllUsers();
            });
     }
    function findAllUsers() { 
        userService.findAllUsers()
            .then(remoteUsers => {
                let users = remoteUsers;
                renderUsers(users);
            });
    }
    function findUserById() { 
        var curr = $(event.currentTarget);
        var id = curr.parent().parent().parent().attr('id');
        return userService.findUserById(id);
    }
    function deleteUser() { 
        var curr = $(event.currentTarget);
        var id = curr.parent().parent().parent().attr('id');
        userService
            .deleteUser(id)
            .then(response => {
                findAllUsers();
            });
     }
    function selectUser() {
        findUserById().then(response => {
            currentUser = response;
            currentUserId = currentUser._id;
            $usernameFld.val(currentUser.username);
            $passwordFld.val("");
            $firstNameFld.val(currentUser.firstName);
            $lastNameFld.val(currentUser.lastName);
            $roleFld.val(currentUser.role);
        }
        );
    }
    function updateUser() { 
        var username = $usernameFld.val();
        var password = $passwordFld.val();
        var firstName = $firstNameFld.val();
        var lastName = $lastNameFld.val();
        var role = $roleFld.val();
        if (username === "" || password === "" || firstName=== "" || lastName === ""){
            alert("Please enter correct user information.");
            return;
        }
        $usernameFld.val("");
        $passwordFld.val("");
        $firstNameFld.val("");
        $lastNameFld.val("");
        $roleFld.val("");
        var newUser = {
            username,
            password,
            firstName,
            lastName,
            role
        };
        if (currentUserId == -1) {
            alert("No user exists.");
            return;
        }
        userService
            .updateUser(currentUserId, newUser)
            .then(response => {
                findAllUsers();
            })

    }
    function renderUser(user) { 
        let UserRowClone = $userRowTemplate.clone();
        UserRowClone.attr('id', user._id);
        UserRowClone.removeClass('wbdv-hidden');
        UserRowClone.find('.wbdv-username').html(user.username);
        UserRowClone.find('.wbdv-first-name').html(user.firstName);
        UserRowClone.find('.wbdv-last-name').html(user.lastName);
        UserRowClone.find('.wbdv-role').html(user.role);
        $removeBtn = UserRowClone.find('.wbdv-remove');
        $editBtn = UserRowClone.find('.wbdv-edit');
        $removeBtn.click(deleteUser);
        $editBtn.click(selectUser);
        $tbody.append(UserRowClone);
     }
    function renderUsers(users) { 
        $tbody.empty();
        for(var u in users) {
            let user = users[u];
            renderUser(user);
        }
     }
     function main() {
        $usernameFld = $("#usernameFld");
        $passwordFld = $("#passwordFld");
        $firstNameFld = $("#firstNameFld");
        $lastNameFld = $("#lastNameFld");
        $roleFld = $("#roleFld");
        currentUser = null;
        currentUserId = -1;
        $userRowTemplate = jQuery('.wbdv-template');
        $tbody = jQuery('tbody');
        $createBtn = jQuery('.wbdv-create');
        $updateBtn = $('.wbdv-update')
        $removeBtn = $('#wbdv-remove')
        $editBtn = $('#wbdv-edit')
        $createBtn.click(createUser);
        $updateBtn.click(updateUser);
        findAllUsers();
    } 
})();