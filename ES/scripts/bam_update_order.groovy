if(Events[0].message == null){
	Events[0].message = '';
}
if(ctx._source.status != status && status != null){
	Events[0].message += ' Changing order status from :' + ctx._source.status + 'to :' + status;
	ctx._source.status = status;
}

if(binding.variables.containsKey("Delivery")){
	if(ctx._source.Delivery.effectiveDate != Delivery.effectiveDate && Delivery.effectiveDate !=null){
		Events[0].message += ' Changing order delivery effective date :' + ctx._source.Delivery.effectiveDate + 'to :' + Delivery.effectiveDate;
		ctx._source.Delivery.effectiveDate = Delivery.effectiveDate;
	}
}
if(binding.variables.containsKey("Amount")){
	if(ctx._source.Amount != Amount){
		Events[0].message += ' Changing amount :' + ctx._source.Amount + 'to :' + Amount;
		ctx._source.Amount = Amount;
	}
}

if(binding.variables.containsKey("Lines")){
	for (val in Lines){
		Boolean found = false;
		int j = 0;
		int size = Lines.size();
		while (found == false && j < size){
			if(val.code == ctx._source.Lines[j].code)
				found = true;
			else
				j++;
		}//while*/

		if(found == true){
			String message = '';
			
			if(ctx._source.Lines[j].status != val.status && val.status!=null){
				message += '\n - status from: "' + ctx._source.Lines[j].status + '" to: "' + val.status + '"';
				ctx._source.Lines[j].status = val.status;
			}
			if(ctx._source.Lines[j].quantity != val.quantity && val.quantity!=null){
				message += '\n - quantity from: "' + ctx._source.Lines[j].quantity + '" to: "' + val.quantity + '"';
				ctx._source.Lines[j].quantity = val.quantity;
			}
			if(ctx._source.Lines[j].expecteDeliveryDate != val.expecteDeliveryDate &&  val.expecteDeliveryDate !=null){
				message += '\n - expecteDeliveryDate from: "' + ctx._source.Lines[j].expecteDeliveryDate + '" to: "' + val.expecteDeliveryDate + '"';
				ctx._source.Lines[j].expecteDeliveryDate = val.expecteDeliveryDate;
			}
			if(ctx._source.Lines[j].backOrderQuantity != val.backOrderQuantity && val.backOrderQuantity !=null){
				message += '\n - backOrderQuantity from: "' + ctx._source.Lines[j].backOrderQuantity + '" to: "' + val.backOrderQuantity + '"';
				ctx._source.Lines[j].backOrderQuantity = val.backOrderQuantity;
			}
			if(ctx._source.Lines[j].shippingMethod != val.shippingMethod && val.shippingMethod !=null){
				message += '\n - shippingMethod from: "' + ctx._source.Lines[j].shippingMethod + '" to: "' + val.shippingMethod + '"';
				ctx._source.Lines[j].shippingMethod = val.shippingMethod;
			}
			if(message != ''){
				Events[0].message += '\n' + 'Procuct code: "' + val.code +'" ' + message
			}
			
		}else{ //Not found adding the line
			ctx._source.Lines += val;
			Events[0].message += '\n' + 'Adding procuct code: "' + val.productCode + '"';
		}
	}//for
}//if
ctx._source.Events += Events;