
// Click function for Add Case button
$('#add-case').click(function(){
	
	$('#myModal1').modal({'backdrop': 'static'});
	cleanResultPanel();
});

// Click function for Next button on modal1 
$('#show-modal2').click(function(){
	// Form validation 
	if ($(".form-myModal1").valid() == true) {
		// Go to the next modal
		$("#show-modal2").attr('data-dismiss','modal');
		$('#myModal2').modal({'backdrop': 'static'});
		var scheme = $('#scheme').val();
		// Display corresponding setting algorithm page base on the scheme and quantity of cpu used set
		var html = addSchemeSelector(scheme);
		$('#algorithm-list').html(html);
	}
});

// Click function for Next button on modal2
$('#show-modal3').click(function(){
	// Form validation 
	if ($(".form-myModal2").valid() == true) {
		// Go to the next modal
		$("#show-modal3").attr('data-dismiss','modal');
		$('#myModal3').modal({'backdrop': 'static'});
	}
});

// Display process setting form base on the quantity of process used set
$("#process-quantity").blur(function(){
	$("#process-table").remove();
	// Form validation 
	if ($(".form-myModal3").valid() == true) {
		$("#random-process").fadeIn(); 
		$(".save-process-group").fadeIn();	
		// Draw the process table	
		process_manager.drawProcessTable();
	} else {
		$("#random-process").hide();
		$(".save-process-group").hide();
	}
});

// Click function for save process button
$("#save-process").click(function(){
	// Form validation
	if ($(".form-myModal3").valid() == true && 
			validateProcessUnit("process-table", $("#process-quantity").val())) {
		process_manager.saveProcessAsTxtFile();
	} 
});

// Click function for load process button
$("#load-process").click(function(){
	process_manager.loadProcess();
});

// Click function for radomize button
$("#random-process").click(function(){
	if ($(".form-myModal3").valid() == true) {
		process_manager.randomizeProcess();
	}
});

// Click function for Finish button on modal3
$('#save-case').click(function(){
	// Form validation 
	if ($(".form-myModal3").valid() == true && 
			validateProcessUnit("process-table", $("#process-quantity").val())) {
		// Reset processList and CPUList
		resetObjList();
		// Save the case
		$("#save-case").attr('data-dismiss','modal');
		saveCase();
		showCaseSettings();
		showEditCaseAndStartButton();
	} else {
		$("#save-case").removeAttr('data-dismiss','modal');
	}
});

// Click function for Edit Case button
$('#edit-case').click(function(){
	$('#myModal4').modal({'backdrop': 'static'});
	// Back up the processList
	process_manager.setBackUpProcessList();
	editCase();
});

// Click function for adding a new process on edit case page
$('#add-process').click(function(){
	process_manager.addNewEditProcess();
});

// Click function for edit save process button 
$('#save-edit-case').click(function(){
	// Form validation 
	if ($(".form-myModal4").valid() == true && 
			validateProcessUnit("edit-case-table", process_manager.processList.length)) {
		// Save the case
		$("#save-edit-case").attr('data-dismiss','modal');
		saveEditCase();
		showCaseSettings();
	} else {
		$("#save-edit-case").removeAttr('data-dismiss','modal');
	}
});

// Click function for cancel edit case button
$("#cancel-edit-case").click(function(){ 
	var copy = process_manager.getBackUpProcessList();
	// Recover the processList
	process_manager.processList = copy;
});

// Click function for start simulator button
$("#start-simulator").click(function(){				
	$("#result-legend").show();	
	$('#case-panel').hide();
	$('#start-running').hide();
	$('#stop-running').fadeIn('fast');

	cleanResultPanel();

	recorder_manager.recorderList.length = 0;
	recorder_manager.recorderSequence.length = 0;
	initializeData();
	statistics.initialize();

	drawResultPanel();
	$("#result-display-panel").css("width","2050px");
	var height = simulator.resourceList.length * 190;
	$("#result-recorder-div").css("height",height+"px");
	var height = simulator.resourceList.length * 140+100;
	$(".result-global-readyqueue").css("height",height+"px");

	simulator.startSimulator();

	recorder_manager.handleRecorderSequence();

	statistics.calculation();

	showNextEvents();
	showCaseSettings();
});

// Click function for restart button
$("#stop-simulator").click(function(){
	recorder_manager.resetIndex();
	$('.event').remove();
	$('.runningP-div').empty();
	$("#result-display-readyqueue").empty();
	$('#result-recorder-table').empty();
	$('#case-panel').fadeIn('fast');
	$('#start-running').fadeIn('fast');
	$('#stop-running').hide();
	$('#statistics-panel table td').remove();
	process_manager.resetProcessAllocation();
	showCaseSettings();
});
// Click function for step-forward button
$("#step-forward").click(function(){
	showNextEvents();
});
// Click function for step-back button
$("#step-back").click(function(){
	removeCurrentEvents();
});
// Click function for finish button
$("#finish-simulator").click(function(){
	showAllEvent();
	showStatistics();
});
$(".algorithm-instruction-icon").mouseenter(function(){
	var div = $("<div class='instruction-div'> </div>");
	div.appendTo($(this));
	var algorithm = simulator.algorithm;
	var text = "";
	switch(algorithm){
		case "G-EDF":
			text = "<span>G</span>-EDF is the extension of EDF for multiple processors based on the global strategy. All CPUs share one global ready queue. The highest priority task is the one with the earliest deadline. Missed task instances will be abandoned."
			break;
		case "G-RMS":
			text = "<span>G</span>-RMS is the extension of RMS for multiple processors based on the global strategy.  All CPUs share one global ready queue. Task with the smallest period has the highest priority. Missed task instances will be abandoned."
			break;
		case "P-EDF":
			text = "<span>P</span>-EDF is the extension of EDF for multiple processors based on the partitioned strategy. Each CPU has its own ready queue. Tasks are partitioned to different CPUs based on CPU utilization. The highest priority task is the one with the earliest deadline. Missed task instances will be abandoned."
			break;
		case "P-RMS":
			text = "<span>P</span>-RMS is the extension of RMS for multiple processors based on the partitioned strategy. Each CPU has its own ready queue. Tasks are partitioned to different CPUs based on CPU utilization. Task with the smallest period has the highest priority. Missed task instances will be abandoned."
			break;
		case "G-LLF":
			text = "<span>G</span>-LLF (least laxity first) is another real-time scheduling algorithm based on the global strategy which assigns the highest priority to the job with the least slack time. The slack time is the time afford to delay after a process starts. It is another way to represent the urgency to meet the deadline.   It is defined as (deadline – current time – remaining computation time)."
			break;
		case "P-LLF":
			text = "<span>G</span>-LLF (least laxity first) is another real-time scheduling algorithm based on the partitioned strategy which assigns the highest priority to the job with the least slack time. The slack time is the time afford to delay after a process starts. It is another way to represent the urgency to meet the deadline.   It is defined as (deadline – current time – remaining computation time)."
			break;
	}
	div.css({"width":"350px","height":"auto"}).html(text);
});

$(".scheme-instruction-icon").mouseenter(function(){
	var div = $("<div class='instruction-div'> </div>");
	div.appendTo($(this));
	var scheme = simulator.scheme;
	var text = "";
	switch(scheme){
		case "partitioned":
			text = "<span>P</span>artitioned scheme: each CPU has its own ready queue. To balance the workload, each new task is assigned to the CPU with the lowest utilization. No migration is allowed."
			break;
		case "global":
			text = "<span>G</span>lobal scheme: all cpus shares one global ready queue. The task with the higest prioirty in the global ready queue always gets servered first, either on an idle CPU, or preempting a running task with the lowest prioirty. A task may migrate between different CPUs." 

			break;
	}
	$(".instruction-div").css({"width":"500px","height":"auto"}).html(text);
});
$(".select-scheme-instruction-icon").mouseenter(function(){
	var div = $("<div class='instruction-div' style='text-align:left;'> </div>");
	div.appendTo($(this));
	var text = "<p><b style='color:red;font-size:20px;'>Partitioned:</b> each CPU has its own ready queue. To balance the workload, each new task is assigned to the CPU with the lowest utilization. No migration is allowed.</p>"
				+"<p><b style='color:red;font-size:20px;'>Global:</b> all cpus shares one global ready queue. The task with the higest prioirty in the global ready queue always gets servered first, either on an idle CPU, or preempting a running task with the lowest prioirty. A task may migrate between different CPUs.</p>"
	$(".instruction-div").css({"width":"500px","height":"auto"}).html(text);
});
$(".instruction-icon").mouseleave(function(){
	$(this).empty();
});
function addSchemeSelector(scheme) {
	var html = "";
	if (scheme == "global") {
		html = '<div class="form-group">'
	            	+'<label class="col-sm-4 control-label">Select an Algorithm</label>'
	                +'<div class="col-xs-5">'
	                	+'<select class="form-control" id="g-Algorithm" name="algorithm">'
						  +'<option value="">---- Select an Algorithm ----</option>'
						  +'<option value="G-EDF">G-EDF</option>'
						  +'<option value="G-RMS">G-RMS</option>'
						  +'<option value="G-LLF">G-LLF</option>'
						+'</select>'
	                +'</div>'
	            +'</div>';
	}
	else if (scheme == "partitioned") {
		html += '<div class="form-group">'
                	+'<label class="col-sm-4 control-label">Select an Algorithm</label>'
                    +'<div class="col-xs-5">'
                    	+'<select class="form-control" id="p-Algorithm" name="algorithm">'
						  +'<option value="">---- Select an Algorithm ----</option>'
						  +'<option value="P-EDF">P-EDF</option>'
						  +'<option value="P-RMS">P-RMS</option>'
						  //+'<option value="P-LLF">P-LLF</option>'
						+'</select>'
                    +'</div>'
                +'</div>';
	}
	return html;
}

function saveCase() {
	var scheme = $('#scheme').val();  // Get the scheme user selected
	var cpuQty = $('#cpu-quantity').val();  // Get the quantity of CPU
	var processQty=$("#process-quantity").val();  // Get the quantity of process
	var execAlg = "";
	recorder_manager.recorderList.length = 0;
	recorder_manager.recorderSequence.length = 0;

	if (scheme == "global")  // Get the algorithm under global scheme
		execAlg = $('#g-Algorithm').val();  
	else if (scheme == "partitioned") 	// Get the algorithm under partitioned scheme	
		execAlg = $('#p-Algorithm').val();  

	// Create CPU objects one by one and then add them to the CPUList
	for (var i = 0; i < cpuQty; i++) {
		var cid = cpu_manager.getNextID();
		var cpu = new CPU(cid);
		cpu_manager.addCPU(cpu);
	}
	// Create Process objects one by one and then add them to the processList
	for(var i=0;i<processQty;i++){
		var pid=process_manager.getNextID();
		var arrivalTime=$("#input"+(i*4+1)).val();
		var execTime=$("#input"+(i*4+2)).val();
		var period=$("#input"+(i*4+3)).val();
		var process=new Process(pid,arrivalTime,execTime,period);
		process_manager.addProcess(process);
	}
	
	// Update simulator object
	simulator.scheme = scheme;
	simulator.algorithm = execAlg;

	// Change the main page title
	changeAlgTitle(execAlg);
}

/*
 * Function for changing the title of main page
 */
function changeAlgTitle(algorithm) {
	$("#alg-title").html(algorithm);
	$(".instruction-icon").css("display","inline-block").show();
}

function showCaseSettings() {
	// Scheme information
	$("#scheme-text").html("<b>" + simulator.scheme + "</b>");
	// Algorithm information
	$("#algorithm-text").html("<b>" + simulator.algorithm + "</b>");

	// Workload information
	var results = simulator.compareTotalProcessUtilWithTotalCpuRemainingUtil();
	var workloadHtml = "<table id='workload-table'>"
						  + "<tr>"
						 	  + "<td>Total number of CPUs: <b>" + results.totalCpuUtil + "</b></td>"
							  + "<td>Total utilization <div class='instruction-icon workload-instruction-icon'  style='width:15px;height:15px;background-image:url(icon/question2.png);display:inline-block'></div> :<b>" + results.totalProUtil + "</b></td>"							  
							  + "<td>Status: <b>" + results.condition + "</b></td>"
						  + "</tr>"
					  + "</table>"
	$("#workload-text").html(workloadHtml);
	
	//bind mouseenter event
	$(".workload-instruction-icon").bind("mouseenter",function(){
  		var div = $("<div class='instruction-div'>&#8721; C/T of all processes.&nbsp;&nbsp;&nbsp;&nbsp; (C: execution time, T: period)</div>");
		div.appendTo($(this));
		div.css({"width":"300px","height":"auto"});
	});

	//bind mouseleave event
	$(".workload-instruction-icon").bind("mouseleave",function(){
  		$(this).empty();
	});

	//CPU info show
	var html="<table class='table table-hover'><tr class='info'>"
				+"<th>CID</th>"
				+"<th>CPU Name</th>"
				+"</tr>";
	for(var i=0;i<cpu_manager.CPUList.length;i++){
		var CPU = cpu_manager.CPUList[i];
		html+="<tr>"
				+"<td>"+CPU.cid+"</td>"
				+"<td>"+CPU.name+"</td>"
			+"</tr>";
	}
	html+="</table>";
	$("#resource-text").html(html);

	//Process info show
	html="<table class='table table-hover'><tr class='info'>"
			+"<th>PID</th>"
			+"<th>Process Name</th>"
			+"<th>Arrival Time</th>"
			+"<th>Execution Time</th>"
			+"<th>Period</th>";
	if(simulator.scheme == "partitioned")
		html+="<th>Assigned CPU</th>";
	html += "<th>Color</th></tr>";
	
	for(var i=0;i<process_manager.processList.length;i++){
		var process = process_manager.processList[i];
			html+="<tr>"
					+"<td>"+process.pid+"</td>"
					+"<td>"+process.name+"</td>"
					+"<td>"+process.arrivalTime+"</td>"
					+"<td>"+process.execTime+"</td>"
					+"<td>"+process.period+"</td>";
			if(simulator.scheme == "partitioned") {
				html+="<td>"+process.assignedCPU+"</td>";
			}
			html+="<td style='background-color: "+process.showColor+";'> </td>"
				+"</tr>";
	}
	html+="</table>";
	$("#process-text").html(html);
}

/*
 * Function for showing and hiding Edit Case and Start Simulator button
 */
function showEditCaseAndStartButton() {
	if (typeof simulator === 'undefined') {
		$('#edit-case').hide();
		$('#start-running').hide();
	}
	else {
		$('#edit-case').fadeIn('fast');
		$('#start-running').fadeIn('fast'); 
	}
}

function editCase() {
	var execAlg = simulator.algorithm;
	var scheme = simulator.scheme;
	var html = "";

	if (scheme == "global") {
		html = addSchemeSelector(scheme).replace("g-Algorithm","edit-g-Algorithm")+'<br/>';  // Change id value
		$("#edit-case-table-div").html(html);
		$('#edit-g-Algorithm option[value="'+execAlg+'"]').prop('selected', 'selected');
	}
	else if (scheme == "partitioned") {
		html = addSchemeSelector(scheme).replace("p-Algorithm","edit-p-Algorithm")+'<br/>';  // Change id value
		$("#edit-case-table-div").html(html);
		$('#edit-p-Algorithm option[value="'+execAlg+'"]').prop('selected', 'selected');
	}
	// Draw the process table
	process_manager.drawEditProcessTable();
}

function resetObjList() {
	process_manager.resetProcessList();
	cpu_manager.resetCPUList();
}

function saveEditCase() {
	var execAlg = "";
	if (simulator.scheme == "global")  // Get the algorithm under global scheme
		execAlg = $('#edit-g-Algorithm').val();  
	else if (simulator.scheme == "partitioned")  // Get the algorithm under partitioned scheme	
		execAlg = $('#edit-p-Algorithm').val();  

	var processes = process_manager.processList;
	var processQty = processes.length;

	// Create Process objects one by one and then add them to the processList
	for(var i = 0; i < processQty; i++) {
		var arrivalTime = $("#edit-input"+(i*5+1)).val();
		var execTime = $("#edit-input"+(i*5+2)).val();
		var period = $("#edit-input"+(i*5+3)).val();
		//var process = new Process(processes[i].pid,arrivalTime,execTime,period);
		// Renew process attribute value
		processes[i].execTime = execTime;
		processes[i].arrivalTime = arrivalTime;
		processes[i].period = period;
	}
	for(var i = 0; i < processQty; i++) {
		if(processes[i].active == false){
			processes.splice(i,1);
			i--;
			processQty--;
		}
	}
	// Update simulator object
	simulator.algorithm = execAlg;	
	// Change the main page title
	changeAlgTitle(execAlg);
}

function initializeData(){
	//initialize processList
	var processes = process_manager.processList;
	simulator.processList.length = 0;
	for(var i in processes){
		var process = new Process(processes[i].pid,processes[i].arrivalTime,processes[i].execTime,processes[i].period );
		simulator.processList[i]= process;
		//alert(process_manager.processList[i].pid+"|"+process_manager.processList[i].arrivalTime);
		//alert(simulator.processList[i].pid+"|"+simulator.processList[i].arrivalTime);
	}
	//initialize resouseList
	var resources = cpu_manager.CPUList;
	simulator.resourceList.length = 0;
	for(var i in resources){
		var resource = new CPU(resources[i].cid);
		simulator.resourceList[i] = resource;
	}
	//reset relative para
	simulator.finishEventList.length = 0;
	simulator.idleCPUList = [];
	simulator.leastPriorityProcess = "";
	simulator.globalReadyQueue = [];
}

