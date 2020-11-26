module.exports = {
    //user statements
    INSERT_USER: "INSERT INTO users(username, voornaam, familienaam, geboortedatum, wachtwoord, punten) VALUES (?,?,?,?,?,?)",
    GET_ALL_USERS_AND_ALL_ROLES: "SELECT * FROM rollen; SELECT u.*, r.* FROM users u left join userrollen ur on u.idusers = ur.iduser left join rollen r on ur.idrollen = r.idrollen;",
    SELECT_USER: "SELECT username FROM users WHERE username = ?",
    LOG_IN_USER: "SELECT wachtwoord, idusers FROM users WHERE username = ?",
    GET_USERNAME: "SELECT username FROM users WHERE idusers = ?",
    GET_ROLE_USER: "SELECT rolnaam FROM rollen r JOIN userrollen ur ON r.idrollen = ur.idrollen JOIN users u ON ur.iduser=u.idusers WHERE u.idusers = ?",
    GET_USER_INFO: "SELECT u.*, r.* FROM users u left JOIN userrollen ur ON u.idusers = ur.iduser left JOIN rollen r ON r.idrollen = ur.idrollen where u.idusers= ?",
    REMOVE_USER: "DELETE FROM users WHERE idusers = ?",
    UPDATE_USER_POINTS: "UPDATE users SET punten = ? WHERE idusers = ?",
    UPDATE_USER_PASSWORD: "UPDATE users SET wachtwoord = ? WHERE username = ?",
    UPDATE_USER_PASSWORD_ID: "UPDATE users SET wachtwoord = ? WHERE idusers = ?",
    UPDATE_VISIT_USER: "UPDATE users SET lastactive = ?, visits = visits + 1 where idusers = ?",
    ADD_POINTS: "UPDATE users SET punten = punten+? WHERE username = ?",
    GET_USER_POINTS: "select punten from users where username = ?",
    //Roles statements
    SET_USER_GEBRUIKER: "insert into userrollen(iduser, idrollen) values (?,3)",
    UPDATE_USER_ROLE: "UPDATE userrollen SET idrollen = ? WHERE iduser = ?",
    //inventory statements
    GET_PRICE_PRODUCT: "SELECT prijs FROM inventaris WHERE productnaam = ?",
    GET_INVENTARIS: "SELECT * FROM inventaris ORDER BY productnaam",
    GET_PRODUCT: "SELECT * FROM inventaris WHERE idProduct =  ?",
    GET_PRODUCT_ID: "SELECT idProduct from inventaris WHERE productnaam = ?",
    UPDATE_INVENTARIS: "UPDATE inventaris SET laatstBesteld = ?, Aantal=?, prijs=?, punten=?, prijsinpunten=? WHERE idProduct =  ?",
    INSERT_PRODUCT: "INSERT into inventaris(productnaam, laatstBesteld, Aantal, prijs, punten, prijsinpunten) VALUES(?,?,?,?,?,?)",
    DELETE_PRODUCT: "DELETE FROM inventaris WHERE idProduct = ?",
    CHECK_SALES: "SELECT * FROM sales WHERE idProduct = ? and DATUM = ?",
    BUY_PRODUCT_NEW: "INSERT INTO sales(idProduct, amount, datum) VALUES(?,?,?); UPDATE inventaris set aantal = aantal - ? WHERE idProduct = ?; ",
    BUY_PRODUCT: "UPDATE sales set amount = amount + ? WHERE idProduct = ? and DATUM = ?; UPDATE inventaris set aantal = aantal - ? WHERE idProduct = ?; ",
    GET_BY_POINTS: "SELECT * FROM inventaris WHERE prijsinpunten <= ?",
    GET_PRODUCT_PRICE_IN_POINTS: "select idProduct, prijsinpunten from inventaris where idProduct = ? ; "
};
