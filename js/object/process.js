/*
 * process display color array
 */
var colors = new Array("#2ecc71","#f1c40f","#3498db","#e74c3c","#e67e22","#9b59b6","#ecf0f1","#7f8c8d","#f39c12","#1abc9c");
/*
 * process object
 */
function Process(pid, arrivalTime, execTime, period, assignedCPU) {
	
	this.pid = pid;
	this.name = "P" + this.pid;
	this.priority = "";
	this.status = "";
	this.active = true;  // If a process is deleted by user, change it to false
	this.firstArrivalTime = arrivalTime;
	this.arrivalTime = arrivalTime !== undefined ? arrivalTime : 0;
	this.period = period !== undefined ? period : 1;
	this.execTime = execTime !== undefined ? execTime : 0;
	this.assignedCPU = assignedCPU !== undefined ? assignedCPU : "Not Allocated";
	this.showColor = colors[pid%10];
	this.startTime = -1;
	this.remainingTime = this.execTime;
	this.deadline = parseInt(this.arrivalTime) + parseInt(this.period);	//first deadline
	//this.slack = parseInt(this.deadline) - parseInt(this.remainingTime); // - currentTime <-- remember!
}
/*
 * process manager
 */
function ProcessManager() {

    this.processList = [];
    this.pid = -1;	
    this.copyOfProcessList = [];

    this.addProcess = function(process) {
        this.processList[this.processList.length] = process;
	}

	this.getNextID = function() {
		return ++this.pid;
	}

	this.resetProcessList = function() {
		this.processList.length = 0;
		this.pid = -1;
		this.copyOfProcessList.length = 0;
	}

	// Draw process table at adding case part
	this.drawProcessTable = function() {
		var rowCount= $("#process-quantity").val();
	    var table=$("<table id='process-table' border='0'></table>");
	   	table.appendTo($("#process-table-div"));

		var tr=$("<tr></tr>");
		tr.appendTo(table);
		var th=$("<th>Process Name<br/>&nbsp;</th>");
		th.appendTo(tr);
		var th=$("<th>Arrive Time<br/><span class='range'>(0 - 5)</span></th>");
		th.appendTo(tr);
		var th=$("<th>Execution Time<br/><span class='range'>(1 - period)</span></th>");
		th.appendTo(tr);
		var th=$("<th>Period<br/><span class='range'>(1 - 10)</span></th>");
		th.appendTo(tr);

		for(var i=0;i<rowCount;i++) {
			var tr=$("<tr></tr>");
			tr.appendTo(table);
			for(var j=0;j<4;j++) {
				var td=$("<td></td>");
				td.appendTo(tr);
				if(j == 0){
				  var text=$("<span>Process"+i+"</span>");
				  text.appendTo(td);
				} else if(j == 1){
					var input=$("<input id='input"+(i*4+j)+"' class='form-control p-unit p-arr"+i+"'></input>");
					input.appendTo(td);
				} else if(j == 2){
					var input=$("<input id='input"+(i*4+j)+"' class='form-control p-unit p-exec"+i+"'></input>");
					input.appendTo(td);
				} else if(j == 3){
					var input=$("<input id='input"+(i*4+j)+"' class='form-control p-unit p-period"+i+"'></input>");
					input.appendTo(td);
				}
			}
		}
	}

	// Draw process table at editing case part
	this.drawEditProcessTable = function() {
		var process = process_manager.processList;
		var rowCount = process.length; 
		$("#edit-case-table").remove();

		var table=$("<table id='edit-case-table' border='0'></table>");
	   	table.appendTo($("#edit-case-table-div"));

		var tr=$("<tr></tr>");
		tr.appendTo(table);
		var th=$("<th>Process Name<br/>&nbsp;</th>");
		th.appendTo(tr);
		var th=$("<th>Arrive Time<br/><span class='range'>(0 - 5)</span></th>");
		th.appendTo(tr);
		var th=$("<th>Execution Time<br/><span class='range'>(1 - period)</span></th>");
		th.appendTo(tr);
		var th=$("<th>Period<br/><span class='range'>(1 - 10)</span></th>");
		th.appendTo(tr);
		var th=$("<th>Delete<br/>&nbsp;</th>");
		th.appendTo(tr);

		for(var i = 0; i < rowCount; i++) {
			var tr=$("<tr id='process"+i+"-row'></tr>");
			tr.appendTo(table);
			for(var j = 0; j < 5; j++) {
				var td=$("<td></td>");
				td.appendTo(tr);
				if(j == 0){
				  var text=$("<span>Process"+process[i].pid+"</span>");
				  text.appendTo(td);
				} else if(j == 1){
					var input=$("<input class='form-control p-unit p-arr"+i+"' id='edit-input"+(i*5+j)+"' value="+process[i].arrivalTime+"></input>");
					input.appendTo(td);
				} else if(j == 2){
					var input=$("<input class='form-control p-unit p-exec"+i+"' id='edit-input"+(i*5+j)+"' value="+process[i].execTime+"></input>");
					input.appendTo(td);
				} else if(j == 3){
					var input=$("<input class='form-control p-unit p-period"+i+"' id='edit-input"+(i*5+j)+"' value="+process[i].period+"></input>");
					input.appendTo(td);
				} else if(j == 4){
				  var text=$('<a href="#" class="delete-process" onclick="process_manager.deactivateProcess('+i+')">&times</a>');
				  text.appendTo(td);
				}
			}
		}
	}

	/*
	 * Function for adding a new process after 
	 * clicking Add Process button on modal4
	 */ 
	this.addNewEditProcess = function() {
		// Create a new process and push to processlist
		var index = process_manager.processList.length;
		var newPid = process_manager.getNextID();
		var newProcess = new Process(newPid);
		process_manager.processList.push(newProcess);
		var table = $('#edit-case-table');
		var newTr = $("<tr id='process"+index+"-row'></tr>");
		newTr.appendTo(table);
		for (var j = 0; j < 5; j++) {
			var td = $("<td></td>");
			td.appendTo(newTr);
			if (j == 0) {
			  var text = $("<span>Process"+newPid+"</span>");
			  text.appendTo(td);
			} else if (j == 1) {
				var input = $("<input id='edit-input"+(index*5+j)+"' class='form-control p-unit p-arr"+index+"'></input>");
				input.appendTo(td);
			} else if (j == 2) {
				var input = $("<input id='edit-input"+(index*5+j)+"' class='form-control p-unit p-exec"+index+"'></input>");
				input.appendTo(td);
			} else if (j == 3) {
				var input = $("<input id='edit-input"+(index*5+j)+"' class='form-control p-unit p-period"+index+"'></input>");
				input.appendTo(td);
			} else if (j == 4) {
				  var text=$('<a href="#" class="delete-process" onclick="process_manager.deactivateProcess('+index+')">&times</a>');
				  text.appendTo(td);
			}
		}
	}

	/*
	 * Function for deactivate a exist process after clicking Delete button on modal4
	 */ 
	this.deactivateProcess = function(index) {
		var processes = process_manager.processList;
		$("#process"+index+"-row").remove();
		processes[index].active = false;
	}

	/*
	 * Generate random parameters for processes
	 */
	this.randomizeProcess = function() {
		var rowCount= $("#process-quantity").val();
		for(var i = 0; i < rowCount; i++) {

			var arrivalTime = parseInt((Math.random() * 6));  // Randomize arrival time between 0 and 5	
			var period = parseInt((Math.random() * 10) + 1);  // Randomize arrival time between 1 and 10
			var execTime = parseInt((Math.random() * period) + 1);  // Randomize arrival time between 1 and period

			for(var j = 0; j < 4; j++) {
				if (j == 1)
					$('#input'+(i*4+j)+'').val(arrivalTime);
				else if (j == 2)
					$('#input'+(i*4+j)+'').val(execTime);
				else if (j == 3)
					$('#input'+(i*4+j)+'').val(period);
			}
		}	
	}

	/*
	 * Reset the allocation for all processes when simulator is restarted
	 */
	this.resetProcessAllocation = function()  {
		var pList = this.processList;
		for (var i in pList) {
			pList[i].assignedCPU = "Not Allocated";
		}
	}

	/*
	 * Back up the processList before exiting
	 */
	this.setBackUpProcessList = function() {
		this.copyOfProcessList = this.processList;
	}

	this.getBackUpProcessList = function() {
		return this.copyOfProcessList;
	}

	/* JavaScript File Read/Write Functions Begin */

	// Save processes information as a txt file 
	this.saveProcessAsTxtFile = function() {
		// Get the text that need to be wrote
		var textToWrite = this.getProcessInfoToWrite();
		var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
		var fileName = document.getElementById("fileName").value;
		var fileNameToSaveAs = "";

		// Use default file name when file name is undefined by user		
		if (fileName.replace(/[ ]/g,"").length == 0) {
			fileNameToSaveAs = "default.txt";
		} else {
			fileNameToSaveAs = fileName + ".txt";  // Saved as a txt file
		}		
		
		var downloadLink = document.createElement("a");
		downloadLink.download = fileNameToSaveAs;
		downloadLink.innerHTML = "Download File";
		if (window.webkitURL != null) {
			// Chrome allows the link to be clicked
			// without actually adding it to the DOM.
			downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
		}
		else {
			// Firefox requires the link to be added to the DOM
			// before it can be clicked.
			downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
			downloadLink.onclick = this.destroyClickedElement;
			downloadLink.style.display = "none";
			document.body.appendChild(downloadLink);
		}
		downloadLink.click();
	}

	// Get information of all processes and serialize them
	this.getProcessInfoToWrite = function() {
		var processQty = $("#process-quantity").val();  // Get the quantity of process
		var textToWrite = "";

		for(var i = 0; i < processQty; i++){
			textToWrite += $("#input"+(i*4+1)).val()  // Get arrival time
						+ ","
						+ $("#input"+(i*4+2)).val()  // Get execution time
						+ ","
						+ $("#input"+(i*4+3)).val()  // Get period
						+ ";"
		}
		return textToWrite;
	}

	this.destroyClickedElement = function(event) {
		document.body.removeChild(event.target);
	}

	// Load processes information from the chosen file 
	this.loadProcess = function() {

	    var files = document.getElementById('files').files;
	    if (!files.length) {
	      alert('Please choose a file.');
	      return;
	    }
	    var file = files[0];
	    var start = 0;
	    var stop = file.size - 1;
	    var reader = new FileReader();  
	    var check = true;  

	    // If we use onloadend, we need to check the readyState.
	    reader.onloadend = function(evt) {
	      	if (evt.target.readyState == FileReader.DONE) { // DONE == 2
	      		
		        // Format file content
		        var content = evt.target.result.replace(/\;/g,",").split(",");
		        var p_unit = [];
		        for (var i = 0; i < content.length - 1; i++) {
				    p_unit.push(parseInt(content[i]));		
				    // Data validity validation
				    if (isNaN(p_unit[i])) {
				    	// alert('Invalid p_unit['+i+']: '+p_unit[i]);
				    	check = false;
				    }
				}
				// Non empty validation
				if (p_unit.length == 0) {
					check = false;
				}
				if (check == true) {
					// Data size validation 
					var remainder = (p_unit.length) % 3;	
					if (remainder != 0) {  // Worng data size
						alert('Load process failed! Please choose other files.');
					} 
					else {  // Correct data size
						var processQty = (p_unit.length) / 3;
						$("#process-quantity").val(processQty);
						$("#process-quantity").blur();

						for(var i = 0; i < processQty; i++) {
							for(var j = 0; j < 4; j++) {
								var index = j - 1 + i * 3;
								if (j == 1)
									$('#input'+(i*4+j)+'').val(p_unit[index]);
								else if (j == 2)
									$('#input'+(i*4+j)+'').val(p_unit[index]);
								else if (j == 3)
									$('#input'+(i*4+j)+'').val(p_unit[index]);
							}
						}	
					}				
				} else {
					alert('Load process failed! Please choose other files.');
				}
		    }
		};
	    var blob = file.slice(start, stop + 1);
	    reader.readAsBinaryString(blob);
	}

	/* JavaScript File Read/Write Functions End */
}

