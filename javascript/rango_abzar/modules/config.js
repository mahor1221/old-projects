"use strict";

const mysql_root = {
    host: "localhost",
    user: "root",
    password: "",
};

const config = {
    // this value only determines the date to start the sync from
    // after the first sync session it doesn't have any use
    syncStartingDate: "2020-11-01T00:00:00",
    perPage: 100, //wooCommerceAPI per_page parameter, max value 100
    port: 8080,
    db: {
        mysql: {
            root: mysql_root,

            itosoft: {
                ...mysql_root,
                database: "itosoft",
            },

            nik82: {
                ...mysql_root,
                database: "nik82",
            },
        },
        wooCommerceAPI: {
            url: "https://rangoabzar.com/",
            consumerKey: "ck_1df41c625ca898c62c50873b21467643fa2fe734",
            consumerSecret: "cs_1424feddd07272be27a0cd2c06833749631ca2db",
            wpAPI: true,
            version: "wc/v3",
        },
    },
};

if (config.perPage > 100) throw new Error("wooCommerceAPI per_page parameter must be less than 100")
 export default config;
