const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

function list(req, res) {
    const {orderId} = req.params;
    res.json({data: dishes.filter(orderId ? dish => dish.order_id == orderId : () => true )});
}

function bodyDataHas(propertyName) {
    return function (req, res, next) {
        const {data = {}} = req.body;
        if (data[propertyName]) {
            return next();
        // }
        // if(!name){
        //     next({status: 400, message: `Dish must include a name`});
        // }
        // if(!description){
        //     next({status: 400, message: `Dish must include a description`});
        // }
        // if(!price){
        //     next({status: 400, message: `Dish must include a price`});
        }if(price <= 0 || !Number.isInteger(price)){
           return next({status: 400, message: `Dish must have a price that is an integer greater than 0`});
        }if(!image_url){
            next({status: 400, message: `Dish must include a image_url`});
        }
        next({status: 400, message: `Dish must include a ${propertyName}`});
    };
}


function create(req, res) {
    const {data: {name, description, price, image_url} = {} } = req.body;
    const newDish = {
        id: nextId(),
        name: name,
        description: description,
        price: price,
        image_url: image_url,
    };
    dishes.push(newDish);
    res.status(201).json({data: newDish});
}

function dishExists({req, res, next}) {
    const dishId = Number(req.params.dishId);
    const foundDish = dishes.find((dish) => dish.id === dishId);
    if (foundDish) {
        res.locals.dish = foundDish;
        return next();
    }
    next({
        status: 404,
        message: `Dish id not found ${req.params.dishId}`,
    })
}

function read(req, res) {
    res.json({data: res.locals.dish});    
}

function update(req, res) {
    const dish = res.locals.dish;
    const {data: {name, description, price, image_url} ={}} = req.body;

    dish.name = name;
    dish.description = description;
    dish.price = price;
    dish.image_url = image_url;
    
    res.json({data: dish})
}


module.exports = {
    create: [
        bodyDataHas("name"),
        bodyDataHas("description"),
        bodyDataHas("price"),
        bodyDataHas("image_url"),
        create
    ],
    list,
    read: [dishExists, read],
    update: [
        dishExists,
        bodyDataHas("name"),
        bodyDataHas("description"),
        bodyDataHas("price"),
        bodyDataHas("image_url"),
        update
     ],
     dishExists,
     nextId,
};



