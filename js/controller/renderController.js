

function cleanResultPanel() {
	$("#result-display-title").empty();
	$("#result-display-panel").empty();
	$("#result-display-readyqueue").empty();
}

function drawResultPanel() {
	var scheme = simulator.scheme;
	switch(scheme){
		case "partitioned":
			//draw CPU diagrams
			var cpuQty=simulator.resourceList.length;
			for(var i=0;i<cpuQty;i++){
				drawCPUDiagram(simulator.resourceList[i].cid);
			}
			break;
		case "global":
			//draw event diagram
			drawEventDiagram("event");
			//draw CPU diagrams
			var cpuQty=simulator.resourceList.length;
			for(var i=0;i<cpuQty;i++){
				drawCPUDiagram(simulator.resourceList[i].cid);
			}
			drawGlobalReadyQueue();
			break;
	}
}

function drawEventDiagram(){
	//add title content
	var title;
	title=$("<div id='event-title'>Event</div>");
	title.appendTo($("#result-display-title"));

	//draw a diagram
	var table=$("<table id='event-table'></table>");
   	table.appendTo($("#result-display-panel"));
	for(var i=0;i<4;i++)
	{
		var tr=$("<tr></tr>");
		tr.appendTo(table);
		for(var j=0;j<=simulator.totalRunningTime;j++)
		{	
			if(i==0){
				var td=$("<td class='row1' id='miss-table-td"+j+"'></td>");
				td.appendTo(tr);
			}
			if(i==1){
				var td=$("<td class='row2'> </td>");
				td.appendTo(tr);
			}
			if(i==2){
				var td=$("<td class='row3'>"+j+"</td>");
				td.appendTo(tr);
			}
			if(i==3){				
				var td=$("<td class='row4' id='event-table-td"+j+"'> </td>");
				td.appendTo(tr);
			}
		}
	}
}

function drawCPUDiagram(cid){
	//add title content
	var title=$("<div class='result-title' id='result-title"+cid+"' >CPU"+cid+"</div>");
	title.appendTo($("#result-display-title"));
	var scheme = simulator.scheme;
	if(scheme == "global")
		$(".result-title").css("height","180px");
	else
		$(".result-title").css("height","200px");
	//draw a CPU diagram
	var table=$("<table id='cpu-table' border='0'></table>");
   	table.appendTo($("#result-display-panel"));
	for(var i=0;i<5;i++)
	{
		var tr=$("<tr></tr>");
		tr.appendTo(table);
		for(var j=0;j<=simulator.totalRunningTime;j++)
		{	
			if(i==0 && scheme == "partitioned"){
				var td=$("<td class='row1' id='miss-table"+cid+"td"+j+"'></td>");
				td.appendTo(tr);
			}
			if(i==1){
				var td=$("<td class='row2' id='table"+cid+"td"+j+"'> </td>");
				td.appendTo(tr);
			}
			if(i==2){
				var td=$("<td class='row3'> </td>");
				td.appendTo(tr);
			}
			if(i==3){
				var td=$("<td class='row4'>"+j+"</td>");
				td.appendTo(tr);
			}
			if(i==4){
				var td=$("<td class='row5' id='event-table"+cid+"td"+j+"'></td>");
				td.appendTo(tr);
			}
		}
	}
	//draw ready queue
	switch(scheme){
		case "partitioned":
			var title = $("<p>CPU"+cid+"</p><div class='runningP-div' id='currentRunningP"+cid+"'> </div><div class='result-readyqueue' id='result-readyqueue"+cid+"'></div>");
			title.appendTo($("#result-display-readyqueue"));
			break;
		case "global":
			var title = $("<p>CPU"+cid+"</p><div class='runningP-div' id='currentRunningP"+cid+"'> </div>");
			title.appendTo($("#result-display-readyqueue"));
			break;
	}
}

function drawGlobalReadyQueue(){
	var title = $("<p>Global</p><div class='result-global-readyqueue' id='global-readyqueue'></div>");
	title.appendTo($("#result-display-readyqueue"));
}

function showNextEvents(flag){
	var index = recorder_manager.getNextEventIndex();

	if(index>=0){
		for(var i in recorder_manager.recorderSequence[index]){
			var recorderIndex = recorder_manager.recorderSequence[index][i];
			renderNextEvent(recorderIndex,flag);
		}
	}
	else
		showStatistics();
}


function renderNextEvent(eventIndex,flag){
	var recorder = recorder_manager.recorderList[eventIndex];
	var pid = recorder.pid;
	var cid = recorder.cid;
	var type = recorder.eventType;
	var start = recorder.eventStartTime;
	var end = recorder.eventEndTime;
	//var color = simulator.processList[pid].showColor;
	var color = colors[recorder.pid];
	var divID = "result-div"+eventIndex;
	var text = "";
	var scheme = simulator.scheme;
	//auto scrolling
	var left = (start-14)*40;
		$("#running-results").scrollLeft(left);
	
	if (type == "execution") {	
		var td = "#table"+cid+"td"+start;
		if(end > simulator.totalRunningTime)
			end = simulator.totalRunningTime+1;
		var length = (end-start)*40;
		var div = $("<div class='cpu-div event' id='"+divID+"' style='width:0px;height:55px;background-color: "+color+";'> P"+pid+"</div>");
		div.appendTo($(td));
		$("#"+divID).animate({width:length+'px',opacity:'0.8'},1000);
		text = "P"+pid+" executes on CPU"+cid;
		if(scheme == "global"){
			var td = "#currentRunningP"+cid;
				$(td).html("P"+recorder.runningProcess+" ("+recorder.runningProcessPriority+")");
		}
	}
	if(type == "arrival"){
		if(scheme == "partitioned")
			var td = "#event-table"+cid+"td"+start;
		else
			var td = "#event-table-td"+start;
		var div = $("<div class='event-div event' id='"+divID+"' style='width:40px;height:15px;'>&#8593 P"+pid+"</div>");
		div.appendTo($(td));
		$("#"+divID).hide().fadeIn(1000);
		if(scheme == "partitioned")
			text = "P"+pid+" arrives on CPU"+cid;
		else
			text = "P"+pid+" arrives";
	}
	if(type == "interrupt"){
		var td = "#event-table"+cid+"td"+start;
		var div = $("<div class='event-div event' id='"+divID+"' style='width:40px;height:15px;color:red;'>&#8593 P"+pid+"</div>");
		div.appendTo($(td));
		$("#"+divID).hide().fadeIn(1000);
		text = "P"+pid+" preempts on CPU"+cid;
		if(scheme == "global")
			$("#currentRunningP"+cid).empty();

	}
	if(type == "miss"){
		if(scheme == "partitioned")
			var td = "#miss-table"+cid+"td"+start;
		else{
			var td = "#miss-table-td"+start;
			if(cid >=0)
				$("#currentRunningP"+cid).empty();	
		}
		var div = $("<div class='event-div event' id='"+divID+"' style='width:40px;height:15px;color:red;top:0px;text-decoration:line-through;'>&nbsp&nbspP"+pid+"&nbsp&nbsp</div>");
		if($(td).html()){
			var top = $(td).children().last().css("top").slice(0,-2)-30;
			div.css("top",top+"px");
		}
		div.appendTo($(td));
		$("#"+divID).hide().fadeIn(1000);
		text = "P"+pid+" misses";
	}

	//draw readyQueue
	switch(scheme){
		case "partitioned":
			var td = "#currentRunningP"+cid;
			if(recorder.runningProcess != ""||recorder.runningProcess == "0")
				$(td).html("P"+recorder.runningProcess+" ("+recorder.runningProcessPriority+")");
			else
				$(td).html("");

			var td = "#result-readyqueue"+cid;
			$(td).empty();
			for(var i in recorder.readyQueue){
				var	div = $("<div class='readyQueue-div event' >P"+recorder.readyQueue[i]+" ("+recorder.readyQueuePriority[i]+")</div>");
				div.appendTo($(td));
				if(type != "miss")
					div.hide().fadeIn(700);
			}
			break;
		case "global":
			var td = "#global-readyqueue";
			$(td).empty();
			for(var i in recorder.readyQueue){
				var	div = $("<div class='readyQueue-div event' >P"+recorder.readyQueue[i]+" ("+recorder.readyQueuePriority[i]+")</div>");
				div.appendTo($(td));
				if(type != "miss")
					div.hide().fadeIn(700);
			}
			break;
	}


	//draw event recorder
	if(flag != 1){
		var div = $("<tr id='event-record"+eventIndex+"'><td class='col1'>"+start+"</td><td class='col2'>"+text+"</td></tr>");
		div.appendTo($("#result-recorder-table"));
		div.hide().fadeIn(700);
		var top = $("#result-recorder-div").scrollTop()+500;
		$("#result-recorder-div").scrollTop(top);
	}
}


/*
 * Function for delete current event
 */
function removeCurrentEvents(){
	var index = recorder_manager.getCurrentIndex();
	for(var i in recorder_manager.recorderSequence[index]){
		var recorderIndex = recorder_manager.recorderSequence[index][i];
		$("#event-record"+recorderIndex).fadeOut(300,function(){ $("#event-record"+recorderIndex).remove();});
		if(i == recorder_manager.recorderSequence[index].length-1)
			deleteEvent(recorderIndex,1);
		else
			deleteEvent(recorderIndex,0);
	}
}

function deleteEvent(eventIndex,flag){
	if(flag == 1){
		$("#result-div"+eventIndex).fadeOut(300,function(){
			$(".event").remove();
			var index = recorder_manager.getCurrentIndex();
			recorder_manager.resetIndex();	
			for(var i=0;i<index;i++){
				showNextEvents(1);
			}
			$(".event").stop(true,true);
		});
	}
	else
		$("#result-div"+eventIndex).fadeOut(300,function(){ this.remove();});
}


function showAllEvent(){
	$(".event").remove();
	$('#result-recorder-table').empty();
	recorder_manager.resetIndex();
	for(var i=0;i<recorder_manager.recorderSequence.length;i++){
		showNextEvents(0);
	}
	$(".event").stop(true,true);
}

function showStatistics() {
	
	// Show the statistics of the whole system
	var html = "<table class='table table-hover'><tr class='info'>"
				+ "<th>Number of CPUs</th>"
				+ "<th>Avg. Utilization</th>"
				+ "<th>Avg. Miss Rate</th>"
				+ "</tr>";
	// Specific data
	html += "<tr>"
			+ "<td>" +simulator.resourceList.length+ "</td>"
			+ "<td>" +statistics.averageUtilization.toPrecision(3)+ "</td>"
			+ "<td>" +statistics.averageMissRate.toPrecision(3)+ "</td>"
			+ "</tr>"
	 		+ "</table>";
	$("#statistics-system").html(html);

	// Show the statistics of per CPU
	html = "<table class='table table-hover'><tr class='info'>"
			+ "<th>CID</th>";			
	// if(simulator.scheme == "partitioned") {
	// 	html += "<th>Number of Processes</th>";
	// }
	html += "<th>Utilization</th>"
			+ "<th>Miss Rate</th>";
	// Specific data
	for(var i = 0; i < cpu_manager.CPUList.length; i++){
		var cpu = cpu_manager.CPUList[i];
			html += "<tr>"
					+ "<td>" +cpu.cid+ "</td>"		
					+ "<td>" +statistics.CPUUtilization[cpu.cid].toPrecision(3)+ "</td>";
					if(simulator.scheme == "partitioned")
						html +="<td>" +statistics.CPUMissRate[cpu.cid].toPrecision(3)+ "</td>";
					else
						html +="<td>NULL</td>";
			html += "</tr>";
	}
	html += "</table>";
	$("#statistics-cpu").html(html);

	// Show the statistics of per process
	html = "<table class='table table-hover'><tr class='info'>"
			+ "<th>PID</th>"			
			+ "<th>Utilization</th>"
			+ "<th>Miss Rate</th></tr>";
	// Specific data
	for(var i = 0; i < process_manager.processList.length; i++){
		var process = process_manager.processList[i];
			html += "<tr>"
					+ "<td>" +process.pid+ "</td>"		
					+ "<td>" +statistics.processUtilization[process.pid].toPrecision(3)+ "</td>"
					+ "<td>" +statistics.processMissRate[process.pid].toPrecision(3)+ "</td>"
					+ "</tr>";
	}
	html += "</table>";
	$("#statistics-process").html(html);
}

