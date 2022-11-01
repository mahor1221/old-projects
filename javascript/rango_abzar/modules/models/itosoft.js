"use strict";
import { createConnection } from "mysql2/promise";
import config from "../config.js";

const getInsertIntoQuery = (query) => {
    query = query.split(",");
    let fields = [];
    let table = query[0].split("(");
    query[0] = table[1];
    table = table[0].trim().split(" ").pop();
    query.forEach((field) => {
        field = field.trim().split(" ")[0];
        if (field !== "PRIMARY" && field !== "FOREIGN") fields.push(field);
    });
    return (query = `INSERT INTO ${table} (${fields}) VALUES ?`);
};

const getModel = async () => {
    try {
        let query = "CREATE DATABASE IF NOT EXISTS itosoft;";
        const root = await createConnection(config.db.mysql.root);
        root.query(query);
        const conn = await createConnection(config.db.mysql.itosoft);

        query = "CREATE TABLE IF NOT EXISTS last_sync (date varchar(19));";
        conn.query(query);
        query = `INSERT INTO last_sync (date) \
        SELECT '${config.syncStartingDate}' \
        WHERE NOT EXISTS (SELECT * FROM last_sync)`;
        conn.query(query);

        query = "CREATE TABLE IF NOT EXISTS orders (\
        id                      bigint NOT NULL,\
        parent_id               bigint,\
        number                  varchar(255),\
        order_key               varchar(255),\
        created_via             varchar(255),\
        version                 varchar(255),\
        status                  varchar(255),\
        currency                varchar(3),\
        date_created            varchar(19),\
        date_created_gmt        varchar(19),\
        date_modified           varchar(19),\
        date_modified_gmt       varchar(19),\
        discount_total          varchar(255),\
        discount_tax            varchar(255),\
        shipping_total          varchar(255),\
        shipping_tax            varchar(255),\
        cart_tax                varchar(255),\
        total                   varchar(255),\
        total_tax               varchar(255),\
        prices_include_tax      boolean,\
        customer_id             bigint,\
        customer_ip_address     varchar(255),\
        customer_user_agent     varchar(1020),\
        customer_note           varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,\
        payment_method          varchar(255),\
        payment_method_title    varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_persian_ci,\
        transaction_id          varchar(255),\
        date_paid               varchar(19),\
        date_paid_gmt           varchar(19),\
        date_completed          varchar(19),\
        date_completed_gmt      varchar(19),\
        cart_hash               varchar(255),\
        currency_symbol         varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_persian_ci,\
        \
        PRIMARY KEY (id));".replace(
            /\s+/g,
            " "
        );
        const orders = getInsertIntoQuery(query);
        conn.query(query);

        query = "CREATE TABLE IF NOT EXISTS orders_billing (\
        order_id                bigint NOT NULL,\
        first_name              varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_persian_ci,\
        last_name               varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_persian_ci,\
        company                 varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_persian_ci,\
        address_1               varchar(1020) CHARACTER SET utf8mb4 COLLATE utf8mb4_persian_ci,\
        address_2               varchar(1020) CHARACTER SET utf8mb4 COLLATE utf8mb4_persian_ci,\
        city                    varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_persian_ci,\
        state                   varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_persian_ci,\
        postcode                varchar(255),\
        country                 varchar(2),\
        email                   varchar(255),\
        phone                   varchar(255),\
        FOREIGN KEY (order_id) REFERENCES orders(id));".replace(
            /\s+/g,
            " "
        );
        const orders_billing = getInsertIntoQuery(query);
        conn.query(query);

        query = "CREATE TABLE IF NOT EXISTS orders_shipping (\
        order_id                bigint NOT NULL,\
        first_name              varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_persian_ci,\
        last_name               varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_persian_ci,\
        company                 varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_persian_ci,\
        address_1               varchar(1020) CHARACTER SET utf8mb4 COLLATE utf8mb4_persian_ci,\
        address_2               varchar(1020) CHARACTER SET utf8mb4 COLLATE utf8mb4_persian_ci,\
        city                    varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_persian_ci,\
        state                   varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_persian_ci,\
        postcode                varchar(255),\
        country                 varchar(2),\
        FOREIGN KEY (order_id) REFERENCES orders(id));".replace(
            /\s+/g,
            " "
        );
        const orders_shipping = getInsertIntoQuery(query);
        conn.query(query);

        query = "CREATE TABLE IF NOT EXISTS orders_line_items (\
        order_id                bigint NOT NULL,\
        id                      bigint NOT NULL,\
        name                    varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_persian_ci,\
        product_id              bigint,\
        variation_id            bigint,\
        quantity                bigint,\
        tax_class               varchar(255),\
        subtotal                varchar(255),\
        subtotal_tax            varchar(255),\
        total                   varchar(255),\
        total_tax               varchar(255),\
        sku                     varchar(255),\
        price                   bigint,\
        \
        PRIMARY KEY (id),\
        FOREIGN KEY (order_id) REFERENCES orders(id));".replace(
            /\s+/g,
            " "
        );
        // parent_name             varchar(255),\ 

        const orders_line_items = getInsertIntoQuery(query);
        conn.query(query);

        query = "CREATE TABLE IF NOT EXISTS orders_shpping_lines (\
        order_id                bigint NOT NULL,\
        id                      bigint NOT NULL,\
        method_title            varchar(1020) CHARACTER SET utf8mb4 COLLATE utf8mb4_persian_ci,\
        method_id               varchar(255),\
        instance_id             varchar(255),\
        total                   varchar(255),\
        total_tax               varchar(255),\
        \
        PRIMARY KEY (id),  \
        FOREIGN KEY (order_id) REFERENCES orders(id));".replace(
            /\s+/g,
            " "
        );
        const orders_shpping_lines = getInsertIntoQuery(query);
        conn.query(query);

        const model = {
            ...conn,
            sql: {
                insert_into: {
                    orders: orders,
                    orders_billing: orders_billing,
                    orders_shipping: orders_shipping,
                    orders_line_items: orders_line_items,
                    orders_shpping_lines: orders_shpping_lines,
                },
            },
        };
        return model;
    } catch (error) {
        throw error;
    }
};

export default await getModel();
