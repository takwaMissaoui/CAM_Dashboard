if (ctx._source.startTs > ts ) { 
	ctx._source.startTs = ts;
}
   
if (ctx._source.endTs < ts ) { 
	ctx._source.endTs = ts ; 
} 

ctx._source.duration = ctx._source.endTs - ctx._source.startTs;

if(Log.Service.payload.containsKey("in") && Log.Service.payload.in != null){
	ctx._source.Service.payload.in =  Log.Service.payload.in;
}
if(Log.Service.payload.containsKey("out") && Log.Service.payload.out != null){
	ctx._source.Service.payload.out =  Log.Service.payload.out;
}
if (Log.containsKey("Error")) {
	ctx._source.status = Log.status
	ctx._source.Error.severity = Log.Error.severity;
	ctx._source.Error.stacktrace = Log.Error.stacktrace;
	ctx._source.Error.type = Log.Error.type;
}