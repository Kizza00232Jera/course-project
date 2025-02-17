import React, { useContext, useEffect } from 'react'
import logo from '../assets/Images/logo_darker.png';
import { NavLink, useNavigate } from 'react-router-dom';
// import { LockClosedIcon } from '@heroicons/react/solid'
import { ArrowLeftIcon } from '@heroicons/react/outline'
import { GoogleLogin } from '@react-oauth/google';
import { client } from '../utils/client'
import jwt_decode from "jwt-decode";
import jsCookie from 'js-cookie';
import { Store } from '../utils/Store';

function Login() {
    const navigate = useNavigate();

    const { state, dispatch } = useContext(Store);
    const { userInfo } = state;

    useEffect(() => {
        if (userInfo) {
            navigate('/');
        }
    }, [navigate, userInfo]);

    const responseGoogle = async (response) => {
        // console.log(response);
        try {
            const data = jwt_decode(response.credential);
            // console.log(data);

            dispatch({ type: 'USER_LOGIN', payload: data });

            jsCookie.set('userInfo', JSON.stringify(data));
            // localStorage.setItem('user', JSON.stringify(data));
            const { sub, given_name, family_name, picture } = data;

            const doc = {
                _id: sub,
                _type: 'user',
                firstName: given_name,
                lastName: family_name,
                // slug: '', TODO: ??? autogenerate or assign some value
                avatar: picture,
            };
            client.createIfNotExists(doc).then(() => {
                navigate('/', { replace: true });
            });
        } catch (error) {
            console.log(error);
        }

    };
    return (
        <>
            <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className=''>
                        <img
                            className="mx-auto h-16 w-auto"
                            src={logo}
                            alt="Workflow"
                        />
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in or create an account</h2>
                        <div className="mt-3 flex flex-col justify-center items-center">
                            <NavLink to={-1}>
                                <div className='rounded-full my-5 border-2 border-gray-500 py-0.5 px-5 w-48 hover:bg-slate-100 text-center'><ArrowLeftIcon className='w-5 mb-1 inline-block' /> Go Back</div>
                            </NavLink>
                            <GoogleLogin
                                onSuccess={responseGoogle}
                                onError={() => { alert('Login Failed') }}
                                theme='filled_blue'
                                text='continue_with'
                                shape='pill'
                                type='standard'
                                logo_alignment='left'
                                size='medium'
                                width='200px'
                                cancel_on_tap_outside={true}
                            />

                        </div>
                        {/* <p className="mt-2 text-center text-sm text-gray-600">
                            Or{' '}
                            <a href="#" className="font-medium text-purple-500 hover:text-purple-600">
                                start your 14-day free trial
                            </a>
                        </p> */}
                    </div>
                    {/* <form className="mt-8 space-y-6" action="#" method="POST">
                        <input type="hidden" name="remember" defaultValue="true" />
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="email-address" className="sr-only">
                                    Email address
                                </label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                                    placeholder="Email address"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                                    placeholder="Password"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-purple-500 hover:text-purple-600">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                // onClick={() => loginWithRedirect()}
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                            >
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <LockClosedIcon className="h-5 w-5 text-purple-500 group-hover:text-purple-400" aria-hidden="true" />
                                </span>
                                Sign in
                            </button>
                        </div>
                    </form> */}
                </div>
            </div>
        </>
    )
}

export default Login