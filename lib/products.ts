
export function getPrice(product, signed, user) {

    if (!product) {
        return 0;
    }
    if (signed) {
        if (product.pricePerZone) {
            var zonedPrice = product.pricePerZone.filter(
                price => {
                    return price.name == user.user.data.customer.priceId;
                })
            if (zonedPrice.length > 0) {
                return zonedPrice[0].values;
            }
            return product.price;
        }
        return product.price;
    }
    return product.price;
}

export const generateCartItem = (product, quantity, signed, user, cartProducts) => {
    let cartItem = {
        product: product,
        quantity: quantity,
        unitPrice: getPrice(product, signed, user),
    }

    let cartProductsData = [...cartProducts];
    let cartProductItem = cartProductsData.find((cartItemData) => cartItemData.product._id == cartItem.product._id);
    if (!cartProductItem) {
        cartProductItem = cartItem;
        cartProductsData.push(cartProductItem);
    }
    else {
        cartProductItem.quantity = cartProductItem.quantity + cartItem.quantity;
    }

    return cartProductsData;
}


export const removeCartItem = (product, quantity, cartProducts) => {
    let cartItem = {
        product: product,
    }
    let cartProductsData = [...cartProducts];

    let cartProductItem = cartProductsData.find((cartItemData) => cartItemData.product._id == cartItem.product._id);
    if (cartProductItem) {
        if (cartProductItem.quantity - quantity > 0) {
            cartProductItem.quantity = cartProductItem.quantity - quantity;
        }
        else {
            cartProductsData = cartProducts.filter((cartItemData) => cartItemData.product._id != cartItem.product._id);
        }
    }

    return cartProductsData;
}

export const cartItemExists = (product, cartProducts) => {
    let cartItem = {
        product: product,
    }
    if (cartProducts.find((cartItemData) => cartItemData.product._id == cartItem.product._id)) {
        return true;
    }
    return false;
}