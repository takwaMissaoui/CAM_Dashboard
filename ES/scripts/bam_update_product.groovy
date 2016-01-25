ctx._source.browsed.stock  += browsed.stock;
ctx._source.browsed.search += browsed.search;
ctx._source.browsed.direct += browsed.direct;
ctx._source.browsed.price += browsed.price;

if(ctx._source.browsed.containsKey("browsed.orders") && ctx._source.browsed.orders !=null){
	ctx._source.browsed.orders += browsed.orders;
}else{
	ctx._source.browsed.orders = [];
	ctx._source.browsed.orders += browsed.orders
}



if(binding.variables.containsKey("stock") && stock !=null){
	for (val in stock){
		obj = ctx._source.stock.find{ it.branchId == val.branchId}
		if(obj){
			obj.quantity = val.quantity;
		}else{
			if(ctx._source.containsKey("stock") && ctx._source.stock !=null){
				ctx._source.stock += val;
			}else{
				ctx._source.stock = [];
				ctx._source.stock.push(val);
			}
		}
	}
}