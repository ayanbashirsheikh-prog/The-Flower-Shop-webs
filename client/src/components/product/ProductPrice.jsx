export default function ProductPrice({
price,
oldPrice
}){

return(

<div className="flex items-center gap-3">

<h4 className="text-xl font-bold text-pink-600">

₹{price}

</h4>

<p className="line-through text-gray-400">

₹{oldPrice}

</p>

</div>

)

}