"use strict";
import { createConnection } from "mysql2/promise";
import config from "../config.js";

const getModel = async () => {
    try {
        const conn = createConnection(config.db.mysql.nik82);
        const model = {
            conn: conn,
        };
        return model;
    } catch (error) {
        throw error;
    }
};

export default await getModel();
