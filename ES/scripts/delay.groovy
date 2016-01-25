max=0;
for(line in doc['Lines.expectedDeliveryDate'].values)
	 max=max(line,max );
return max;