"use strict";
import WooCommerceAPI from "woocommerce-api";
import config from "../config.js";

const getModel = async () => {
    try {
        const model = new WooCommerceAPI(config.db.wooCommerceAPI);
        return model;
    } catch (error) {
        throw error;
    }
};

export default await getModel();
