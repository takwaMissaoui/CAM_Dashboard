
library('elastic');
connect(es_base = "http://10.155.51.12", es_port = 9200);


index<-c("nl","sw");



retrieveData<-function(idx){
idx<-toString(idx);




# read order request
con <- file("RFiles/CAM/request/getDataOrder.txt", open = "r");
data.order<-readLines(con);
close(con)
#read product request
con <- file("RFiles/CAM/request/getDataProduct.txt", open = "r");
data.product<-readLines(con);
close(con)


# ----------------------------------------------get data from elasticsearch-----------------------
result.order<-Search(index = idx, type = 'order',body=data.order)$aggregations$group_by_customer$buckets;
result.product<-Search(index = idx, type = 'product',body=data.product)$aggregations$group_by_customer$buckets;

# -----------------------------------------------store data in dataframes -----------------------
un<-unlist(result.order, recursive=F);
output <- matrix(un, ncol = 11, byrow = TRUE)
nidham.order<-data.frame(output)
Cnames<-c("customerId","nb_order","nb_product_perOrder","avg_amount","nb_online_order","avg_orderPerMonth","total_amount","nb_offline_order","offline_amount","online_amount","Time_Preference");
colnames(nidham.order)<-Cnames;

un<-unlist(result.product, recursive=F);
output <- matrix(un, ncol = 6, byrow = TRUE)
nidham.product<-data.frame(output)
Cnames<-c("customerId","nb_product","nb_direct","nb_price","nb_search","nb_stock")
colnames(nidham.product)<-Cnames;

#-----------------------------------------------converting data type------------------------------ 
##can not convert list type to numeric directly

nidham.order$customerId<-as.character(nidham.order$customerId);

nidham.order$nb_order<-as.numeric(as.character(nidham.order$nb_order));

un<-unlist(nidham.order$nb_product_perOrder,recursive=F)
nidham.order$nb_product_perOrder<-as.numeric(as.character(un));

un<-unlist(nidham.order$avg_amount,recursive=F)
nidham.order$avg_amount<-as.numeric(as.character(un));

un<-unlist(nidham.order$nb_online_order,recursive=F)
nidham.order$nb_online_order<-as.numeric(as.character(un));

un<-unlist(nidham.order$total_amount,recursive=F)
nidham.order$total_amount<-as.numeric(as.character(un));

un<-unlist(nidham.order$nb_offline_order,recursive=F)
nidham.order$nb_offline_order<-as.numeric(as.character(un));

un<-unlist(nidham.order$offline_amount,recursive=F)
output<-matrix(un,ncol=2,byrow=T)
un<-unlist(output[,2],recursive=F)
nidham.order$offline_amount<-as.numeric(un)

un<-unlist(nidham.order$online_amount,recursive=F)
output<-matrix(un,ncol=2,byrow=T)
un<-unlist(output[,2],recursive=F)
nidham.order$online_amount<-as.numeric(un)

un<-unlist(nidham.order$avg_orderPerMonth,recursive=F)
nidham.order$avg_orderPerMonth<-as.numeric(as.character(un));

un<-unlist(nidham.order$Time_Preference,recursive=F)
nidham.order$Time_Preference<-as.numeric(as.character(un));

nidham.product$customerId<-as.character(nidham.product$customerId);

nidham.product$nb_product<-as.numeric(as.character(nidham.product$nb_product));

un<-unlist(nidham.product$nb_direct,recursive=F)
nidham.product$nb_direct<-as.numeric(as.character(un));

un<-unlist(nidham.product$nb_search,recursive=F)
nidham.product$nb_search<-as.numeric(as.character(un));

un<-unlist(nidham.product$nb_stock,recursive=F)
nidham.product$nb_stock<-as.numeric(as.character(un));

un<-unlist(nidham.product$nb_price,recursive=F)
nidham.product$nb_price<-as.numeric(as.character(un));
#-------------------------------------------------------------------merge dataframe

nidham<-merge(nidham.order, nidham.product, by = c("customerId"),all.x=T);

#-------------------------------------------------------------------replace NA values 
nidham[is.na(nidham)] <- 0
#--------------------------------------------------------------------create Folders: index,img,files

path<-idx
dir.create(path, showWarnings = TRUE, recursive = FALSE, mode = "0777")
Sys.chmod(path, mode = "0777", use_umask = TRUE)
Sys.umask(mode = NA)

path.img<-paste(path,"/img",sep="");
dir.create(path.img, showWarnings = TRUE, recursive = FALSE, mode = "0777")
Sys.chmod(path, mode = "0777", use_umask = TRUE)
Sys.umask(mode = NA)

path.files<-paste(path,"/files",sep="");
dir.create(path.files, showWarnings = TRUE, recursive = FALSE, mode = "0777")
Sys.chmod(path, mode = "0777", use_umask = TRUE)
Sys.umask(mode = NA)



return(nidham)
#------------------------------------------------------------------------------------
}




generateData <- function (a , b , nidham,idx,cluster) {

a<-as.numeric(a);
b<-as.numeric(b);
cluster<-as.numeric(cluster);
idx<-toString(idx);

path.img<-paste(idx,"/img/",sep="");
path.files<-paste(idx,"/files/",sep="");


nidham.actives<-nidham[,c(2:16)];
nidham.illus<-nidham$customerId;

nidham.draw<- nidham.actives[, c(a,b)]

nidham.kmeans<-kmeans(nidham.draw,cluster)
nidham.clustered<-cbind(nidham,nidham.kmeans$cluster)


filename <- paste(path.img,"i",a,"j",b,sep="");

png(filename)

plot (nidham.draw,pch=20,cex=3,type="p",col=c("red","blue","yellow") [nidham.kmeans$cluster])
points(nidham.kmeans$centers, pch = 4, cex = 4, lwd = 4)

dev.off()
filename<-paste(path.files,"i",a,"j",b,".csv",sep="");
write.csv(nidham.clustered, file = filename,row.names=FALSE)

}

generateIndexData<-function(nidham ,idx){
	for(i in 1:15){

		for(j in 1:15){
				if(i==10 & j==10)
					{generateData(i,j,nidham,idx,2);}
				else
					{generateData(i,j,nidham,idx,3);}

			}

	}

}

for(i in 1:length(index)){
nidham<-retrieveData(index[i]);
generateIndexData(nidham,index[i]);

}










