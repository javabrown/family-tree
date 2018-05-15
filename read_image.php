<?php
if($_SERVER["REQUEST_METHOD"] == "GET"){
	if($_GET["image_name"] != null) {
	   $image_name = $_GET["image_name"];
	   
	   $path = "js/data_uploads/$image_name";
	    
	   
       $type = pathinfo($path, PATHINFO_EXTENSION);
       
	   //$data = file_get_contents($path);
	   $data = fopen($path, 'rb');
	   
	   if($data == null){ //return unknown when no image found 
		   //$data = file_get_contents('js/data_uploads/unknown.jpg'); 
		   $data = fopen('js/data_uploads/unknown.jpg', 'rb');
	   }
	    
	   //echo "<img src='$base64'/>";
	   //echo $base64;
	   // send the right headers
       header("Content-Type: image/jpg");
       header("Content-Length: " . filesize($path));
       
       // dump the picture and stop the script
       fpassthru($data);
       exit;
	}
	else {
		echo "IMAGE_NAME parameter missing in GET URL. Sample upload.php?image_name=image-name.jpg";
	}
	header("HTTP/1.1 200 OK", true, 200);
}
else{
	echo "bad request";
	header('HTTP/1.1 401 Unauthorized', true, 400);
}
?>