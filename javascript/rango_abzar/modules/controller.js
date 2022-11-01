"use strict";
import implementjs from "implement-js";
const implement = implementjs.default;
import config from "./config.js";

import wooCommerce from "./models/wooCommerce.js";
import nik82 from "./models/nik82.js";
import itosoft from "./models/itosoft.js";
import Orders from "./models/Orders.js";

class Controller {
    constructor() {
        this.db = { nik82, itosoft, wooCommerce };
    }

    async sync(req, res) {
        try {
            const sql = this.db.itosoft.sql;
            const itosoft = this.db.itosoft.connection.promise();
            const wooCommerce = this.db.wooCommerce;

            let query = "SELECT date FROM last_sync ORDER BY date DESC LIMIT 1";
            let [result] = await itosoft.query(query);
            const last_sync_date = result[0].date;

            query = "orders?status=completed&order=asc";
            query += `&per_page=${config.perPage}`;
            query += `&after=${last_sync_date}`;
            result = await wooCommerce.getAsync(query);
            result = JSON.parse(result.toJSON().body);
            result = implement(Orders)({ array: result });
            result = result = result.array;

            if (result === undefined || result.length == 0) {
                console.log("no data to sync");
                return res.send({ message: "no data to sync", success: true, status: 200 });
            }
            console.log(`syncing ${result.length} items from:`, last_sync_date);

            let orders = [];
            let orders_shippings = [];
            let orders_billings = [];
            let orders_line_items = [];
            let orders_shipping_lines = [];

            result.forEach((order) => {
                orders_shippings.push(Object.values({ order_id: order.id, ...order.shipping }));
                orders_billings.push(Object.values({ order_id: order.id, ...order.billing }));
                order.line_items.forEach((line_items) => {
                    orders_line_items.push(Object.values({ order_id: order.id, ...line_items }));
                });
                order.shipping_lines.forEach((shipping_line) => {
                    orders_shipping_lines.push(Object.values({ order_id: order.id, ...shipping_line }));
                });
                delete order.shipping;
                delete order.billing;
                delete order.line_items;
                delete order.shipping_lines;
                orders.push(Object.values(order));
            });

            let values = orders;
            query = sql.insert_into.orders;
            await itosoft.query(query, [values]);

            values = orders_shippings;
            query = sql.insert_into.orders_shipping;
            await itosoft.query(query, [values]);

            values = orders_billings;
            query = sql.insert_into.orders_billing;
            await itosoft.query(query, [values]);

            values = orders_line_items;
            query = sql.insert_into.orders_line_items;
            await itosoft.query(query, [values]);

            values = orders_shipping_lines;
            query = sql.insert_into.orders_shpping_lines;
            await itosoft.query(query, [values]);

            values = result.pop().date_created;
            query = `UPDATE last_sync SET date = '${values}' WHERE date = '${last_sync_date}'`;
            await itosoft.query(query);

            console.log("to:", values);
            return res.send({
                message: `synced ${order.length} orders`,
                success: true,
                status: 200,
                data: result,
            });
        } catch (error) {
            throw error;
        }
    }
}

export default new Controller();
