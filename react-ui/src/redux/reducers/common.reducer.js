const defaultState = {
    modalMode: false,
    research: ''
};
export default (state = defaultState, action) => {
    switch (action.type) {
        case 'TOGGLE_MODAL':
            return {
                ...defaultState,
                modalMode: action.modalMode
            }
        case 'CHANGE_RESEARCH':
            console.log(action)
            return {
                ...defaultState,
                research: action.research
            }
        default:
            return state;
    }
};