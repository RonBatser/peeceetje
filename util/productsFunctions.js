/*
 * This file contains all functions used for interacting with products in the application.
 */

const myConfiguration = require("./configurations");
const connection = myConfiguration.connection;
const Q = require("./queries");
const usersFunctions = require("./usersFunctions");

//returns all items the client can get for free with the points he/she collected
function getFreeItem(req, res) {
    connection.query(Q.GET_USER_INFO, [req.session.userLoggedIn.userId], function (err, result) {
        const points = result[0].punten;
        connection.query(Q.GET_BY_POINTS, [points], function (err, result) {
            res.send(result);
        });
    });
}

//delete the product from the database
function deleteProduct(req, res) {
    const id = parseInt(req.body.id);

    connection.query(Q.DELETE_PRODUCT, [id], function (err, result) {
        console.log(err);
        res.redirect("/inventaris");
    });
}

//apply all changes in the database for the sold products
function executeOrder(req, res) {

    usersFunctions.getUserPoints(req.body.username, function (result) {
        req.body.userCredits = result;


        if (req.body.creditLines.length > 0) {

            getTotalCreditCost(req, res);


        } else {
            buyProducts(req, res);
        }
    });

}

//make and preform which updates inventory, sales and the points of the user
function makeBuyQuery(req, res, cart, next) {
    let query = "";
    let args = [];
    let points = 0;
    console.log(cart);
    new Promise(function (resolve) {
        for (let i = 0; i < cart.length; i++) {
            const productId = cart[i].id;
            const aantal = cart[i].count;
            let day = new Date();
            day.setHours(0, 0, 0, 0);

            connection.query(Q.CHECK_SALES, [productId, day], function (err, result) {
                connection.query(Q.GET_PRODUCT, [productId], function (err, result) {
                    console.log(result[0].punten);
                    points += result[0].punten * cart[i].count;
                });
                if (result != null && result.length === 0) {
                    query = query.concat(Q.BUY_PRODUCT_NEW);
                    args = args.concat([productId, aantal, day, aantal, productId]);

                } else if (result != null) {
                    query = query.concat(Q.BUY_PRODUCT);
                    args = args.concat([aantal, productId, day, aantal, productId]);

                }

                if (args.length === cart.length * 5) {
                    resolve({args: args, query: query})
                }
            })

        }

    }).then(function (result) {
        connection.query(result.query, result.args, function (err, result) {
            req.body.success = (err === null);
            if (next === null || !(req.body.orderLines > 0)) {
                console.log("succes:");
                console.log(req.body.success);
                if (next === null) {
                    usersFunctions.addPoints(req.body.username, points);
                    req.body.userCredits += points;
                }
                res.send(req.body);
            } else {
                next(req, res);
            }
        })
    });


}

//perform buy free products via makeBuyQuery
function buyFreeProducts(req, res) {
    let cart = req.body.creditLines;

    makeBuyQuery(req, res, cart, buyProducts);
}

//perform buy products via makeBuyQuery
function buyProducts(req, res) {
    let cart = req.body.orderLines;
    makeBuyQuery(req, res, cart, null);

}

function checkIfMultipleProducts(result) {
    if (result.length > 1) {
        let newResult = [];
        result.forEach(function (r) {
            newResult = newResult.concat(r)
        });
        return newResult;
    } else {
        return result;
    }
}

function calculatePointCost(result, amounts) {
    let cost = 0;
    for (let i = 0; i < result.length; i++) {
        console.log(result[i]);
        let amount = amounts.find(function (x) {
            //console.log(x);
            return parseInt(result[i].idProduct) === x.id;
        }).amount;
        cost += (amount * parseInt(result[i].prijsinpunten));
    }
    return cost;
}

//check how much the creditsorder costs and if the user has enough credits
function getTotalCreditCost(req, res) {
    const creditsOrder = req.body.creditLines;
    let query = "";
    let ids = [];
    let amounts = [];
    let cost = 0;

    new Promise(function (resolve) {
        for (let i = 0; i < creditsOrder.length; i++) {
            query = query.concat(Q.GET_PRODUCT_PRICE_IN_POINTS);
            ids.push(creditsOrder[i].id);
            amounts.push({"id": creditsOrder[i].id, "amount": creditsOrder[i].count})
        }
        if (amounts.length === creditsOrder.length) {
            resolve()
        }

    }).then(function () {
        connection.query(query, ids, function (err, result) {
            result = checkIfMultipleProducts(result);
            cost = calculatePointCost(result,amounts);
            if (req.body.userCredits < cost) {
                let toSendBack = req.body;
                toSendBack.success = false;
                res.send(toSendBack);
            }
            else {
                // decrease points && execute order
                console.log(cost);
                usersFunctions.addPoints(req.body.username, -cost);
                req.body.userCredits -= cost;
                buyFreeProducts(req, res);
            }
        });
    });

}

//apply the changes on the products in the inventory tab, so add new products,
//delete old products...
function updateInventaris(req, res) {

    const array = req.body;
    let productsToSendBack = [];
    let i = 0;
    new Promise(function (resolve) {
        array.forEach(function (product) {

            product.lastOrderDate = new Date();
            if (/*typeof idProduct === "number"*/ product.id > 0) {
                if (product.count < 0) {
                    product.count = 0;
                }
                connection.query(Q.UPDATE_INVENTARIS, [product.lastOrderDate, product.count, product.price, product.credits, product.costInCredits, product.id], function (err, result) {
                    if (err !== null || result.changedRows < 1) {
                        productsToSendBack.push(product);
                    }
                    i++;
                    if (i === array.length) {
                        resolve(productsToSendBack);
                    }

                })
            }
            else {
                connection.query(Q.INSERT_PRODUCT, [product.name, product.lastOrderDate, product.count, product.price, product.credits, product.costInCredits], function (err, result) {
                    console.log(err);
                    if (err === null) {
                        product.newId = result.insertId;
                    }
                    productsToSendBack.push(product);
                    i++;
                    if (i === array.length) {
                        resolve(productsToSendBack);
                    }


                })
            }
        });
    }).then(function (result) {
        res.send(result)
    });

}

module.exports = {
    getFreeItem,
    deleteProduct,
    executeOrder,
    updateInventaris
};
