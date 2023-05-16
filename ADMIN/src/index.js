

import React, { Suspense } from "react"
import ReactDOM from "react-dom"
import { BrowserRouter } from "react-router-dom"
import App from "App"

import { MaterialUIControllerProvider } from "context"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { slice } from "stylis"
import Loader from "common/Loader/loader"

ReactDOM.render(
    <BrowserRouter>
    <Suspense fallback={<Loader />}>
        <MaterialUIControllerProvider>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                Transition={slice}
                style={{ fontSize: "16px" }}
                pauseOnHover
            />
            <App />
        </MaterialUIControllerProvider>
        </Suspense>
    </BrowserRouter>,
    document.getElementById("root")
)
