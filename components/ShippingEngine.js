export const calculateShipping = (freigthType, price, quantity) => {
    switch (freigthType) {
        case 'none':
            return 0;
        case '4itens':
            return quantity < 4 ? 10 : 0;
        case '100':
            return price < 100 ? 10 : 0;
        case '200':
            return price < 100 ? 20 : price < 200 ? 10 : 0;
        default:
            return 0;
    }
}