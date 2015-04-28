/*
 * Partioned CPU allocation Scheme (Greedy)
 * Current process is allocated to the CPU 
 * whose remaining utilization is the largest
 */
function partitioningStrategy() {

	var simPList = simulator.processList;
	var simRList = simulator.resourceList;
	var manPList = process_manager.processList;

	for (var i in simPList) {

		// Find the CPU whose remaining utilization is the largest
		var targetCid = simRList[0].cid;
		var targetReUtil = simRList[0].remainingUtil;
		var targetRListIndex = 0;

		for (var j = 0; j < simRList.length - 1; j++) {
			if (targetReUtil < simRList[j+1].remainingUtil) {
				targetReUtil = simRList[j+1].remainingUtil;
				targetCid = simRList[j+1].cid;
				targetRListIndex = j + 1;
			}
		}

		// Allocate current process to the target CPU
		simPList[i].assignedCPU = targetCid;
		manPList[i].assignedCPU = targetCid;

		// Update this target CPU's remaining utilization
		simRList[targetRListIndex].remainingUtil = targetReUtil - simPList[i].execTime / simPList[i].period;

	}

}