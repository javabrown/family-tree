this.addEventListener("load", loadJSON(initializeD3System), true);
 
var root;
var selected_node_for_edit;

function loadJSON(callback) {
		var xobj = new XMLHttpRequest();
		
		xobj.overrideMimeType("application/json");
		//xobj.open('GET', 'js/data.json', true);
		xobj.open('GET', 'read_json.php', true);
		xobj.onreadystatechange = function () {
			  if (xobj.readyState == 4 && xobj.status == "200") {
				//jsonString = encrypt(xobj.responseText);
				callback(JSON.parse(xobj.responseText));
			  }
		};
		xobj.send(null);  
}

function initializeD3System(data) {
		var margin = {top: 30, right: 130, bottom: 30, left: 230},
			width = 1260 - margin.right - margin.left,
			height = 800 - margin.top - margin.bottom;

		var i = 0,
	    duration = 750;
		//root;

		var tree = d3.layout.tree().size([height, width]);
 
		var diagonal = d3.svg.diagonal()
			.projection(function(d) { return [d.y, d.x]; });

		var svg = d3.select("body").append("svg")
			.attr("width", width + margin.right + margin.left)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		root = data;
		root.x0 = height / 2;
		root.y0 = 0;

		function collapse(d) {
		  if (d.children) {
			d._children = d.children;
			d._children.forEach(collapse);
			d.children = null;
		  }
		}

		root.children.forEach(collapse);
		update(root);

		function update(source) {

		  // Compute the new tree layout.
		  var nodes = tree.nodes(root).reverse(),
			  links = tree.links(nodes);

		  // Normalize for fixed-depth.
		  nodes.forEach(function(d) { d.y = d.depth * 190; });
 
		  // Update the nodes…
		  var node = svg.selectAll("g.node")
			  .data(nodes, function(d) { return d.id || (d.id = ++i); });

		  // Enter any new nodes at the parent's previous position.
		  var nodeEnter = node.enter().append("g")
			  .attr("class", "node")
			  .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
			  .on("click", click)
			  .on("dblclick", dblclick)
			  .on("dblclick.zoom", dblclick);
			  
		  // add picture
		  nodeEnter
			.append('defs')
			.append('pattern')
			.attr('id', function(d,i){
			  return 'pic_' + d.husband;
			})
			.attr('height',60)
			.attr('width',60)
			.attr('x',0)
			.attr('y',0)
			.append('image')
			.attr('xlink:href',function(d,i){
			  return d.photo;
			})
			.attr('height',60)
			.attr('width',60)
			.attr('x',0)
			.attr('y',0);

		  nodeEnter.append("circle")
			  .attr("r", 1e-6)
			  .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });
			
		  var g = nodeEnter.append("g");
		  
		  g.append("text")
			  .attr("x", function(d) { return d.children || d._children ? -35 : 35; })
			  .attr("dy", "1.35em")
			  .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
			  .text(function(d) { return d.husband; })
			  .style("fill-opacity", 1e-6);
			  
			//RK**As per request from Khiyum Saheb, removed spouse name from Tree  
			/*g.append("text")
			  .attr("x", function(d) { return d.children || d._children ? -35 : 35; })
			  .attr("dy", "2.5em")
			  .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
			  .text(function(d) { return d.wife; })
			  .style("fill-opacity", 1e-6);*/

		  // Transition nodes to their new position.
		  var nodeUpdate = node.transition()
			  .duration(duration)
			  .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
          
		  //var husband = d['photo'];//d.husband.replace(/ /g,"_");
		  
		  nodeUpdate.select("circle")
			  .attr("r", 25)
			  .style("fill", function(d,i){//alert( d.photo + " <==> " + d.husband);
				return 'url(#pic_' + d.husband  +')'; 
			  });
			  
		  nodeUpdate.selectAll("text").style("fill-opacity", 1);

		  // Transition exiting nodes to the parent's new position.
		  var nodeExit = node.exit().transition()
			  .duration(duration)
			  .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
			  .remove();

		  nodeExit.select("circle")
			  .attr("r", 1e-6);

		  nodeExit.select("text")
			  .style("fill-opacity", 1e-6);

		  // Update the links…
		  var link = svg.selectAll("path.link")
			  .data(links, function(d) { return d.target.id; });

		  // Enter any new links at the parent's previous position.
		  link.enter().insert("path", "g")
			  .attr("class", "link")
			  .attr("d", function(d) {
				var o = {x: source.x0, y: source.y0};
				return diagonal({source: o, target: o});
			  });

		  // Transition links to their new position.
		  link.transition()
			  .duration(duration)
			  .attr("d", diagonal);

		  // Transition exiting nodes to the parent's new position.
		  link.exit().transition()
			  .duration(duration)
			  .attr("d", function(d) {
				var o = {x: source.x, y: source.y};
				return diagonal({source: o, target: o});
			  })
			  .remove();

		  // Stash the old positions for transition.
		  nodes.forEach(function(d) {
			d.x0 = d.x;
			d.y0 = d.y;
			d.y = d.depth * 180; 
		  });
		}

		 var pressTimer;
		 var clickCount = 0;
		// Toggle children on click.
		function click(d) {
		  //Mobile Double Click Fix -begin-
		  setTimeout(function(){
			  if(clickCount==2){
				  //alert(clickCount);
				  dblclick(d)
			   }
			  clickCount=0;
		  }, 300);
			  
	      clickCount++;
		  //Mobile Double Click Fix -end-
		  
		  //g.classed('pulse', true);
		  if (d.children) {
			d._children = d.children;  
			d.children = null;
		  } else {
			closeSiblings(d);
			d.children = d._children;
			d._children = null;
		  }
		  update(d);
		}

		function dblclick(d) { 
	     selected_node_for_edit = d;
		 selectNodeAndLaunchModel();
		} 		
		
		
        function closeSiblings(d) {
            if (!d.parent) return; // root case
            d.parent.children.forEach(function(d1) {
                if (d1 === d || !d1.children) return;
                d1._children = d1.children;
                d1.children = null;
				
				//d1.classed('pulse', false);
            });
        }
	
}

/********************MEMBER EDIT CODE BEGIN*************************************/
var action = 'EDIT_MEMBER'; //POSSIBLE VAL= EDIT_MEMBER or ADD_NEW

function selectNodeAndLaunchModel(){
	var d = selected_node_for_edit;
	
	$("#name").val(d['husband']);
	$("#spause_name").val(d['wife']);
	$("#email").val(d['email']);
	$("#phone").val(d['phone']);
	$("#bio_data").val(d['bio_data']);
	//$('#img-upload').attr('src', d['photo']);
	//$('#img-upload').attr('src', 'read_image.php?image_name=' + d['photo']);
	$('#img-upload').attr('src', d['photo']);
	console.log(d['photo']);
	selected_node = d;
	
	disableInputFields(true);
	$('#myModal').modal({backdrop:false});
}

function disableInputFields(flag){
	$("#name").attr('disabled', flag);
	$("#spause_name").attr('disabled', flag);
	$("#email").attr('disabled', flag);
	$("#phone").attr('disabled', flag);
	$("#bio_data").attr('disabled', flag);
	$('#imgInp').attr('disabled', flag);
	$("#save_btn").attr('disabled', flag);
	
	if(flag){
       $(".upload_image_control").hide(); 
	}
	else {
       $(".upload_image_control").show();
	}
}

function clearInputFields(){
	$("#name").val('');
	$("#spause_name").val('');
	$("#email").val('');
	$("#phone").val('');
	$("#bio_data").val('');	
	$('#img-upload').attr('src', '');
}

function doEditSelectedMember(){
	action = 'EDIT_MEMBER';
	disableInputFields(false);
	return;
}

function doAddNewMember(){
	action = 'ADD_NEW';
	disableInputFields(false);
	clearInputFields();
}

function encrypt(data){
   return CryptoJS.AES.encrypt(data, "Secret Passphrase");
}

function decrypt(encrypted_data){
    return decrypted = CryptoJS.AES.decrypt(encrypted_data, "Secret Passphrase");
}

function replacer(key,value)
{
    if (key=="depth") return undefined;
    else if (key=="x") return undefined;
	else if (key=="x0") return undefined;
	else if (key=="y") return undefined;
	else if (key=="y0") return undefined;
	else if (key=="parent") return undefined;
    else if (key=="__proto__") return undefined;
    else if (key=="id") return undefined;
  
	//console.log(key + " ==> " + value);
	
	return value;
}


function extractUpdatedJsonFromTree(){
	var jsonString = JSON.stringify(root, replacer); //Remove tree related meta fields
	var jsonObj = JSON.parse(jsonString);
	
	(function filter(obj) { //Filter Empty children/_children
		$.each(obj, function(key, value){
			if ( (key === "_children" || key === "children")  && (value === null || value === undefined || value === '') ){
				delete obj[key];
			} else if (Object.prototype.toString.call(value) === '[object Object]') {
				filter(value);
			} else if (Array.isArray(value)) {
				value.forEach(function (el) { filter(el); });
			}
		});
	})(jsonObj);
	
	jsonString = JSON.stringify(jsonObj)
	jsonString = jsonString.replace(/"_children":/g, '"children":'); //Replace all '_children' field with 'children'
	
	return jsonString;
}
 
function get64BitImg() {
	$("#myCanvas").show();
    var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	var img = document.getElementById("img-upload");
	
	//ctx.drawImage(img, 0, 0, 100, 100 * img.height / img.width);
	//ctx.drawImage(img, 0, 0, 400, 200);
	//ctx.drawImage(img, 0, 0, img.width,    img.height,  
    //               0, 0, canvas.width, canvas.height); 
	//fitImageOn(c, img);
	
	var data = fitImageOn(c, img, ctx) //c.toDataURL("image/jpg", 0.1);
	$("#myCanvas").hide();
	return data;
}

function get64BitImg0() {
	$("#myCanvas").show();
	
	var canvas = document.getElementById('myCanvas');
	var context = canvas.getContext('2d');
	 
	var imageObj = new Image();
	imageObj.onload = function() {
       fitImageOn(canvas, imageObj, context);
	};
	
	//alert($("#img-upload").attr('src'));
    imageObj.src = $("#img-upload").attr('src');
	 
	var data = fitImageOn(canvas, imageObj, context);
	$("#myCanvas").hide();
	return  context.drawImage();
}

function fitImageOn(canvas, imageObj, context) {
	var imageAspectRatio = imageObj.width / imageObj.height;
	var canvasAspectRatio = canvas.width / canvas.height;
	var renderableHeight, renderableWidth, xStart, yStart;

	// If image's aspect ratio is less than canvas's we fit on height
	// and place the image centrally along width
	if(imageAspectRatio < canvasAspectRatio) {
		renderableHeight = canvas.height;
		renderableWidth = imageObj.width * (renderableHeight / imageObj.height);
		xStart = (canvas.width - renderableWidth) / 2;
		yStart = 0;
	}

	// If image's aspect ratio is greater than canvas's we fit on width
	// and place the image centrally along height
	else if(imageAspectRatio > canvasAspectRatio) {
		renderableWidth = canvas.width
		renderableHeight = imageObj.height * (renderableWidth / imageObj.width);
		xStart = 0;
		yStart = (canvas.height - renderableHeight) / 2;
	}

	// Happy path - keep aspect ratio
	else {
		renderableHeight = canvas.height;
		renderableWidth = canvas.width;
		xStart = 0;
		yStart = 0;
	} 
	
	context.drawImage(imageObj, xStart, yStart, renderableWidth, renderableHeight);
 
	return canvas.toDataURL();
};


function saveData() {
	disableInputFields(true);

	var imageName = $("#name").val().replace(/ /g,"_");
    var bit64imageData = get64BitImg();
	//var photoServerPath = "js/data_uploads/" + imageName + ".jpg";
	 var photoServerPath = "read_image.php?image_name="+imageName + ".jpg";
	
	if(action == 'ADD_NEW'){
	    var newNode = {"husband": $("#name").val(), "wife": "", "email": $("#email").val(), "bio_data": $("#bio_data").val(), "phone": $("#phone").val(), "photo": photoServerPath, "children": []};
		//alert(newNode);
		
		if (selected_node_for_edit.children) {
			selected_node_for_edit.children.push(newNode);
		} else {
			selected_node_for_edit.children = [newNode];
		}
 
		var jsonString = extractUpdatedJsonFromTree();
		var encrypedJsonString = encrypt(jsonString);
	    //console.log( jsonString );
		//console.log(encrypedJsonString);
		$.post("upload.php", { json_data: jsonString, image_data: bit64imageData, image_name:imageName }, function(data, status){ console.log("Data: " + data + "\nStatus: " + status); alert('saved'); });
	}
	else if(action == 'EDIT_MEMBER'){
		//alert('EDIT_MEMBER');
		selected_node_for_edit['husband'] = $("#name").val();
		//selected_node_for_edit['wife'] = $("#spause_name").val();
		selected_node_for_edit['bio_data'] = $("#bio_data").val();
		selected_node_for_edit['email'] = $("#email").val();
		selected_node_for_edit['phone'] = $("#phone").val();
		selected_node_for_edit['photo'] = photoServerPath;
		//initializeD3System.update(selected_node_for_edit);
		//alert(get64BitImg());
		
		var jsonString = extractUpdatedJsonFromTree();
	    //console.log( jsonString );
		var encrypedJsonString = encrypt(jsonString);
		console.log(encrypedJsonString);
		$.post("upload.php", { json_data: jsonString, image_data: bit64imageData, image_name:imageName }, function(data, status){ console.log("Data: " + data + "\nStatus: " + status); alert('saved'); });		
	}
	
    $('#myModal').modal('hide');		
}
/********************MEMBER EDIT CODE END*************************************/