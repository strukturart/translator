
$(document).ready(function() 
 {


	//Global Vars
	var windowOpen = false;
	var i = 0;
	var z = -1;
	var finderNav_tabindex = -1;
	var app_list_filter_arr = [];
	var list_all = false;
	var debug = true;
	var page = 0;
	var pos_focus = 0
	var languages = [];
	var dir_level = 0;
	var window_stat;
	var items = 0;
	var lang;

	var api_url = "https://glosbe.com/gapi/tm?from=pol&dest=eng&format=json&phrase=borsuk&page=1&pretty=true"




$("div#window-status").text(windowOpen);



////////////////////
//NOTFICATION//////
//////////////////



function notify(param_title,param_text,param_silent) {

	  var options = {
      body: param_text,
      silent: param_silent
  }
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
     var notification = new Notification(param_title,options);

  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var notification = new Notification(param_title,options);


      }
    });
  }

}




	/////////////////////////////
	//////FINDER////////////////
	///////////////////////////



	function finder()
	{

	var finder = new Applait.Finder({ type: "sdcard", debugMode: true });


		finder.on("empty", function (needle) 
		{
			$('div#intro div').text("no sd-card found")
			return;
		});

		finder.search("translator.json");



		finder.on("searchComplete", function (needle, filematchcount) {
    	if(this.filematchcount == 0)
    	{
			$('div#intro div').text("translator.json not found")
    	}
    	else
    	{
    		$('div#intro').css("display","none")
    		showFinder();
    	}
		});







		finder.on("fileFound", function (file, fileinfo, storageName) 
		{

			var reader = new FileReader()


			reader.onerror = function(event) 
					{
						alert('shit happens')
						reader.abort();
					};

					reader.onloadend = function (event) 
					{

							search_result = event.target.result
							
							//check if json valid
							var printError = function(error, explicit) {
							console.log("[${explicit ? 'EXPLICIT' : 'INEXPLICIT'}] ${error.name}: ${error.message}");
							}

							try {
							   
							} catch (e) {
							    if (e instanceof SyntaxError) {
							        alert("Json file is not valid");
							        return;
							    } else {
							        
							    }

							}
									var data = JSON.parse(search_result);
									

									$.each(data, function(i, item) {
										if(item.languages)
										{


											for(var i = 0; i < item.languages.length; i++)
											{
												var lang_0 = item.languages[i].lang_0
												var lang_1 = item.languages[i].lang_1
												var lang_txt = item.languages[i].lang
												$("div#finder ul").append("<li data-lang-0='"+lang_0+"' data-lang-1='"+lang_1+"' data-lang='"+lang_txt+"'>"+lang_txt+"</li>")
											}
											

										}
										
										

										
									
									
								
									});




set_tabindex()
				


					};
					reader.readAsText(file)
				});


	}	


finder()


function showFinder()
{
	$("div#finder").css("display","block")
	$("div#main").css("display","none")
	window_stat = "finder"
	set_tabindex()
		

	


	
}

function showMain()
{
	
		$("div#finder").css("display","none")
		$("div#main").css("display","block")
		window_stat = "main"
		$("div#main input").focus();
	
}



////////////////////////
//NAVIGATION
/////////////////////////



	function nav (move) {

		
		if(move == "+1")
		{
			pos_focus++


			if(pos_focus <= items.length)
			{

				$('li[tabindex='+pos_focus+']').focus()
			}	

			if( pos_focus == items.length)
			{
				pos_focus = 0;
				$('li[tabindex=0]').focus()

				  
			}


		}

		if(move == "-1")
		{
			pos_focus--
			if( pos_focus >= 0)
			{
				
				$('li[tabindex='+pos_focus+']').focus()

			}

			if(pos_focus == -1)
			{
				pos_focus = items.length-1;
				
				$('li[tabindex='+pos_focus+']').focus()

			}
		}


	}



function set_tabindex()
{
		items = $('div#finder ul > li');
		for(var i =0; i < items.length; i++)
		{
			$(items[i]).attr('tabindex',i) 
			pos_focus = 0
			$('div#finder ul').find('li[tabindex=0]').focus();
		}

}













////////////////////
////GEOLOCATION/////
///////////////////

function select_language()
{
	if(window_stat == "finder")
	{
	//$('div#finder ul').find('li[tabindex=0]').focus();
	

		
	var selected_button = $(":focus")[0];
	current_lng = selected_button.getAttribute('data-lang-0');
	current_lng = selected_button.getAttribute('data-lang-1');
	lang = selected_button.getAttribute('data-lang');
	//alert(lang)
	$("div#bottom-bar div#lang").text(lang)


	showMain();
	}
	


	
}






function sendRequest()
{
	if(window_stat == "main")
	{   
		var request_url = api_url;
		var jqxhr = $.getJSON(request_url, function(data) {

		}).done(function(data) {
			 alert(data)
		})
		.fail(function() {
			alert("error")
		})
		.always(function() {
		});
	}

}




	//////////////////////////
	////KEYPAD TRIGGER////////////
	/////////////////////////
function handleKeyDown(evt) 

{	

	switch (evt.key) 
	{
		case 'Enter':
			select_language();
			sendRequest();
			evt.preventDefault();

		break;

		case 'Backspace':
		
		
		break; 

		case 'SoftLeft':
			showFinder()
		break; 

		case 'ArrowDown':
			nav("+1")
		break; 

		case 'ArrowUp':
			nav("-1")
		break; 

		

		

	}
}







	document.addEventListener('keydown', handleKeyDown);


	//////////////////////////
	////BUG OUTPUT////////////
	/////////////////////////

if(debug == true)
{
	$(window).on("error", function(evt) {

	console.log("jQuery error event:", evt);
	var e = evt.originalEvent; // get the javascript event
	console.log("original event:", e);
	if (e.message) { 
	    alert("Error:\n\t" + e.message + "\nLine:\n\t" + e.lineno + "\nFile:\n\t" + e.filename);
	} else {
	    alert("Error:\n\t" + e.type + "\nElement:\n\t" + (e.srcElement || e.target));
	}
	});

}




});

