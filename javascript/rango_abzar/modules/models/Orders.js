"use strict";
import implementjs from "implement-js";
const { Interface, type } = implementjs;

const options = { strict: true, trim: true, warn: false };

const Billing = Interface("Billing")(
    {
        first_name: type("any"),
        last_name: type("any"),
        company: type("any"),
        address_1: type("any"),
        address_2: type("any"),
        city: type("any"),
        state: type("any"),
        postcode: type("any"),
        country: type("any"),
        email: type("any"),
        phone: type("any"),
    },
    options
);

const Shipping = Interface("Shipping")(
    {
        first_name: type("any"),
        last_name: type("any"),
        company: type("any"),
        address_1: type("any"),
        address_2: type("any"),
        city: type("any"),
        state: type("any"),
        postcode: type("any"),
        country: type("any"),
    },
    options
);

const LineItems = Interface("LineItems")(
    {
        id: type("number"),
        name: type("any"),
        product_id: type("any"),
        variation_id: type("any"),
        quantity: type("any"),
        tax_class: type("any"),
        subtotal: type("any"),
        subtotal_tax: type("any"),
        total: type("any"),
        total_tax: type("any"),
        sku: type("any"),
        price: type("any"),
        // parent_name: type("any"),
    },
    options
);

const ShippingLines = Interface("ShippingLines")(
    {
        id: type("number"),
        method_title: type("any"),
        method_id: type("any"),
        instance_id: type("any"),
        total: type("any"),
        total_tax: type("any"),
    },
    options
);

const Order = Interface("Order")(
    {
        id: type("number"),
        parent_id: type("any"),
        number: type("any"),
        order_key: type("any"),
        created_via: type("any"),
        version: type("any"),
        status: type("any"),
        currency: type("any"),
        date_created: type("any"),
        date_created_gmt: type("any"),
        date_modified: type("any"),
        date_modified_gmt: type("any"),
        discount_total: type("any"),
        discount_tax: type("any"),
        shipping_total: type("any"),
        shipping_tax: type("any"),
        cart_tax: type("any"),
        total: type("any"),
        total_tax: type("any"),
        prices_include_tax: type("any"),
        customer_id: type("any"),
        customer_ip_address: type("any"),
        customer_user_agent: type("any"),
        customer_note: type("any"),
        billing: type("object", Billing),
        shipping: type("object", Shipping),
        payment_method: type("any"),
        payment_method_title: type("any"),
        transaction_id: type("any"),
        date_paid: type("any"),
        date_paid_gmt: type("any"),
        date_completed: type("any"),
        date_completed_gmt: type("any"),
        cart_hash: type("any"),
        line_items: type("array", [type("object", LineItems)]),
        shipping_lines: type("array", [type("object", ShippingLines)]),
        currency_symbol: type("any"),
    },
    options
);

const Orders = Interface("Orders")(
    {
        array: type("array", [type("object", Order)]),
    },
    options
);

export default Orders;
