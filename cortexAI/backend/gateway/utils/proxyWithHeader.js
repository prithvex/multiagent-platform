import proxy from "express-http-proxy";

export const proxywithheader = (serviceUrl) => proxy(serviceUrl, {
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {

        if (srcReq) {
            // request already have the user
            proxyReqOpts.headers["x-user-id"] = srcReq.user.userId
        }
        return proxyReqOpts;
    }
}) 