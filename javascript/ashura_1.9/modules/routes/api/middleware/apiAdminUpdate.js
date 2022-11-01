const jwt = require("jsonwebtoken");
const Admin = require(`${config.path.model}/admin`);
const superAdmin = require(`${config.path.model}/superAdmin`);

module.exports = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (token) {
        return jwt.verify(token, config.secret, (err, decode) => {
            if (err) {
                return res.json({
                    success: false,
                    data: "Failed to authenticate token.",
                    status: 403,
                });
            }

            superAdmin.findById(decode.superAdmin_id, (err, superAdmin) => {
                if (err) throw err;

                if (superAdmin) {
                    superAdmin.token = token;
                    req.superAdmin = superAdmin;
                    next();
                    return;
                }
            
                if ((req.params.id = decode.admin_id)) {
                    Admin.findById(decode.admin_id, (err, admin) => {
                        if (err) throw err;

                        if (admin) {
                            req.params.id = decode.admin_id;
                            admin.token = token;
                            req.admin = admin;
                            next();
                        } else {
                            return res.json({
                                success: false,
                                data: "Admin not found",
                                status: 404,
                            });
                        }
                    });
                } else {
                    return res.status(403).json({
                        data: "No Token Provided",
                        success: false,
                        status: 403,
                    });
                }
            });
        });
    }

    return res.status(403).json({
        data: "No Token Provided",
        success: false,
        status: 403,
    });
};
