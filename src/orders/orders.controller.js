const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));


// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass


function list(req, res) {
    const {dishId} = req.params;
    if(dishId) {
        res.json({data: orders.filter((order)=> order.dishId == dishId) })
    }else{
        res.json({data: orders});
    }
}


function bodyDataHas(propertyName) {
    return function (req, res, next) {
        const {data = {}} = req.body;
        if(data[propertyName]) {
            return next();
        }
        next({status: 400, message: `Order must include a ${propertyName}`});
    }
}

function create(req, res) {
    const {data: { deliverTo, mobileNumber, status, dishes=[]} = {} } = req.body;

    if(dishes.length === 0) {
      return res.status(400);
    }



    const newOrder = {
        id: nextId,
        deliverTo: deliverTo,
        mobileNumber: mobileNumber,
        status: status,
        dishes: dishes,
    }
    orders.push(newOrder);
    res.status(201).json({data: newOrder})
}


function orderExists(req, res, next) {
    const {orderId} = req.params;
    const foundOrder = orders.find(order => order.id === Number(orderId));
    if (foundOrder){
        res.locals.order = foundOrder;
        return next();
    }
    next({
        status: 404, message: `Order id not found: ${orderId}`, 
    })
};

function read(req, res) {
    res.json({data: res.locals.order});
};


function update(req, res) {
    const order = res.locals.order;
    const {data: {deliverTo, mobileNumber, status, dishes} = {}} = req.body;

    order.deliverTo = deliverTo;
    order.mobileNumber = mobileNumber;
    order.status = status;
    order.dishes = dishes;
    
    res.json({data: order})
}


function destroy (req, res) {
    const {orderId} = req.params;
    const index = orders.findIndex((order) => order.id === Number(orderId));
    if(index.status !== "pending") {
        return next({
            status: 400,
            message: `An order cannot be deleted unless it is pending`
        })
    }
    res.sendStatus(204);
    if(index > -1) {
        orders.splice(index, 1);
    }
}


module.exports = {
    list,
    create: [
        bodyDataHas("deliverTo"),
        bodyDataHas("mobileNumber"),
        bodyDataHas("status"),
        bodyDataHas("dishes"),
        create
    ],
    read: [orderExists, read],
    update: [
        orderExists,
        bodyDataHas("deliverTo"),
        bodyDataHas("mobileNumber"),
        bodyDataHas("status"),
        bodyDataHas("dishes"),
        update,

    ],
    orderExists,
    nextId,
    delete: [orderExists, destroy],
};
