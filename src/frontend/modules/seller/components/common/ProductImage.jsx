function ProductImage({ product_url, product_name }) {
  return (
    <div className="group hover:scale-105 duration-100 h-20 w-20 p-2 flex justify-center items-center bg-gray-200/50 border border-black/20 rounded-2xl">
      <img
        className="h-14 w-14 group-hover:scale-105 duration-150"
        src={product_url}
        alt={product_name}
      />
    </div>
  );
}

export default ProductImage;
