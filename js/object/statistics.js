/*
 * Statistics object
 */
function Statistics() {
	this.processArrivalTimes = [];
	this.CPUArrivalTimes = [];
	this.processRunningTime = [];
	this.CPURunningTime = [];
	this.processMissTimes = [];
	this.CPUMissTimes = [];
	this.CPUPeriods = [];

	this.processUtilization = [];
	this.processMissRate =[];
	this.CPUUtilization = [];
	this.CPUMissRate =[];
	this.averageUtilization = 0;
	this.averageMissRate = 0;

	//initialize the data
	this.initialize = function(){
		this.averageUtilization = 0;
		this.averageMissRate = 0;

		var CPUQty = simulator.resourceList.length;
		for(var i=0;i<CPUQty;i++ ){
			var cid = simulator.resourceList[i].cid;
			this.CPUArrivalTimes[cid] = 0;
			this.CPUMissTimes[cid] = 0;
			this.CPURunningTime[cid] = 0;
			this.CPUUtilization[cid] = 0;
			this.CPUMissRate[cid] = 0;
			this.CPUPeriods[cid] = 0;
		}

		var processQty = simulator.processList.length;
		for(var i=0;i<processQty;i++ ){
			var pid = simulator.processList[i].pid;
			this.processArrivalTimes[pid] = 0;
			this.processMissTimes[pid] = 0;
			this.processRunningTime[pid] = 0;
			this.processUtilization[pid] = 0;
			this.processMissRate[pid] = 0;
		}
	}
	//calculate the data
	this.calculation = function(){
		var scheme = simulator.scheme;
		var totalMissTimes = 0;
		for(var i in recorder_manager.recorderList){
			var recorder = recorder_manager.recorderList[i];
			if(recorder.eventType == "execution"){
				var end = recorder.eventEndTime;
				var start = recorder.eventStartTime;
				if(recorder.eventEndTime > simulator.totalExecutionTime)
					end = simulator.totalExecutionTime;
				this.CPURunningTime[recorder.cid] += (end - start);
			}
			if(recorder.eventType == "miss"){
				this.processMissTimes[recorder.pid] ++;
				totalMissTimes++;
				if(scheme == "partitioned"){
					this.CPUMissTimes[recorder.cid]++;
				}
			}
		}

		var processQty = simulator.processList.length;
		var totalPeriods = 0;
		for(var i=0;i<processQty;i++){
			var pid = simulator.processList[i].pid;
			var cid = simulator.processList[i].assignedCPU;
			var periods = parseInt((simulator.totalExecutionTime-simulator.processList[i].firstArrivalTime)/simulator.processList[i].period);
			
			this.processUtilization[pid] = simulator.processList[i].execTime/simulator.processList[i].period;
			this.processMissRate[pid] = this.processMissTimes[pid]/periods;
			totalPeriods += periods;
			if(scheme == "partitioned")
				this.CPUPeriods[cid] +=periods;
		}
		this.averageMissRate = totalMissTimes/totalPeriods;

		var CPUQty = simulator.resourceList.length;
		var totalUtilization = 0;

		for(var i=0;i<CPUQty;i++){
			var cid = simulator.resourceList[i].cid;
			this.CPUUtilization[cid] = this.CPURunningTime[cid]/simulator.totalExecutionTime;
			totalUtilization += this.CPUUtilization[cid];
			if(scheme == "partitioned")
				this.CPUMissRate[cid] = this.CPUMissTimes[cid]/this.CPUPeriods[cid];
		}
		this.averageUtilization = totalUtilization/CPUQty;
	}
}