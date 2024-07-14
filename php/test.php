<?php

$to_email = "daetjasmin10@gmail.com";
$subject = "Send email via PHP";
$body = "hi test";
$headers = "From: glamtechsia@gmail.com";

if (mail($to_email, $subject,$body,$headers)){
    echo "Email successfully sent to $to_email...";
}else{
    echo "Email sending failed...";
}



?>