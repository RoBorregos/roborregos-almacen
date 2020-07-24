import activeComponents from '../data/active_components.json';

export const types = {
    CLEAR_CART: 'CLEAR_CART',
    SUB_QUANTITY: 'SUB_QUANTITY',
    ADD_QUANTITY: 'ADD_QUANTITY'
};

export const clearCart = () => {
    return {
        type: types.CLEAR_CART,
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
    components: activeComponents.components,
    returningItems: {},
}

export const loadState = () => {
    try {
        const serializedState = localStorage.getItem('returningItems');
        if (serializedState === null)
            return defaultState;

        return {
            components: defaultState.components,
            returningItems: JSON.parse(serializedState)
        }
    } catch (err) {
        return defaultState;
    }
};

const initState = loadState();

export const saveState = (returningItems) => {
    try {
        const serializedState = JSON.stringify(returningItems);
        localStorage.setItem('returningItems', serializedState);
    } catch {

    }
};

const componentsReducer = (state = initState, action) => {
    switch (action.type) {
        case types.CLEAR_CART:
            state.returningItems={};
        break;
        case types.SUB_QUANTITY:
            if (state.returningItems.hasOwnProperty(action.id)) {
                if(state.returningItems[action.id].quantity !== 1)
                    state.returningItems[action.id].quantity -= 1;
            }
        break;
        case types.ADD_QUANTITY:
            if (state.returningItems.hasOwnProperty(action.id)) {
                const section_ = state.returningItems[action.id].section;
                if(state.returningItems[action.id].quantity !== state.components[section_][action.id].stock)
                    state.returningItems[action.id].quantity += 1;
            }
        break;
        default:
        break;
    }
    return {
        ...state,
        
    };

}

export default componentsReducer;