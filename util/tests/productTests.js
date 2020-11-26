/*
 * This file contains all tests specifically for testing the products
 */
const myConfiguration = require('../configurations');
const myPackages = require('../packages.js');
const Q = require("../queries");
const bcrypt = myPackages.bcrypt;
const assert = myPackages.assert;
const connection = myConfiguration.connection;

//objects used during testing
const testproduct = {
    productnaam: 'testproduct',
    laatstBesteld: new Date(),
    Aantal: 100,
    prijs: 1.00,
    punten: 10,
    prijsinpunten: 500
};
const testsale = {
  aantal: 3,
  datum: new Date()
}

//main test function, comment tests you want to disable
function testProducts(){
  let testInsertProduct = promiseInsertProduct();
  testInsertProduct
    .then(() => testPriceProduct())
    .then(() => testProductInformation())
    .then(() => testGetByPoints())
    .then(() => testSale())
    .then(() => testGetByPoints())
    .then(() => testGetInventory())
    .then(() => testDeleteProduct())
    .catch(function(error) {
      console.log(error);
    });
}

//checks if inserting a product generates an error
function promiseInsertProduct(){
  return new Promise( (s,f) => {
    connection.query(Q.INSERT_PRODUCT, [testproduct.productnaam, testproduct.laatstBesteld, testproduct.Aantal, testproduct.prijs, testproduct.punten, testproduct.prijsinpunten], function (err, result) {
        if(err){
          f();
        }else{
          testEquals('insert product in db', null, err);
          testproduct.productid = result.insertId;
          s();
          }
        });
  });
}
//checks the price stored in the db
function testPriceProduct(){
  connection.query(Q.GET_PRICE_PRODUCT, [testproduct.productnaam], function(err,result){
    testEquals('get price from product in database', testproduct.prijs, result[0].prijs);
  });
}
//checks all information stored in the db
function testProductInformation(){
  connection.query(Q.GET_PRODUCT, [testproduct.productid], function (err, result) {
    if(result.length>0){
      testEquals('test product info: productnaam', testproduct.productnaam, result[0].productnaam);
      testEquals('test product info: aantal', testproduct.aantal, result[0].aantal);
      testEquals('test product info: prijs', testproduct.prijs, result[0].prijs);
      testEquals('test product info: prijs', testproduct.punten, result[0].punten);
      testEquals('test product info: prijs', testproduct.prijsinpunten, result[0].prijsinpunten);
    }
  });
}
//checks if generating a sale causes an error
function testSale(){
  connection.query(Q.BUY_PRODUCT, [testsale.aantal, testproduct.productid,testsale.datum,testsale.aantal, testproduct.productid],function(err,result){
    testEquals('insert sale into database', null, err)
  });
}
//checks if you get all items you can buy with your points
function testGetByPoints(){
  connection.query(Q.GET_BY_POINTS, [testproduct.prijsinpunten + 10],function(err, result){
    if(!err){
      testEquals('get by points', true, result.length>0);
    }
  });
}

//checks if items are stored in inventory db
function testGetInventory(){
  connection.query(Q.GET_INVENTARIS, [],function(err,result){
    if(result != null){
      testEquals("check if there are products in the inventory", true, result.length>0);
    }
  })
}
//test if you can delete a product
function testDeleteProduct(){
  connection.query(Q.DELETE_PRODUCT, [testproduct.productid], function (err, result) {
      testEquals('remove product from db', null, err);
  })
}
//general function used to compare the expected data with the actual data
function testEquals(name, expected, actual) {
    try {
        assert.equal(expected, actual);
        console.log(`V\t ${name}`);
    } catch (err) {
        console.log(`X\t ${name}: expected: ${expected} but was ${actual}`);
    }
}
module.exports = {
    testProducts
};
