/*
 * This file contains all tests regarding the user testing
 */
const myConfiguration = require('../configurations');
const myPackages = require('../packages.js');
const Q = require("../queries");
const bcrypt = myPackages.bcrypt;
const assert = myPackages.assert;
const connection = myConfiguration.connection;

//objects used during testing
const user = {
    username: 'Jan',
    firstname: 'Jan',
    lastname: 'Janssens',
    password: '12345',
    birthdate: '1999-08-07'
};

//main test function, comment tests you want to disable
function testUsers(){
  let testInsertUser = promiseInsertUser();
  testInsertUser
    .then(() => testPasswordEncryption())
    .then(() => testGetUserInfo())
    .then(() => testChangeUserPassword())
    .then(() => testAllUsers())
    .then(() => testCheckUsernames())
    .then(() => testRemoveUser())
    .catch(function(error) {
      console.log(error);
    });
}
//checks if creating a user generates errors
function promiseInsertUser(){
  return new Promise( (s,f) => {
    connection.query(Q.INSERT_USER, [user.username, user.firstname, user.lastname, user.birthdate, bcrypt.hashSync(user.password), 0], function (err, result) {
        if(err){
          f();
        }else{
          testEquals('insert user into db', null, err);
          user.userid = result.insertId;
          s();
          }
        });
  });
}
//checks if encrypted data can be compared with the original data
function testPasswordEncryption(req, res) {
    testEquals('test username encryption', true, bcrypt.compareSync('HelloWorld', bcrypt.hashSync('HelloWorld')));
}
//checks if all information stored in the db is correct
function testGetUserInfo(){
  connection.query(Q.GET_USER_INFO, [user.userid], function (err, result) {
      testEquals('test user info: voornaam', user.firstname, result[0].voornaam);
      testEquals('test user info: familienaam', user.lastname, result[0].familienaam);
      testEquals('test user info: username', user.username, result[0].username);
      testEquals('test user info: punten', 0, result[0].punten);
  });
}
//checks if you can change the password
function testChangeUserPassword(){
  user.password = "123456789";
  connection.query(Q.UPDATE_USER_PASSWORD, [bcrypt.hashSync(user.password), user.username], function (err, result) {
      testEquals('no error when updating pw', null, err);
      connection.query(Q.LOG_IN_USER, [user.username], function (err, result) {
          testEquals('update correct user password', true, bcrypt.compareSync(user.password, result[0].wachtwoord));
      });
  });
}
//checks if user is saved
function testAllUsers(){
  connection.query(Q.GET_ALL_USERS_AND_ALL_ROLES, [], function (err, result) {
      testEquals('get all users', true, result.length>0);
  });
}
//checks if you can remove a user
function testRemoveUser(){
  connection.query(Q.REMOVE_USER, [user.userid], function (err, result) {
      testEquals('remove user from db', null, err);
  });
}
//checks if your username is safed so others cant have the same username
function testCheckUsernames(){
  connection.query(Q.SELECT_USER, [user.username], function (err, result) {
      testEquals('check if username in db', true, result.length>0);
  });
}
//check if id is binded to your username
function testGetUsernameById(){
  connection.query(Q.GET_USERNAME, [user.username], function (err, result) {
      testEquals('check if username by id is correct', user.username, result[0].username);
  });
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
    testUsers
};
