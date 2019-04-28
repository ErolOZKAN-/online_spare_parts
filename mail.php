<?php

$name = $_POST['name'];
$email = $_POST['email'];
$message = $_POST['message'];
$cart_keys = $_POST['cart_keys'];

$content = "İsim:\t" . $name . "<br>" . "Email:\t" . $email . "<br>" . "Açıklama:\t" . $message . "<br>" . "Sepet Bilgisi:\t" . "<br>" . $cart_keys;

$mail_address = 'online-parca@outlook.com';
$password = '12345qwert-';

use PHPMailer\PHPMailer\PHPMailer;

require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';


$mail = new PHPMailer(true);
$mail->Username = $mail_address;
$mail->Password = $password;

$mail->IsSMTP();

$mail->SMTPAuth = true;
$mail->Host = '	smtp.live.com';
$mail->Port = 587;

$mail->SMTPSecure = "tls";
$mail->Timeout = 80;

$mail->SetFrom($mail->Username);
$mail->AddAddress($mail_address);

$mail->CharSet = 'UTF-8';
$mail->Subject = 'Yeni Talep';
$mail->MsgHTML($content);

if ($mail->Send()) {
    echo 'Teşekkür ederiz. En kısa zamanda sizinle iletişime geçecegiz.';
} else {
    echo 'Mail gönderilirken bir hata oluştu: ' . $mail->ErrorInfo;
}

?>