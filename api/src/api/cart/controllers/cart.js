// src/api/cart/controllers/cart.js
"use strict";

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::cart.cart", ({ strapi }) => ({
  async find(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized("You must be logged in");

    const cart = await strapi.db.query("api::cart.cart").findOne({
      where: { user: user.id },
      populate: ["products"],
    });

    return cart || { products: [], quantities: {}, total: 0 };
  },

  async update(ctx) {
  const user = ctx.state.user;
  if (!user) return ctx.unauthorized("You must be logged in");

  const { products, quantities, total } = ctx.request.body.data;




    const cart = await strapi.db.query("api::cart.cart").findOne({
  where: { users_permissions_user: user.id },
});


    if (cart) {
      return await strapi.db.query("api::cart.cart").update({
        where: { id: cart.id },
       data: { users_permissions_user: user.id, products, quantities, total },

      });
    } else {
      return await strapi.db.query("api::cart.cart").create({
       data: { users_permissions_user: user.id, products, quantities, total },

      });
    }
  },
}));
