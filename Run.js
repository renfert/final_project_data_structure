runAct = function(act,num) {
	if (isBusy) return;

	num = parseInt(num,10);
	if (isNaN(num)) num = 0;

	


	var foc = 'act';
	switch (act) {
		case 'error':
			break;
		case 'bld':
			myTree = new tree(num);
			maxDisplay = num * 50;
			hist = [];
			hist[0] = 'myTree = new tree('+num+');'; 
			break;
		case 'add':
			myTree.insert(num,num);
			hist.push('myTree.insert('+num+','+num+');');
			foc = 'num';
			ge$('num').value = '';
			break;
		case 'del':
			if (num == 0) {
				myTree.remove();
				hist.push('myTree.remove();');
			} else {
				myTree.remove(num);
				hist.push('myTree.remove('+num+');');
			}
			foc = 'num';
			ge$('num').value = '';
			break;
		case 'seek':
			myTree.seek(num);
			hist.push('myTree.seek('+num+');');
			foc = 'num';
			break;
		
		
		
	}

	
    

    
}
