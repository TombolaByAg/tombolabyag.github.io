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
function loadTable() {
	var data = location.hash; // #title=Senza-titolo&time=15857373802552261
	let titleBegin = data.indexOf("#title=");
	let timeBegin = data.indexOf("&time=");
	if((titleBegin != -1) && (timeBegin != -1)) {
		var title = data.substring(titleBegin + 7, timeBegin).replace(/-/g, " ");;
		var timestamp = data.substring(timeBegin + 6, timeBegin + 19);
		var time = new Date(parseInt(timestamp));
		
		document.querySelector("header h1").innerText = title;
		
		var month = "";
		
		switch(time.getMonth()) {
			case 0: month="Gennaio";break;
			case 1: month="Febbraio";break;
			case 2: month="Marzo";break;
			case 3: month="Aprile";break;
			case 4: month="Maggio";break;
			case 5: month="Giugno";break;
			case 6: month="Luglio";break;
			case 7: month="Agosto";break;
			case 8: month="Settembre";break;
			case 9: month="Ottobre";break;
			case 10: month="Novembre";break;
			case 11: month="Dicembre";break;
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
		
		
		var desc = "Partita creata il " + time.getDate() + " " + month + " " + time.getFullYear() + " alle " + hours + ":" + minutes;
		document.querySelector("header p").innerText = desc;
		var key = "title=" + title + "&time=" + timestamp;
		if(window.localStorage.getItem(key) != null) {
			var cartella = JSON.parse(window.localStorage.getItem(key));
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
			var cartella = generateNumbers();
			window.localStorage.setItem(key, JSON.stringify(cartella));
			populateTable(cartella);
		}
	} else {
		document.querySelector("header h1").innerText = "Buona fortuna";
		document.querySelector("header p").innerText = "Questa cartella è stata generata automaticamente per te";
		populateTable(generateNumbers());
	}
	
}