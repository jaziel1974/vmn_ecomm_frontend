export const calculateShipping = (freigthType, totalCost, quantity) => {
    debugger;
    switch (freigthType) {
        case 'none':
            return 0;
        case '4itens':
            return quantity < 4 ? 10 : 0;
        case '100':
            return totalCost < 100 ? 10 : 0;
        case '200':
            return totalCost < 100 ? 20 : totalCost < 200 ? 10 : 0;
        default:
            return 0;
    }
}