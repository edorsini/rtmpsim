/*
 * Function for checking and handling new process arrival event 
 */ 
function checkAndHandleArrivalProcess(time, resource){
	var algorithm = simulator.algorithm;
	switch(algorithm){
		case "P-EDF":
			var pList = simulator.processList;
			var interruptOccur = 0;
			var deadline = resource.runningProcess.deadline;

			for(var i in pList){
				//check and find new arrival process		
				if((pList[i].arrivalTime == time ) && (pList[i].assignedCPU == resource.cid)){	
					var newP = new Process(pList[i].pid, pList[i].arrivalTime, pList[i].execTime, pList[i].period, pList[i].assignedCPU);
					pList[i].arrivalTime = pList[i].deadline;
					pList[i].deadline = parseInt(pList[i].deadline) + parseInt(pList[i].period);	
					//update readyqueue
					handleArrvialEvent(newP,resource);
					//check preempt
					if(parseInt(deadline) > parseInt(newP.deadline)){
						//handle preempt	
						handleInterrupt(time, resource);	
						//record interrupt event
						recorder_manager.recordNewEvent(newP.pid,resource.cid,"interrupt",newP.arrivalTime,newP.arrivalTime,resource.readyQueue,"");
						deadline = newP.deadline;
						interruptOccur = 1; 			
					}
					else
						//record new arrival event
						recorder_manager.recordNewEvent(newP.pid,resource.cid,"arrival",newP.arrivalTime,newP.arrivalTime,resource.readyQueue,resource.runningProcess);
				}
			}
			//execute preempt process
			if(interruptOccur == 1){	
				executionProcess(time, resource);
			}
			break;
		case "P-RMS":
			var pList = simulator.processList;
			var interruptOccur = 0;
			var period = resource.runningProcess.period;

			for(var i in pList){
				//check and find new arrival process		
				if((pList[i].arrivalTime == time ) && (pList[i].assignedCPU == resource.cid)){
					var newP = new Process(pList[i].pid, pList[i].arrivalTime, pList[i].execTime, pList[i].period, pList[i].assignedCPU);
					pList[i].arrivalTime = pList[i].deadline;
					pList[i].deadline = parseInt(pList[i].deadline) + parseInt(pList[i].period);	
					//update readyqueue
					handleArrvialEvent(newP,resource);
					//check preempt
					if(parseInt(period) > parseInt(newP.period)){
						//alert(period+"|"+newP.period);
						//handle preempt	
						handleInterrupt(time,resource);
						//record interrupt event
						recorder_manager.recordNewEvent(newP.pid,resource.cid,"interrupt",newP.arrivalTime,newP.arrivalTime,resource.readyQueue,"");
						period = newP.period;
						interruptOccur = 1; 			
					}
					else
						//record new arrival event
						recorder_manager.recordNewEvent(newP.pid,resource.cid,"arrival",newP.arrivalTime,newP.arrivalTime,resource.readyQueue,resource.runningProcess);
				}
			}
			//execute preempt process
			if(interruptOccur == 1){	
				executionProcess(time,resource);
			}
			break;
		case "G-EDF":
			var pList = simulator.processList;
			var arrivalPs = [];

			for(var i in pList){		
				if(pList[i].arrivalTime == time){
					var newP = new Process(pList[i].pid, pList[i].arrivalTime, pList[i].execTime, pList[i].period, "");
					arrivalPs.push(newP);
					pList[i].arrivalTime = pList[i].deadline;
					pList[i].deadline = parseInt(pList[i].deadline) + parseInt(pList[i].period);	
					handleArrvialEvent(newP);
					recorder_manager.recordNewEvent(newP.pid,-1,"arrival",newP.arrivalTime,newP.arrivalTime,simulator.globalReadyQueue,"");
				}
			}
			arrivalPs.sort(function(a,b){return a.deadline-b.deadline;});
			for(var i in arrivalPs){
				if(arrivalPs[i].deadline == simulator.globalReadyQueue[0].deadline && arrivalPs[i].pid == simulator.globalReadyQueue[0].pid){
					if(simulator.idleCPUList.length != 0){			
						executionProcess(time,simulator.idleCPUList[0]);
					}
					else if(parseInt(simulator.leastPriorityProcess.deadline) > parseInt(arrivalPs[i].deadline)){
						var resource = "";
						for(var j in simulator.resourceList){
							if(simulator.resourceList[j].cid == simulator.leastPriorityProcess.assignedCPU)
								resource = simulator.resourceList[j];
						}
						handleInterrupt(time,resource);
						recorder_manager.recordNewEvent(arrivalPs[i].pid,resource.cid,"interrupt",arrivalPs[i].arrivalTime,arrivalPs[i].arrivalTime,simulator.globalReadyQueue,"");			
						executionProcess(time,resource);
					}
				}
			}
			break;
		case "G-RMS":
			var pList = simulator.processList;
			var arrivalPs = [];

			for(var i in pList){		
				if(pList[i].arrivalTime == time){
					var newP = new Process(pList[i].pid, pList[i].arrivalTime, pList[i].execTime, pList[i].period, "");
					arrivalPs.push(newP);
					pList[i].arrivalTime = pList[i].deadline;
					pList[i].deadline = parseInt(pList[i].deadline) + parseInt(pList[i].period);	
					handleArrvialEvent(newP);
					recorder_manager.recordNewEvent(newP.pid,-1,"arrival",newP.arrivalTime,newP.arrivalTime,simulator.globalReadyQueue,"");
				}
			}
			arrivalPs.sort(function(a,b){return a.period-b.period;});
			for(var i in arrivalPs){
				if(arrivalPs[i].period == simulator.globalReadyQueue[0].period && arrivalPs[i].pid == simulator.globalReadyQueue[0].pid){
					if(simulator.idleCPUList.length != 0){			
						executionProcess(time,simulator.idleCPUList[0]);
					}
					else if(parseInt(simulator.leastPriorityProcess.period) > parseInt(arrivalPs[i].period)){
						var resource = "";
						for(var j in simulator.resourceList){
							if(simulator.resourceList[j].cid == simulator.leastPriorityProcess.assignedCPU)
								resource = simulator.resourceList[j];
						}
						handleInterrupt(time,resource);
						recorder_manager.recordNewEvent(arrivalPs[i].pid,resource.cid,"interrupt",arrivalPs[i].arrivalTime,arrivalPs[i].arrivalTime,simulator.globalReadyQueue,"");			
						executionProcess(time,resource);
					}
				}
			}
			break;
		// LLF ************************************************************
		case "G-LLF":
			var pList = simulator.processList;
			var arrivalPs = [];

			for(var i in pList){		
				if(pList[i].arrivalTime == time){
					var newP = new Process(pList[i].pid, pList[i].arrivalTime, pList[i].execTime, pList[i].period, "");
					arrivalPs.push(newP);
					pList[i].arrivalTime = pList[i].deadline;
					pList[i].deadline = parseInt(pList[i].deadline) + parseInt(pList[i].period);	
					handleArrvialEvent(newP, "", "", time); // modifies ready queue
					recorder_manager.recordNewEvent(newP.pid,-1,"arrival",newP.arrivalTime,newP.arrivalTime,simulator.globalReadyQueue,"", time);
				}
			}
			arrivalPs.sort(function(a,b,time){return (parseInt(a.deadline) - parseInt(time) - parseInt(a.remainingTime)) - (parseInt(b.deadline) - parseInt(time) - parseInt(b.remainingTime)) ;});
			for(var i in arrivalPs){
				if((parseInt(arrivalPs[i].deadline) - parseInt(time) - parseInt(arrivalPs[i].remainingTime)) == (parseInt(simulator.globalReadyQueue[0].deadline) - parseInt(time) - parseInt(simulator.globalReadyQueue[0].remainingTime)) && arrivalPs[i].pid == simulator.globalReadyQueue[0].pid){
					if(simulator.idleCPUList.length != 0){			
						executionProcess(time,simulator.idleCPUList[0]);
					}
					else if((parseInt(simulator.leastPriorityProcess.deadline) - parseInt(time) - parseInt(simulator.leastPriorityProcess.remainingTime)) > (parseInt(arrivalPs[i].deadline) - parseInt(time) - parseInt(arrivalPs[i].remainingTime))) {
						var resource = "";
						for(var j in simulator.resourceList){
							if(simulator.resourceList[j].cid == simulator.leastPriorityProcess.assignedCPU)
								resource = simulator.resourceList[j];
						}
						handleInterrupt(time,resource);
						recorder_manager.recordNewEvent(arrivalPs[i].pid,resource.cid,"interrupt",arrivalPs[i].arrivalTime,arrivalPs[i].arrivalTime,simulator.globalReadyQueue,"", time);			
						executionProcess(time,resource);
					}
				}
			}
			break;
	}	
}
/*
 * Function for updating readyqueue
 * flag =1 represents interruption arrival event
 */ 
function handleArrvialEvent(arrivalP,resource,flag, time){

	var algorithm = simulator.algorithm;
	switch(algorithm){
		case "P-EDF":
			var readyQueue = resource.readyQueue;
			readyQueue.push(arrivalP);
			for(var t = readyQueue.length-2;t>=0;t--){
				if(parseInt(arrivalP.deadline) < parseInt(readyQueue[t].deadline)){ // if arrival preocee deadline is equal with other, put it first place
					var temp = readyQueue[t];
					readyQueue[t]=arrivalP;
					readyQueue[t+1]=temp;
				}
			}
			break;
		case "P-RMS":
			var readyQueue = resource.readyQueue;
			readyQueue.push(arrivalP);
			for(var t = readyQueue.length-2;t>=0;t--){
				if(flag == 1){
					if(parseInt(arrivalP.period) <= parseInt(readyQueue[t].period)){ // if arrival preocee deadline is equal with other, put it first place
						var temp = readyQueue[t];
						readyQueue[t]=arrivalP;
						readyQueue[t+1]=temp;
					}
				}
				else{
					if(parseInt(arrivalP.period) < parseInt(readyQueue[t].period)){ // if arrival preocee deadline is equal with other, put it first place
						var temp = readyQueue[t];
						readyQueue[t]=arrivalP;
						readyQueue[t+1]=temp;
					}	
				}
			}
			break;
		case "G-EDF":
			var readyQueue = simulator.globalReadyQueue;
			readyQueue.push(arrivalP);
			for(var t = readyQueue.length-2;t>=0;t--){
				if(parseInt(arrivalP.deadline) < parseInt(readyQueue[t].deadline)){ // if arrival preocee deadline is equal with other, put it first place
					var temp = readyQueue[t];
					readyQueue[t]=arrivalP;
					readyQueue[t+1]=temp;
				}
			}
			break;
		case "G-RMS":
			var readyQueue = simulator.globalReadyQueue;
			readyQueue.push(arrivalP);
			for(var t = readyQueue.length-2;t>=0;t--){
				if(flag == 1){
					if(parseInt(arrivalP.period) <= parseInt(readyQueue[t].period)){ // if arrival preocee deadline is equal with other, put it first place
						var temp = readyQueue[t];
						readyQueue[t]=arrivalP;
						readyQueue[t+1]=temp;
					}
				}
				else{
					if(parseInt(arrivalP.period) < parseInt(readyQueue[t].period)){ // if arrival preocee deadline is equal with other, put it first place
					var temp = readyQueue[t];
					readyQueue[t]=arrivalP;
					readyQueue[t+1]=temp;
					}	
				}
			}
			break;
		case "G-LLF":
			var readyQueue = simulator.globalReadyQueue;
			readyQueue.push(arrivalP);
			for(var t = readyQueue.length-2;t>=0;t--){
				if( (parseInt(arrivalP.deadline) - parseInt(time) - parseInt(arrivalP.remainingTime) ) < (parseInt(readyQueue[t].deadline) - parseInt(time) - parseInt(readyQueue[t].remainingTime))  ){ 
					var temp = readyQueue[t];
					readyQueue[t]=arrivalP;
					readyQueue[t+1]=temp;
				}
			}
			break;
	}
}
/*
 * Function for execution process and record
 */ 
function executionProcess(time,resource){
	var scheme = simulator.scheme;
	switch(scheme){
		case "partitioned":
			if(resource.readyQueue.length!=0){
				var execP = resource.readyQueue.shift();
				execP.startTime = time;	
				simulator.finishEventList.push(execP);		

				resource.status = 1;
				resource.runningProcess = execP;
				//record new execution event
				recorder_manager.recordNewEvent(execP.pid,resource.cid,"execution",time,parseInt(execP.execTime)+parseInt(execP.startTime),resource.readyQueue, resource.runningProcess);
			}
			break;
		case "global":
			if(simulator.globalReadyQueue.length!=0){
				var execP = simulator.globalReadyQueue.shift();
				execP.startTime = time;
				execP.assignedCPU = resource.cid;
				simulator.finishEventList.push(execP);		
				resource.status = 1;
				resource.runningProcess = execP;

				updateIdleCPUListAndLeastPriorityProcess(time);
				//record new execution event
				recorder_manager.recordNewEvent(execP.pid,resource.cid,"execution",time,parseInt(execP.execTime)+parseInt(execP.startTime),simulator.globalReadyQueue, execP, time);
				
			}
			break;
	}
}
/*
 * Function for checking and handling process finish event
 */ 
function checkAndHandleFinishProcess(time,resource){

	var finishList = simulator.finishEventList;
	for(var i in finishList){
		if( parseInt(finishList[i].startTime)+parseInt(finishList[i].execTime) == time && resource.cid == finishList[i].assignedCPU){
			handleFinishEvent(finishList[i],resource);
			
		}
	}
}
/*
 * Function for updating finishprocesslist and cpu status
 */ 
function handleFinishEvent(process,resource){
	resource.status = 0;
	resource.runningProcess = "";	
	deleteFinishEvent(process.pid,process.assignedCPU,process.startTime);
	if(simulator.scheme == "global"){
		updateIdleCPUListAndLeastPriorityProcess();
	}
}
/*
 * Function for deleting corresponding process form processfinishlist
 */ 
function deleteFinishEvent(pid,cid,startTime){
	for(var i in simulator.finishEventList){
		if(simulator.finishEventList[i].pid == pid&&simulator.finishEventList[i].assignedCPU == cid&&simulator.finishEventList[i].startTime == startTime)
			simulator.finishEventList.splice(i,1);
	}
}
/*
 * Function for handling preempt event and record
 */ 
function handleInterrupt(time, resource){
	if(resource.runningProcess){
		var interP = resource.runningProcess;
		interP.execTime = interP.execTime-(time - interP.startTime);

		//put it into ready queue
		handleArrvialEvent(interP,resource,1, time);
		//delete interrupt previous finish event
		handleFinishEvent(interP,resource);
		//modify interrupted process execution recorder
		modifyRecorderEndTime(interP.pid, interP.assignedCPU, interP.startTime, "execution", time );
	}
}
/*
 * Function for checking process miss deadling event and record
 */ 
function checkMissEvent(time, resource){
	var scheme = simulator.scheme;
	switch(scheme){
		case "partitioned":
			var process = resource.runningProcess;
			if((parseInt(process.startTime)+parseInt(process.execTime)) > parseInt(process.deadline) && process.deadline == time){
				//if running process misses its deadline, abandon its rest parts
				handleFinishEvent(process,resource);
				modifyRecorderEndTime(process.pid,resource.cid,process.startTime,"execution",time);
				recorder_manager.recordNewEvent(process.pid,resource.cid,"miss",time,time,resource.readyQueue,resource.runningProcess);
			}

			var readyQueue = resource.readyQueue;
			for(var i=0 ;i<readyQueue.length;i++){
				if(i >= readyQueue.length)
						break;
				if(time == readyQueue[i].deadline){	
					//if miss, abandon this process
					var pid = readyQueue[i].pid;
					readyQueue.splice(i,1);
					i--;
					recorder_manager.recordNewEvent(pid,resource.cid,"miss",time,time,resource.readyQueue,resource.runningProcess);
				}
			}
			break;
		case "global":
			var readyQueue = simulator.globalReadyQueue;
			for(var i in simulator.resourceList){
				if(simulator.resourceList[i].status == 1){
					var process = simulator.resourceList[i].runningProcess;
					var resource = simulator.resourceList[i];
					if((parseInt(process.startTime)+parseInt(process.execTime)) > parseInt(process.deadline) && process.deadline == time){
						//if running process misses its deadline, abandon its rest parts
						handleFinishEvent(process,resource);
						modifyRecorderEndTime(process.pid,resource.cid,process.startTime,"execution",time);
						recorder_manager.recordNewEvent(process.pid,resource.cid,"miss",time,time,readyQueue,"", time);
					}
				}
			}
			// for(var i in readyQueue){
			// 	if(time == readyQueue[i].deadline){
			// 		recorder_manager.recordNewEvent(readyQueue[i].pid,-1,"miss",time,time,readyQueue,"");
			// 	}
			// }
			for(var i=0 ;i<readyQueue.length;i++){
				if(i >= readyQueue.length)
						break;
				if(time == readyQueue[i].deadline){	
					//if miss, abandon this process
					var pid = readyQueue[i].pid;
					readyQueue.splice(i,1);
					i--;
					recorder_manager.recordNewEvent(pid,-1,"miss",time,time,readyQueue,"");
				}
			}
			break;
	}
}
/*
 * Function for modify previous recorder when preempt occurs
 */ 
function modifyRecorderEndTime(pid,cid,startTime,eventType,newEndTime){
	for(var i=recorder_manager.recorderList.length-1;i>=0;i--){
		var temp = recorder_manager.recorderList[i];
		if(cid == temp.cid && startTime == temp.eventStartTime && pid == temp.pid && eventType == temp.eventType){
			recorder_manager.recorderList[i].eventEndTime = newEndTime;
			break;
		}
	}
}
/*
 * Function for updating cpu idle list and find process whose priority is least
 */ 
function updateIdleCPUListAndLeastPriorityProcess(time){
	var algorithm = simulator.algorithm;
	switch(algorithm){
		case "G-EDF":
			simulator.idleCPUList.length = 0;
			var deadline = -1;
			for(var i in simulator.resourceList){
				if(simulator.resourceList[i].status == 0){
					simulator.idleCPUList.push(simulator.resourceList[i]);
				}
				else{
					if(parseInt(simulator.resourceList[i].runningProcess.deadline) > parseInt(deadline)){
						deadline = simulator.resourceList[i].runningProcess.deadline;
						simulator.leastPriorityProcess = simulator.resourceList[i].runningProcess;
					}
				}
			}
			break;
		case "G-RMS":
			simulator.idleCPUList.length = 0;
			var period = -1;
			for(var i in simulator.resourceList){
				if(simulator.resourceList[i].status == 0){
					simulator.idleCPUList.push(simulator.resourceList[i]);
				}
				else{
					if(parseInt(simulator.resourceList[i].runningProcess.period) > parseInt(period)){
						period = simulator.resourceList[i].runningProcess.period;
						simulator.leastPriorityProcess = simulator.resourceList[i].runningProcess;
					}
				}
			}
			break;
		case "G-LLF":
			simulator.idleCPUList.length = 0;
			var slack = -1;
			for(var i in simulator.resourceList){
				if(simulator.resourceList[i].status == 0){
					simulator.idleCPUList.push(simulator.resourceList[i]);
				}
				else{
					if(( parseInt(simulator.resourceList[i].runningProcess.deadline) - parseInt(time) - parseInt(simulator.resourceList[i].runningProcess.remainingTime)) > parseInt(slack)){
						slack = simulator.resourceList[i].runningProcess.deadline-time-simulator.resourceList[i].runningProcess.remainingTime;
						simulator.leastPriorityProcess = simulator.resourceList[i].runningProcess;
					}
				}
			}
			break;
	}
}