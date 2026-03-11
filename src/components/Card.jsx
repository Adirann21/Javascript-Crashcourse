import React from 'react'
import Register from '../pages/Register'

const Card = ({ children }) => {
    return (
        <div className="flex justify-center mt-20">
            <div className="card bg-base-100 w-96 shadow-sm">
                <div className="card-body">
                    <h2 className="card-title">Register Now!</h2>

                    <form className="form-control space-y-4">
                        <input
                            type="text"
                            placeholder="First name"
                            className="input input-bordered w-full"
                        />
                        <input
                            type="text"
                            placeholder="Last name"
                            className="input input-bordered w-full"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            className="input input-bordered w-full"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="input input-bordered w-full"
                        />
                        <button className="btn btn-primary w-full" type="submit">
                            Submit
                        </button>
                    </form>

                    {children}
                </div>
            </div>
        </div>
    )
}

export default Card