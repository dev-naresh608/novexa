export async function onCartItemQtyChange(e, currentUser, setCurrentUser) {
  const itemId = e.target.id;
  const itemQty = e.target.value;

  const updatedCart = currentUser.myCart.map((item) => {
    if (item._id === itemId) {
      return { ...item, product_qty: itemQty };
    }
    return item;
  });

  setCurrentUser({
    ...currentUser,
    myCart: updatedCart,
  });
}

export async function onCartItemDeleteBtn(
  productId,
  currentUser,
  setCurrentUser,
) {

  const updatedCart = currentUser.myCart.filter((p) => p._id !== productId);


  setCurrentUser({
    ...currentUser,
    myCart: updatedCart,
  });

  return;
}
