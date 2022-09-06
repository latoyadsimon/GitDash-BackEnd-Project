const router = require("express").Router();

// TODO: Implement the /orders routes needed to make the tests pass
const controller = require("./orders.controller");

const methodNotAllowed = require("../errors/methodNotAllowed");

const dishesRouter = require("../dishes/dishes.router")


router.use("/:orderId/dishes", controller.orderExists, dishesRouter);

router
.route("/:orderId")
.get(controller.read)
.put(controller.update)
.delete(controller.delete)
.all(methodNotAllowed);

router
.route("/")
.get(controller.list)
.post(controller.create)
.all(methodNotAllowed);

module.exports = router;
