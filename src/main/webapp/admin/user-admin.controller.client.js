(function () {
    var $usernameFld, $passwordFld;
    var $removeBtn, $editBtn, $createBtn;
    var $firstNameFld, $lastNameFld, $roleFld;
    var $userRowTemplate, $tbody;
    var userService = new AdminUserServiceClient();
    $(main);

    function main() {
        $usernameFld = $("#usernameFld");
        $passwordFld = $("#passwordFld");
        $firstNameFld = $("#firstNameFld");
        $lastNameFld = $("#lastNameFld");
        $roleFld = $("#roleFld");
        $userRowTemplate = jQuery('.wbdv-template');
        $tbody = jQuery('tbody');
        $createBtn = jQuery('.wbdv-create');
        $removeBtn = $('.wbdv-remove');
        $editBtn = $('.wbdv-edit');
        $createBtn.click(createUser);
        $removeBtn.click(deleteUser);
        $editBtn.click(updateUser);
        userService
            .findAllUsers()
            .then(renderUsers);
        
    }
    function createUser() { 

     }
    function findAllUsers() { 

     }
    function findUserById() { 

     }
    function deleteUser() { 

     }
    function selectUser() { 

     }
    function updateUser() { 

     }
    function renderUser(user) { 

     }
    function renderUsers(users) { 
        $tbody
     }
})();
