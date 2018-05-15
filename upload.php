<?php 
 
        /*if($_SERVER['HTTP_HOST'] != "publicz.raileurope.com"){
            require('../../wp-blog-header.php');
		  
		    if ( !current_user_can( 'administrator' ) && !current_user_can( 'editor' ) ) {
                header('Content-Type: application/json');
                header("Access-Control-Allow-Origin", "*");
	            header('HTTP/1.1 401 Unauthorized', true, 401);
			    echo "Readonly Access";
                exit;
            }
		}*/
		

?>

<?php
$target_dir = "js/data-uploads/";

	$target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);

	$uploadOk = 1;
	$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
	echo "rk uploaded==> ". $target_file;
	if(isset($_POST["submit"])) {
		$check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
		if($check !== false) {
			echo "File is an image - " . $check["mime"] . ".";
			$uploadOk = 1;
		} else {
			echo "File is not an image.";
			$uploadOk = 0;
		}
	}

?>

<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin", "*");

$json_data = "";
$target_dir = "js/data-uploads/";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
	$json_data = test_input($_POST["json_data"]);
	$base64_data = test_input($_POST["image_data"]);
	$image_name = test_input($_POST["image_name"]);
	
	echo $json_data . "<br/>" . $image_name . "<hr/>". $base64_data;
	base64_to_jpeg($base64_data, "js/data_uploads/$image_name.jpg");
	
	$t=time();
	$timestamp = date("Y-m-d.H-i-s",$t);
	
	rename( "js/data.json", "js/data.json-$timestamp" );
	rename( "js/data.json-$timestamp", "data_backup/data.json-$timestamp" );
	
	$jsonFile = fopen("js/data.json", "w") or die("Unable to open file!");
	fwrite($jsonFile, $json_data);
	fclose($jsonFile);
	
	header("HTTP/1.1 200 OK", true, 200);
}
else{
	echo "rk error";
	header('HTTP/1.1 401 Unauthorized', true, 401);
}

function test_input($data) {
  $data = trim($data);
  //$data = stripslashes($data);
  //$data = htmlspecialchars($data);
  return $data;
}

function base64_to_jpeg($base64_string, $output_file) {
    // open the output file for writing
    $ifp = fopen( $output_file, 'w+' ); 

    // split the string on commas
    // $data[ 0 ] == "data:image/png;base64"
    // $data[ 1 ] == <actual base64 string>
    $data = explode( ',', $base64_string );

    // we could add validation here with ensuring count( $data ) > 1
    fwrite( $ifp, base64_decode( $data[ 1 ] ) );

    // clean up the file resource
    fclose( $ifp ); 

    return $output_file; 
}
?>