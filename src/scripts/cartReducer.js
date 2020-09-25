import componentsData from '../data/components.json';

export const types = {
    ADD_TO_CART: 'ADD_TO_CART',
    CLEAR_CART: 'CLEAR_CART',
    REMOVE_COMPONENT: 'REMOVE_COMPONENT',
    SUB_QUANTITY: 'SUB_QUANTITY',
    ADD_QUANTITY: 'ADD_QUANTITY'
};

export const addToCart = (id, quantity, section) => {
    return {
        type: types.ADD_TO_CART,
        id,
        quantity,
        section
    }
}

export const clearCart = () => {
    return {
        type: types.CLEAR_CART,
    }
}

export const removeItem = (id) => {
    return {
        type: types.REMOVE_COMPONENT,
        id
    }
}

export const subtractQuantity = (id) => {
    return {
        type: types.SUB_QUANTITY,
        id
    }
}

export const addQuantity = (id) => {
    return {
        type: types.ADD_QUANTITY,
        id
    }
}

const defaultState = {
    components: componentsData.components,
    addedItems: {},
}

export const loadState = () => {
    try {
        const serializedState = localStorage.getItem('addedItems');
        if (serializedState === null)
            return defaultState;

        return {
            components: defaultState.components,
            addedItems: JSON.parse(serializedState)
        }
    } catch (err) {
        return defaultState;
    }
};

const initState = loadState();

export const saveState = (addedItems) => {
    try {
        const serializedState = JSON.stringify(addedItems);
        localStorage.setItem('addedItems', serializedState);
    } catch {

    }
};

const cartReducer = (state = initState, action) => {
    switch (action.type) {
        case types.ADD_TO_CART:
            if (state.addedItems.hasOwnProperty(action.id)) {
                state.addedItems[action.id].quantity += action.quantity;
                if (action.quantity === 0) {
                    delete state.addedItems[action.id];
                }
            } else {
                state.addedItems[action.id] = {
                    "section": action.section,
                    "quantity": action.quantity,
                };
            }
        break;
        case types.CLEAR_CART:
            state.addedItems={};
        break;
        case types.REMOVE_COMPONENT:
            if (state.addedItems.hasOwnProperty(action.id)) {
                delete state.addedItems[action.id];
            }
        break;
        case types.SUB_QUANTITY:
            if (state.addedItems.hasOwnProperty(action.id)) {
                if(state.addedItems[action.id].quantity !== 0)
                    state.addedItems[action.id].quantity -= 1;
            }
        break;
        case types.ADD_QUANTITY:
            if (state.addedItems.hasOwnProperty(action.id)) {
                const section_ = state.addedItems[action.id].section;
                if(state.addedItems[action.id].quantity !== state.components[section_][action.id].stock)
                    state.addedItems[action.id].quantity += 1;
            }
        break;
        default:
        break;
    }
    return {
        ...state,
        
    };

}

export default cartReducer;
