import Order from "../models/order.model";
import { IOrder } from "../interfaces/order.interface";

class OrderRepo {
  static async create(data: Partial<IOrder>) {
    const order = new Order(data);
    return order.save();
  }
}

export default OrderRepo;
