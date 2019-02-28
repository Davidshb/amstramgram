import {Header} from "../../types";

export function changeResearch (newResearch, next = () => {}) {
	return (dispatch) => {
		dispatch({type: Header.CHANGE_RESEARCH, research: newResearch})
		next()
	}
	}

	export function toggleSearching (bo = true, next = () => {}) {
		return (dispatch) => {
			dispatch({type: Header.SEARCHING, searching: bo ? "searching" : ""})
			next()
		}
	}