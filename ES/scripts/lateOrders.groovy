maxTs=0;
max=0;
if(doc['Lines.code'].size() == 0)
	return false;

for(event in  doc['Events.ts'].values)
	 maxTs=max(event ,maxTs );
	
for(line in doc['Lines.expectedDeliveryDate'].values)
	 max=max(line,max );    
	
return(maxTs>max);