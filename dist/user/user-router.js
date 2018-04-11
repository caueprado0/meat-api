"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("../common/router");
const user_model_1 = require("./user-model");
class UserRouter extends router_1.Router {
    applyRoutes(application) {
        application.get('/users', (req, resp, next) => {
            user_model_1.User.findAll().then(users => {
                resp.json(users);
                return next();
            });
        });
    }
}
exports.userRouter = new UserRouter();