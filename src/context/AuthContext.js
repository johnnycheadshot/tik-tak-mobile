import {AsyncStorage} from 'react-native'
import createDataContext from './createDataContext';
import takApi from '../api/yakApi';
import { navigate } from '../navigationRef'

const authReducer = (state, action) => {
	switch (action.type) {
		case 'authenticate_user':
			return { ...state, token: action.payload  };

		case 'signout':
			return { token: null, errorMessage: ''};

		case 'add_error':
			return { ...state, errorMessage: action.payload };

		case 'clear_error':
			return { ...state, errorMessage: '' };
	
		default:
			return state;
	}
}

// Dispatch state change and 
const signup = (dispatch) => async ({email, password}) => {
	try {
		console.log('Sign up functino');
		
		// Gets token from api
		const response = await takApi.post('api/users', { email, password });

		// Saves to state
		await AsyncStorage.setItem('token', response.data.token)
		dispatch({type: 'authenticate_user', payload: response.data.token});
		
		navigate("mainFlow");
	} catch (error) {
		dispatch({type: 'add_error', payload: 'A user already exists with that email. Try something else!'})
	}
}

// TODO: Verify that username and password are entered on AuthForm
const signin = (dispatch) => async ({ email, password }) => {
	try {
		// Gets token from api
		const response = await takApi.post('api/login', { email, password });

		// Saves to state
		await AsyncStorage.setItem('token', response.data.token)
		dispatch({type: 'authenticate_user', payload: response.data.token});
		
		navigate("mainFlow");
	} catch (error) {
		dispatch({type: 'add_error', payload: "There is no user with that email."})
	}
}

const signout = (dispatch) => async () => {
	try {
		dispatch({type: 'signout'});
		
		navigate('Signin');
	} catch (error) {
		dispatch({type: 'add_error', payload: "We couldn't sign you out, try using our app for longer. ;)"})
	}
}

const clearError = (dispatch) => () => {
	dispatch({type: 'clear_error'})
}

export const { Context, Provider } = createDataContext(
	authReducer, 
	{signup, signin, signout, clearError},
	{token: null, errorMessage: ''}
)