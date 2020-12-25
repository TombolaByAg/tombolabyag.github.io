// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('offline.js').then(function(registration) {
      // Registration was successful
      console.log('Tombola by AG è ora in grado di funzionare offline', registration.scope);
      console.log('Tombola by AG can now work offline', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('Tombola by AG non è in grado di funzionare offline', err);
      console.log('Tombola by AG cannot work offline', err);
    });
  });
}
// Costanti per la generazione delle cartelle
const pattern = [
	[false, true, true, false, false, true, true, true, true],
	[true, true, false, true, false, true, false, true, true],
	[false, true, true, false, true, false, true, true, true],
	[true, false, true, true, true, true, true, false, false],
	[false, true, false, true, true, true, false, true, true],
	[true, false, true, true, true, false, true, false, true]
];
const table = [
 	// 00   01    02     10     11    12    20    21     22     30     31    32     40     41     42    50    51    52     60    61     62    70    71    72     80    81     82
	[false, true, false, false, true, true, true, false, true, false, true, false, false, false, true, true, true, false, true, false, true, true, true, false, true, false, true],
	[false, true, true, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, true, true, false],
	[true, false, false, false, true, true, true, true, false, false, false, true, true, true, false, false, true, false, true, false, true, true, false, true, false, true, true],
	[true, false, true, false, true, false, false, true, true, true, false, true, true, true, false, false, true, true, true, false, true, false, true, false, true, false, false],
	[false, false, true, true, true, false, false, false, true, false, true, true, true, true, false, true, false, true, false, true, false, true, false, true, true, true, false],
	[true, true, false, false, false, true, true, true, false, true, false, true, false, true, true, false, true, false, true, false, true, false, true, false, true, false, true]
];
// Apertura/Chiusura di una cartella
function toggle(event) {
	event.currentTarget.classList.toggle("chiuso");
}
// Generazione dei numeri di una cartella
function generateNumbers() {
	var cartella = {
		"model": Math.floor(Math.random() * 6), // Scelta di uno dei sei modelli
		"list" : []
	}
	cartella["serial"] = cartella.model + 1 + (6 * Math.floor(Math.random() * 4));
	
	for(var column = 0; column < pattern[cartella.model].length; column++) {
		if(pattern[cartella.model][column] == true) {
			var one = Math.floor(Math.random() * 9) + 1 + (10 * column);
			var two = Math.floor(Math.random() * 9) + 1 + (10 * column);
			if(one>two) {
				cartella.list.push(two); 	// Colonna con 
				cartella.list.push(one); 	// due numeri
			} else if(one==two) {
				column--;
			} else {						//
				cartella.list.push(one); 	// Richiede l'ordinamento!
				cartella.list.push(two); 	//
			}
		} else {
			cartella.list.push(Math.floor(Math.random() * 9) + 1 + (10 * column)); // Colonna con un solo numero
		}
		
	}
	
	return cartella;
}
function populateTable(cartella) {
	document.getElementsByClassName("id")[0].innerText= "n. " + cartella.serial; // Immetto il numero della cartella
	document.getElementsByClassName("id")[1].innerText= "n. " + cartella.serial; // In entrambe le occorrenze
	
	document.querySelector(".cartella").classList.remove("magenta");
	document.querySelector(".cartella").classList.remove("sage");
	
	if(cartella.serial < 13) {
		document.querySelector(".cartella").classList.add("magenta");
	} else {
		document.querySelector(".cartella").classList.add("sage");
	}
	
	var numberIndex = 0;
	var tableIndex = 0;
	
	for(var column = 0; column < 9; column++) {
		for(var row = 0; row < 3; row++) {
			if(table[cartella.model][tableIndex]) {
				document.querySelector("#c" + column + "r" + row + " .numero").innerText = "" + cartella.list[numberIndex];
				numberIndex++;
			} else {
				document.querySelector("#c" + column + "r" + row + " .numero").innerText = "";
			}
			tableIndex++;
		}
	}
}
function internationalizeLinks(lang) {
	if (lang == "it") {
		document.querySelector("#appLink").innerText = "Scarica l'app";
		document.querySelector("#privacyLink").innerText = "Privacy";
		document.querySelector("#emailLink").innerText = "Contatti";
	} else {
		document.querySelector("#appLink").innerText = "Get the App";
		document.querySelector("#privacyLink").innerText = "Privacy";
		document.querySelector("#emailLink").innerText = "Contacts";
	}
}
function backupClosed() {
	var backup = ""
	let storage = document.querySelector(".cartella").dataset.storage;
	if (storage != "") {
		for(var column = 0; column < 9; column++) {
			for(var row = 0; row < 3; row++) {
				backup += (document.querySelector("#c" + column + "r" + row).parentElement.classList.contains("chiuso") ? "1" : "0");
			}
		}
		window.localStorage.setItem("progress://" + storage, backup);
	}
}
function restoreClosed() {
	let storage = document.querySelector(".cartella").dataset.storage;
	let backup = window.localStorage.getItem("progress://" + storage);
	var i = 0;
	if ((backup != null) && (backup != "")) {
		for(var column = 0; column < 9; column++) {
			for(var row = 0; row < 3; row++) {
				if (backup[i] == "1") {
					document.querySelector("#c" + column + "r" + row).parentElement.classList.add("chiuso")
				}
				i += 1;
				if (i == backup.length) { return }
			}
		}
	}
}
function openClosed() {
	for(var column = 0; column < 9; column++) {
		for(var row = 0; row < 3; row++) {
			document.querySelector("#c" + column + "r" + row).parentElement.classList.remove("chiuso")
		}
	}
}
function loadTable() {

	backupClosed()

	var lang;
	var language = navigator.language || navigator.userLanguage;
	switch(language.substring(0,2)) {
		case "it": document.documentElement.lang = "it"; lang = "it"; break;
		default: document.documentElement.lang = "en"; lang = "en"; break;
	}
	internationalizeLinks(lang);

	var data = location.hash; // #title=Senza-titolo&time=15857373802552261
	let titleBegin = data.indexOf("#title=");
	let timeBegin = data.indexOf("&time=");
	
	
	if((titleBegin != -1) && (timeBegin != -1)) {
		
		let skypeBegin = data.indexOf("&skype=");
		let jitsiBegin = data.indexOf("&jitsi=");
		
		var titleEnd = timeBegin;
		
		if (skypeBegin != -1) {
			titleEnd = skypeBegin;
		} else if (jitsiBegin != -1) {
			titleEnd = jitsiBegin;
		}
		
		var title = decodeURIComponent(data.substring(titleBegin + 7, titleEnd)).replace(/-/g, " ");
		document.querySelector("header h1").innerText = title;
		var timestamp = data.substring(timeBegin + 6, timeBegin + 19);
		var time = new Date(parseInt(timestamp));
		
		if (titleEnd != timeBegin) {
			// Game with video-call
			var link = data.substring(titleEnd + 7, timeBegin);
			if (skypeBegin != -1) {
				if (lang == "it") {
					document.querySelector("header p").innerHTML = '<a href="https://join.skype.com/' + link + '" target="_blank">Avvia Videochiamata su Skype &gt;</a>';
				} else {
					document.querySelector("header p").innerHTML = '<a href="https://join.skype.com/' + link + '" target="_blank">Join Video Call on Skype &gt;</a>';
				}
			} else if (jitsiBegin != -1) {
				if (lang == "it") {
					document.querySelector("header p").innerHTML = '<a href="https://meet.jit.si/' + link + '" target="_blank">Avvia Videochiamata su Jitsi &gt;</a>';
				} else {
					document.querySelector("header p").innerHTML = '<a href="https://meet.jit.si/' + link + '" target="_blank">Join Video Call on Jitsi &gt;</a>';
				}
			}
		} else {
			// Game with no video-call
		
			var month = "";
		
			switch(time.getMonth()) {
				case 0: month=(lang == "it" ? "Gennaio" : "January");break;
				case 1: month=(lang == "it" ? "Febbraio" : "February");break;
				case 2: month=(lang == "it" ? "Marzo" : "March");break;
				case 3: month=(lang == "it" ? "Aprile" : "April");break;
				case 4: month=(lang == "it" ? "Maggio" : "May");break;
				case 5: month=(lang == "it" ? "Giugno" : "June");break;
				case 6: month=(lang == "it" ? "Luglio" : "July");break;
				case 7: month=(lang == "it" ? "Agosto" : "August");break;
				case 8: month=(lang == "it" ? "Settembre" : "September");break;
				case 9: month=(lang == "it" ? "Ottobre" : "October");break;
				case 10: month=(lang == "it" ? "Novembre" : "November");break;
				case 11: month=(lang == "it" ? "Dicembre" : "December");break;
			}
		
			var hr = time.getHours();
			var hours = hr;
			if(hr < 10) {
				hours = "0" + hours;
			}
			var mn = time.getMinutes();
			var minutes = mn;
			if(mn < 10) {
				minutes = "0" + minutes;
			}
			
			if (lang == "it") {
				var desc = "Partita creata il " + time.getDate() + " " + month + " " + time.getFullYear() + " alle " + hours + ":" + minutes;
				document.querySelector("header p").innerText = desc;
			} else {
				var desc = "Game created on " + time.getDate() + " " + month + " " + time.getFullYear() + " at " + hours + ":" + minutes;
				document.querySelector("header p").innerText = desc;
			}
			// Next time use .toLocaleDateString()
		}
		var key = "title=" + title + "&time=" + timestamp;
		if(window.localStorage.getItem(key) != null) {
			var cartella = JSON.parse(window.localStorage.getItem(key));
			document.querySelector(".cartella").dataset.storage = key;
			try {
				populateTable(cartella);
			} catch(error) {
				console.log("Archiviazione corrotta per '" + key + "'");
				var cartella = generateNumbers();
				window.localStorage.removeItem(key);
				window.localStorage.setItem(key, JSON.stringify(cartella));
				populateTable(cartella);
			}
		} else {
			document.querySelector(".cartella").dataset.storage = "";
			var cartella = generateNumbers();
			window.localStorage.setItem(key, JSON.stringify(cartella));
			populateTable(cartella);
		}
		openClosed();
		restoreClosed();
	} else {
		document.querySelector("header h1").innerText = (lang == "it" ? "Buona fortuna" : "Good Luck");
		document.querySelector("header p").innerText = (lang == "it" ? "Questa cartella è stata generata automaticamente per te" : "This ticket was generated automatically for you");
		populateTable(generateNumbers());
		openClosed();
	}
	
}
