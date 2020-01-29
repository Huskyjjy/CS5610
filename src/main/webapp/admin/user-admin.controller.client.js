(function () {
    var $usernameFld, $passwordFld;
    var $removeBtn, $editBtn, $createBtn;
    var $firstNameFld, $lastNameFld, $roleFld;
    var $userRowTemplate, $tbody;
    var userService = new AdminUserServiceClient();
    $(main);
    function createUser() { 
        let newUser = new User($usernameFld, $passwordFld, $firstNameFld, $lastNameFld, $roleFld);
        $usernameFld.val("")
        $passwordFld.val("")
        $firstNameFld.val("")
        $lastNameFld.val("")
        $roleFld.val("")
        userService
            .createUser(newUser)
            .then(response => {
                findAllUsers();
            });
     }
    function findAllUsers() { 
        userService.findAllUsers()
            .then(remoteUsers => {
                let users = remoteUsers
                renderUsers(users)
            });
    }
    function findUserById() { 
        userService.findUserById()
        
    }
    function deleteUser() { 
        let user = findUserById();
        let _id = user._id;
        userService
            .deleteUser(_id)
            .then(response => {
                findAllUsers();
            });
     }
    function updateUser() { 
        let user = findUserById()
        user.username = $usernameFld.val()
        user.firstName = $firstNameFld.val();
        user.lastName = $lastNameFld.val();
        user.password = $passwordFld.val();
        user.role = $roleFld.val();
        let _id = user.id;
        userService
            .updateUser(_id, User)
            .then(response => {
                findAllUsers();
            });
    }
    function renderUser(user) { 
        let UserRowClone = $userRowTemplate.clone();
        UserRowClone.removeClass('wbdv-hidden');
        UserRowClone.find('.wbdv-username').html(user.username);
        UserRowClone.find('.wbdv-first-name').html(user.firstName);
        UserRowClone.find('.wbdv-last-name').html(user.lastName);
        UserRowClone.find('.wbdv-role').html(user.role);
        $removeBtn = UserRowClone.find('.wbdv-remove')
        $editBtn = UserRowClone.find('.wbdv-edit')
        $removeBtn.click(deleteUser)
        $editBtn.click(updateUser)
        tbody.append(UserRowClone);
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
        $userRowTemplate = jQuery('.wbdv-template');
        $tbody = jQuery('tbody');
        $createBtn = jQuery('.wbdv-create');
        $createBtn.click(createUser);
        userService
            .findAllUsers()
            .then(remoteUsers => {
                users = remoteUsers
                renderUsers(users)
            })
    } 
    $(main);
})();
