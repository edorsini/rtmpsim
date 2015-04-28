
function Simulator(scheme, algorithm, resourceList, processList) {
	
	this.scheme = scheme !== undefined ? scheme : "";
	this.algorithm = algorithm !== undefined ? algorithm : ""; 
	this.resourceList = resourceList !== undefined ? resourceList : [];
	this.processList = processList !== undefined ? processList : [];
	this.finishEventList = [];	
	this.globalReadyQueue = [];		//for global scheme
	this.leastPriorityProcess = "";	//for global scheme
	this.idleCPUList = [];//for global scheme
	this.totalRunningTime = 50; //axis execution time range
	this.totalExecutionTime = 10000; //statistics calculation time range

	this.startSimulator = function() {
		switch(this.scheme){
			case "partitioned":
				partitioningStrategy();
				switch(this.algorithm){
					case "P-EDF":
						P_EDF();
						break;
					case "P-RMS":
						P_RMS();
						break;
				}
				break;
			case "global": 
				switch(this.algorithm){
					case "G-EDF":
						G_EDF();
						break;
					case "G-RMS":
						G_RMS();
						break;
					case "G-LLF":
						G_LLF();
						break;
				}
				break;
		}
	}

	/*
	 * Calculate total process utilization and total CPU remaining utilization,
	 * then compare them. The compare result would be "overload" or "underload".
	 */
	this.compareTotalProcessUtilWithTotalCpuRemainingUtil = function() {
		// Calculate total process utilization
		var pList = process_manager.processList;
		var totalProUtil = 0;
		for (var i in pList) {
			totalProUtil += parseInt(pList[i].execTime) / parseInt(pList[i].period);
		}
		
		// Calculate total CPU remaining utilization
		var totalCpuUtil = cpu_manager.CPUList.length;  // Each initial CPU remaining utilization is 1

		// Compare these two total utilization
		if (totalProUtil <= totalCpuUtil)
			return {
					"totalProUtil" : Number(totalProUtil.toFixed(2)), 
					"totalCpuUtil" : totalCpuUtil, 
					"condition" : "Underload"
					};
		else if (totalProUtil > totalCpuUtil)
			return {
					"totalProUtil" : Number(totalProUtil.toFixed(2)), 
					"totalCpuUtil" : totalCpuUtil, 
					"condition" : "Overload"
					};
	}

	// Calculate the utilization for each resource
	// this.calculateUtilization = function() {
	// 	var utilList = [];
	// 	for (var i in this.resourceList) {
	// 		var remainingUtil = this.resourceList[i].remainingUtil
	// 		if (remainingUtil < 0) 
	// 			utilList.push(1);
	// 		else 
	// 			utilList.push(1 - remainingUtil);
	// 	}
	// 	return utilList;
	// }


	// /*
	//  * Set min frame size 12, and max frame size 30
	//  */
	// this.setFrameSize = function() {
	// 	var hyperperiod = this.calculateHyperperiod();
	// 	if (hyperperiod < 12)  // hyperperiod is less than 12
	// 		this.frameSize = 12;
	// 	else if (hyperperiod >= 12 && hyperperiod <=30)  // hyperperiod is between 12 and 30
	// 		this.frameSize = hyperperiod;
	// 	else  // hyperperiod is more than 30
	// 		this.frameSize = 30;
	// }

	// /* Calculate the hyperperiod begin */

	// /*
	//  * Formula: hyperperiod = lcm[P0(arrival time + period), P1(arrival time + period), ...]
	//  */
	// this.calculateHyperperiod = function() {
	// 	var periodList = [];
	// 	for (var i in this.processList) {
	// 		periodList.push(parseInt(this.processList[i].arrivalTime) + parseInt(this.processList[i].period));
	// 	}
	// 	return this.lcm_nums(periodList);
	// }

	// this.gcf = function(a, b) { 
	// 	return (b == 0) ? (a) : (this.gcf(b, a % b)); 
	// }
	
	// this.lcm = function(a, b) { 
	// 	return (a / this.gcf(a,b)) * b; 
	// }

	// // Calculate the least common multiple
	// this.lcm_nums = function(ar) {
	// 	if (ar.length > 1) {
	// 		ar.push(this.lcm(ar.shift(), ar.shift()));
	// 		return this.lcm_nums(ar);
	// 	} else {
	// 		return ar[0];
	// 	}
	// }

	/* Calculate the hyperperiod end */

}
