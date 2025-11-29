import dbConnect from "@/config/db";
import Order from "@/models/Order";
import Product from "@/models/ProductModel";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await dbConnect();

    const orderWeight = 0.6;
    const rateWeight = 0.4;
    const limit = 10;
    const maxRating = 5;

    // پیدا کردن بیشترین تعداد سفارش بین همه محصولات
    const maxOrdersAgg = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalOrders: { $sum: "$items.quantity" }
        }
      },
      { $sort: { totalOrders: -1 } },
      { $limit: 1 }
    ]);

    const maxOrders = maxOrdersAgg.length ? maxOrdersAgg[0].totalOrders : 1;

    // گرفتن همه محصولات
    const products = await Product.find({});

    // محاسبه امتیاز محبوبیت برای هر محصول
    const scoredProducts = await Promise.all(
      products.map(async (item) => {
        const orderCount = await Order.countDocuments({ "items.product": item._id });

        const score =
          orderWeight * (orderCount / maxOrders) +
          rateWeight * (item.rate / maxRating);

        return {
          _id: item._id,
          name: item.name,
          description: item.description,
          image: item.image,
          offerPrice: item.offerPrice,
          rate: item.rate,
          score
        };
      })
    );

    // مرتب‌سازی بر اساس امتیاز محبوبیت
    scoredProducts.sort((a, b) => b.score - a.score);

    // محدود کردن خروجی
    return NextResponse.json({
      success: true,
      products: scoredProducts.slice(0, limit)
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
