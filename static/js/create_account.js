let validated = false;

$(document).ready(function () {
    $("form").submit(function (e) {
        if (!validated){
            e.preventDefault();
            let formData = {
                "name": $("#name").val(),
                "phoneNumber": $("#phoneNumber").val(),
                "email": $("#email").val(),
                "password": $("#password").val(),
                "confirm-password": $("#confirm-password").val()
            };

            if (formData["password"] !== formData["confirm-password"]) {
                window.location.replace("/create_account?error=" + encodeURIComponent("Passwords do not match!"));
                return;
            }
            validated = true;
            $("form").submit();
        }
    });
});