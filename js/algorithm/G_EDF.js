/*
 * Function for G_EDF algorithm
 */ 
function G_EDF(){
	//initialize idle CPU list and find the process whose priority(deadline) is least
	updateIdleCPUListAndLeastPriorityProcess();

	//simulate 0~totalRunningTime time unit
	for(var i=0; i <= simulator.totalExecutionTime; i++){
		//check deadline miss event and record
		checkMissEvent(i);

		//check process finish event and handle it 
		for(var j in simulator.resourceList){
			var resource = simulator.resourceList[j];
			checkAndHandleFinishProcess(i,resource);		
		}	
		
		//check arrival process and handle it 
		checkAndHandleArrivalProcess(i,resource);

		//if there is an idle CPU left, allocate this cpu to the first process in the global ready queue
		while(1){
			if(simulator.idleCPUList.length == 0||simulator.globalReadyQueue.length == 0)
				break;
			executionProcess(i,simulator.idleCPUList[0]);
		}
	}
}