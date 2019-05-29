//region imports
import React from "react";
import {inject, observer} from "mobx-react";
import "../css/LoginRegister.css";
import {debug} from "../DEBUG";
import * as config from "../../../config.json";
//endregion

@inject('rootStore')
@observer
class Register extends React.Component<any, any> {
    private form;

    constructor(props) {
        super(props);
        this.register = this.register.bind(this);
        this.setField = this.setField.bind(this);
        this.state = {
            email: "",
            password: "",
            passwordVerification: "",
            attempted: false
        }
    }

    setField(event) {
        const fieldName = event.target.getAttribute('name');
        if (fieldName === "email") {
            let email = event.target.value;
            this.setState({email});
        } else if (fieldName === "password") {
            let password = event.target.value;
            this.setState({password});
        } else if (fieldName === "passwordVerification") {
            let passwordVerification = event.target.value;
            this.setState({passwordVerification});
        }
    }

    async register(e) {
        e.preventDefault();
        if (this.state.password !== this.state.passwordVerification || !this.form.checkValidity()) {
            this.setState({attempted: true});
            return;
        }
        const response = await fetch(`http://localhost:${config.server.port}/register`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            })})
            .then(res => res.json())
            .catch(err => console.log(err));
        debug.log(response);
        if (response.authenticated) {
            this.props.rootStore.appStore.authenticate();
        } else {
            this.setState({attempted: true});
        }
    }

    render() {
        return (
            <div className="container">
                <h1>Sign Up</h1>
                <div className="reg-form-container">
                    <form className={`needs-validation ${this.state.attempted ? "was-validated" : ""}`}
                          noValidate
                          onSubmit={this.register}
                          ref={form => this.form = form}>
                        <div className="form-section">
                            <label htmlFor="email" className="sr-only">Email</label>
                            <input className="form-control" type="email" placeholder="Email"
                                   name="email"
                                   value={this.state.email}
                                   onChange={this.setField}
                                   required
                                   id="email" pattern="^.+@.+\..+$"/>
                            <div className="valid-feedback"/>
                            <div className="invalid-feedback">Please enter a valid email address.</div>
                        </div>
                        <div className="form-section">
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input className="form-control" placeholder="Password" type="password" name="password"
                                   id="password"
                                   value={this.state.password}
                                   onChange={this.setField}
                                   required
                                   pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"/>
                            <div className="valid-feedback"/>
                            <div className="invalid-feedback">Passwords must be at least 8 characters long and contain
                                at least one
                                lowercase letter, one uppercase letter, and one number.
                            </div>
                        </div>
                        <div className="form-section">
                            <label htmlFor="password" className="sr-only">Verify Password</label>
                            <input className="form-control" placeholder="Password (again)" type="password" name="passwordVerification"
                                   id="passwordVerification"
                                   value={this.state.passwordVerification}
                                   onChange={this.setField}
                                   required
                                   pattern={`^${this.state.password}$`}
                            />
                            <div className="valid-feedback"/>
                            <div className="invalid-feedback">The passwords do not match.</div>
                        </div>
                        <div className="button-container">
                            <button type="submit" className="submit-button btn btn-lg">
                                Register
                            </button>
                            <svg className="vine-grow" width="380" height="100">
                                <g>
                                    <path fillRule="evenodd" fill="#ffffff" className="path"
                                          d="m189.717891,10.448839c3.113,3.767 3.136,3.922 0.971,6.496c-1.941,2.306 -1.557,3.154 2.33,5.137c1.319,0.673 2.786,1.69 3.26,2.261c1.657,1.997 6.412,0.076 7.439,-3.005c0.457,-1.373 2.502,-0.067 2.502,1.598c0,2.162 -2.319,4.098 -6.646,5.549c-15.387,5.157 -27.302,18.212 -28.648,31.385l-0.454,4.455l-4.289,-5.115c-2.359,-2.813 -4.999,-5.713 -5.868,-6.444c-2.181,-1.835 -3.259,-5.093 -2.286,-6.911c0.734,-1.371 0.782,-1.356 2.194,0.728c2.065,3.048 2.855,3.039 5.726,-0.071c1.819,-1.971 3.374,-2.952 5.397,-3.406c5.739,-1.29 6.446,-3.39 2.287,-6.798c-2.825,-2.315 -2.891,-2.461 -3.247,-7.14c-0.841,-11.054 -2.776,-12.356 -7.957,-5.348c-2.702,3.655 -3.417,4.252 -4.62,3.858c-6.29,-2.058 -8.594,-0.276 -7.001,5.416c0.583,2.078 0.592,3.318 0.039,4.904c-0.834,2.393 0.412,4.546 2.631,4.546c1.696,0 1.926,0.73 1.17,3.71l-0.671,2.642l-3.161,-0.648c-7.921,-1.623 -15.56,3.143 -23.918,14.923c-3.252,4.583 -4.985,6.465 -6.021,6.538c-5.77,0.407 -11.702,-2.047 -7.149,-2.957c2.664,-0.533 2.937,-1.954 1.053,-5.497c-0.897,-1.687 -1.63,-3.903 -1.63,-4.925c0,-2.444 -1.746,-3.39 -4.697,-2.543c-3.114,0.893 -3.858,0.805 -4.4,-0.517c-0.974,-2.374 -5.641,-8.746 -6.406,-8.746c-2.876,0 -4.632,5.994 -3.617,12.348c0.685,4.288 0.659,4.436 -1.223,7.072c-3.738,5.235 -3.422,6.952 1.285,6.972c1.357,0.006 2.766,0.458 3.252,1.044c2.773,3.341 6.266,3.398 9.231,0.151l1.788,-1.956l2.713,1.384c1.492,0.761 3.832,1.632 5.199,1.935l2.485,0.55l-3.363,3.306c-6.612,6.498 -16.617,9.115 -24.751,6.474c-8.483,-2.755 -15.78,-7.653 -15.78,-10.594c0,-1.645 0.903,-2.172 1.65,-0.963c0.786,1.27 2.233,0.636 4.898,-2.146c3.448,-3.599 3.838,-4.844 2.095,-6.699c-0.935,-0.995 -1.382,-2.34 -1.382,-4.153c0,-3.821 -1.651,-5.092 -3.434,-2.644c-1.86,2.553 -3.514,3.314 -5.218,2.402c-1.771,-0.947 -2.554,-0.202 -3.279,3.12c-0.303,1.391 -0.746,3.337 -0.984,4.325c-0.356,1.476 -0.151,1.924 1.153,2.518c3.591,1.636 1.741,5.046 -2.988,5.507c-2.234,0.218 -5.334,0.58 -6.889,0.805c-3.634,0.524 -6.407,-0.629 -7.426,-3.088c-1.082,-2.612 0.544,-5.258 3.172,-5.162c1.767,0.064 1.771,0.074 0.213,0.51c-2.465,0.69 -3.289,2.473 -1.698,3.676c3.781,2.858 8.032,-2.743 5.175,-6.821c-1.462,-2.087 -6.681,-1.715 -9.259,0.659c-1.568,1.445 -1.641,1.459 -0.852,0.163c1.469,-2.412 -3.614,-7.776 -5.542,-5.848c-0.617,0.618 -2.231,0.994 -4.261,0.994c-4.867,0 -5.804,1.49 -2.645,4.207c2.038,1.753 2.284,2.244 1.633,3.258c-1.549,2.414 6.073,5.037 7.795,2.682c0.718,-0.982 1.041,-0.697 2.728,2.406c1.348,2.482 2.671,3.91 4.485,4.84l2.572,1.319l-2.048,1.83c-3.982,3.558 -6.546,3.751 -12.27,0.922c-4.625,-2.285 -5.352,-2.452 -9.631,-2.21c-4.126,0.233 -4.628,0.132 -4.628,-0.936c0,-1.637 -1.621,-2.125 -3.912,-1.176c-1.45,0.601 -2.25,0.608 -3.331,0.03c-1.859,-0.995 -3.042,-0.035 -3.596,2.918c-0.49,2.611 -1.274,3.358 -4.177,3.979c-4.993,1.067 -2.068,4.735 4.785,6.001c1.452,0.268 3.292,1.183 4.088,2.033c1.934,2.067 2.458,1.847 9.956,-4.173c1.574,-1.264 1.695,-1.612 0.973,-2.797c-1.684,-2.76 0.565,-2.776 7.426,-0.05c8.216,3.264 11.484,2.79 18.541,-2.687c4.809,-3.732 7.512,-4.806 10.501,-4.171c2.321,0.492 7.984,3.251 8.548,4.164c2.613,4.228 20.932,8.267 28.881,6.367c5.056,-1.208 5.668,-1.65 18.677,-13.477c1.089,-0.99 3.446,-4.016 5.237,-6.724c6.347,-9.594 8.039,-10.742 8.474,-5.749c0.166,1.906 0.518,4.104 0.781,4.885c0.412,1.221 0.172,1.481 -1.726,1.864c-4.049,0.817 -4.515,1.079 -4.511,2.536c0.003,0.792 0.577,2.31 1.277,3.372c1.164,1.764 1.188,2.095 0.289,3.835c-0.542,1.047 -0.894,3 -0.783,4.339l0.203,2.436l5.28,0.022c4.357,0.018 5.859,0.32 8.581,1.725c5.091,2.627 7.844,3.346 10.342,2.702c2.601,-0.67 3.294,-2.846 1.344,-4.22c-0.693,-0.489 -1.855,-2.052 -2.583,-3.472l-1.321,-2.584l1.924,-2.851c3.015,-4.468 2.83,-6.244 -0.746,-7.135c-2.374,-0.592 -3.04,-1.096 -3.552,-2.689c-1.501,-4.673 -3.249,-5.208 -6.398,-1.96c-2.719,2.806 -2.998,2.829 -4.273,0.363c-2.977,-5.756 1.487,-12.672 7.489,-11.605c2.925,0.52 8.688,4.335 10.835,7.172c4.79,6.332 8.164,11.768 10.712,17.257c5.647,12.167 15.586,18.042 29.407,17.381c13.397,-0.64 23.636,-10.937 23.702,-23.835c0.072,-14.06 -19.653,-20.017 -26.987,-8.15c-4.385,7.096 1.266,17.114 6.775,12.009c2.002,-1.855 2.206,-3.38 0.678,-5.068c-2.392,-2.643 0.752,-7.174 4.978,-7.174c7.587,0 10.191,9.629 4.895,18.096c-8.748,13.985 -33.438,8.551 -38.814,-8.542c-2.838,-9.021 -0.16,-20.006 5.694,-23.363c4.041,-2.317 8.29,-2.817 7.461,-0.878c-1.545,3.612 -1.205,4.375 2.794,6.272c4.796,2.274 4.804,2.274 8.01,-0.405c1.921,-1.604 3.584,-2.342 6.003,-2.663c4.849,-0.643 4.94,-3.764 0.212,-7.311c-1.724,-1.294 -3.896,-3.609 -4.825,-5.146c-2.06,-3.405 -4.027,-3.922 -5.628,-1.479c-0.688,1.051 -1.671,1.683 -2.516,1.618c-3.618,-0.281 -3.871,-0.102 -3.4,2.406c0.401,2.137 0.319,2.328 -0.841,1.96c-0.707,-0.225 -2.5,-0.135 -3.985,0.199c-3.579,0.804 -2.905,-0.598 2.343,-4.873c8.778,-7.15 16.019,-9.115 30.322,-8.229l7.792,0.482l3.583,3.85c3.887,4.176 6.536,9.359 7.322,14.323c0.552,3.488 0.254,3.584 -4.154,1.34c-2.513,-1.279 -3.337,-0.831 -4.283,2.325c-0.438,1.464 -1.831,3.899 -3.095,5.412c-1.264,1.513 -2.298,3.434 -2.298,4.27c0,1.591 3.964,5.616 5.531,5.616c2.469,0 4.37,6.334 4.37,14.561c0,3.44 0.235,4.53 1.044,4.841c3.618,1.388 8.048,-2.173 11.544,-9.279c3.327,-6.762 3.738,-7.105 7.913,-6.611c5.152,0.61 6.261,-5.002 1.821,-9.223c-2.581,-2.453 -3.608,-4.498 -4.183,-8.332c-0.595,-3.969 -0.798,-4.07 -5.695,-2.815c-2.233,0.572 -4.123,0.96 -4.2,0.863c-0.3,-0.381 -1.329,-12.388 -1.061,-12.388c2.009,0 10.824,8.948 17.882,18.152c17.764,23.166 27.991,30.681 41.782,30.703c10.902,0.017 13.7,-1.331 23.583,-11.362c11.786,-11.963 17.681,-13.685 20.854,-6.09c1.818,4.351 -2.365,9.096 -5.098,5.783c-0.819,-0.992 -0.767,-1.024 0.534,-0.331c2.424,1.291 4.01,-0.714 2.751,-3.477c-2.115,-4.641 -9.505,-0.585 -8.226,4.514c1.978,7.879 14.266,5.999 14.266,-2.182c0,-3.04 2.337,-4.131 2.76,-1.289c0.116,0.78 0.656,1.637 1.201,1.904c4.537,2.227 4.45,2.22 6.442,0.544c1.043,-0.878 3.585,-2.479 5.647,-3.556c4.898,-2.56 4.752,-5.321 -0.351,-6.594c-0.986,-0.246 -2.865,-1.46 -4.176,-2.696c-1.431,-1.349 -2.697,-2.049 -3.167,-1.749c-5.438,3.467 -5.775,3.809 -5.53,5.614c0.331,2.441 -1.413,2.422 -4.288,-0.047c-3.62,-3.109 -5.347,-4.078 -7.265,-4.078c-2.424,0 -2.461,-1.82 -0.042,-2.102c1.433,-0.167 1.905,-0.671 2.356,-2.519c1.361,-5.577 1.349,-5.768 -0.451,-6.948c-1.492,-0.977 -1.716,-1.583 -1.716,-4.632c0,-6.737 -2.039,-6.975 -5.575,-0.652c-2.055,3.675 -2.696,4.317 -4.681,4.69c-2.915,0.547 -3.278,1.174 -2.401,4.147c0.391,1.323 0.879,3.222 1.085,4.22c0.334,1.614 0.668,1.816 3.003,1.816c3.766,0 3.392,1.45 -1.115,4.334c-5.371,3.436 -5.498,3.452 -5.498,0.711c0,-7.981 -6.656,-15.594 -13.653,-15.617c-3.128,-0.01 -5.924,-1.092 -4.427,-1.714c2.26,-0.938 3.054,-2.032 2.383,-3.285c-0.375,-0.701 -0.526,-2.091 -0.336,-3.087c0.439,-2.293 -0.777,-3.785 -3.085,-3.785c-1.477,0 -2.116,-0.591 -3.616,-3.346c-3.328,-6.116 -5.041,-4.985 -7.233,4.781c-0.217,0.97 -1.161,2.673 -2.096,3.785c-2.028,2.41 -1.878,4.042 0.477,5.171c0.952,0.456 2.217,1.572 2.812,2.48c1.163,1.775 4.135,2.263 5.495,0.903c1.976,-1.975 2.904,0.031 1.181,2.554c-0.932,1.366 -2.312,4.547 -3.067,7.069c-1.08,3.612 -1.503,4.347 -1.997,3.465c-0.781,-1.396 -1.886,-1.41 -4.712,-0.062l-2.216,1.056l0.048,4.719l0.049,4.719l1.98,-0.134c6.266,-0.426 6.75,-0.572 8.859,-2.681c1.943,-1.945 2.087,-2.348 1.47,-4.118l-0.684,-1.963l1.843,1.363c2.15,1.59 5.92,0.584 7.271,-1.939c2.365,-4.42 -2.321,-8.956 -5.558,-5.379c-1.153,1.274 -1.153,1.366 0,2.64c0.657,0.726 0.862,1.32 0.456,1.32c-2.699,0 -2.61,-4.908 0.138,-7.657c4.314,-4.313 8.529,-2.703 12.197,4.66c2.917,5.855 0.585,14.818 -4.699,18.065c-14.503,8.909 -30.844,2.038 -46.614,-19.599c-1.684,-2.31 -4.334,-5.792 -5.889,-7.738l-2.827,-3.537l2.473,-1.033c1.36,-0.568 3.003,-1.513 3.652,-2.1c1.087,-0.984 1.274,-0.982 2.386,0.025c2.075,1.878 4.298,1.359 6.635,-1.548c1.167,-1.452 2.52,-2.64 3.007,-2.64c0.487,0 1.587,-0.597 2.444,-1.327l1.559,-1.326l-2.072,-1.809c-1.93,-1.685 -2.088,-2.158 -2.322,-6.913c-0.378,-7.673 -1.474,-8.397 -5.736,-3.786l-3.267,3.535l-2.766,-0.913c-3.701,-1.221 -5.034,-0.391 -4.757,2.964c0.13,1.583 -0.181,2.881 -0.875,3.647c-0.614,0.68 -0.985,1.988 -0.862,3.049c0.195,1.69 0.9,2.334 4.175,3.817c1.214,0.55 -1.875,2.362 -4.026,2.362c-1.701,0 -3.873,-1.386 -10.93,-6.974c-11.169,-8.845 -20.182,-13.488 -26.183,-13.488c-2.135,0 -5.638,-0.184 -7.784,-0.408l-3.903,-0.408l0.229,-2.397c0.18,-1.893 -0.126,-2.73 -1.453,-3.977l-1.682,-1.58l2.123,-1.06c2.978,-1.488 3.147,-3.857 0.462,-6.482c-1.132,-1.107 -2.558,-2.995 -3.169,-4.197c-1.392,-2.739 -2.314,-3.039 -4.039,-1.314c-1.613,1.613 -2.318,1.664 -5.844,0.42c-3.478,-1.227 -8.265,-1.933 -8.888,-1.31"
                                          id="path0"/>
                                </g>
                            </svg>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Register;