import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

class Communicator {
    constructor() {
      this.authServiceClient = axios.create({ baseURL: `http://localhost:${process.env.AUTH_PORT}/api` });
      this.productServiceClient = axios.create({ baseURL: `http://localhost:${process.env.PRODUCTS_PORT}/api` });
      this.orderServiceClient = axios.create({ baseURL: `http://localhost:${process.env.ORDERS_PORT}/api`});
      this.notificationServiceClient = axios.create({ baseURL: `http://localhost:${process.env.NOTIFICATIONS_PORT}/api` });
    }
  //authentication service communication
  async authTest(){
    const response = await  this.authServiceClient.get('/test');
    return response.data;
  }
    async  signIn(email, password) {
        const response = await this.authServiceClient.post('/signin', { email, password });
        return response.data;
      }
      
    async  signUp( password, email, name, role) {
        const response = await this.authServiceClient.post('/signup', { password, email, name, role });
        return response.data;
      }
      
    async  logout() {
        const response = await this.authServiceClient.post('/logout');
        return response.data;
      }
    async  refreshToken(token) {
        const response = await this.authServiceClient.post('/refreshToken', { token });
        return response.data;
    }
    async  verifyToken(token) {
        const response = await this.authServiceClient.post('/verifyToken', { token });
        return response.data;
    }
    async  getUsers() {
        const response = await this.authServiceClient.get('/getUsers');
        return response.data;
    }
    async  getUser(user_id) {
        const response = await this.authServiceClient.get(`/getUser/${user_id}`,);
        return response.data;
    }

    //product service communication
    async  addProduct(seller_id, title, description, price, stock_quantity, category) {
        const response = await this.productServiceClient.post('/addProduct', {seller_id, title, description, price, stock_quantity, category});
        return response.data;
      }
    async  updateProduct(product_id, product) {
        const response = await this.productServiceClient.put('/updateProduct', {product, product_id});
        return response.data;
    }
    async  deleteProduct(product_id) {
        const response = await this.productServiceClient.delete('/deleteProduct', { product_id });
        return response.data;
    }

    async  getProducts() {
        const response = await this.productServiceClient.get('/getProducts');
        return response.data;
    }
    async  getProduct(product_id) {
        const response = await this.productServiceClient.get(`/getProduct/${product_id}`);
        return response.data;
    }

  //order service communication
  async  placeOrder(order) {
    const response = await this.orderServiceClient.post('/placeOrder', {order});
    return response.data;
  }
    async  updateOrder(order_id,order) {
        const response = await this.orderServiceClient.put('/updateOrder', {order_id,order});
        return response.data;
    }

    async  cancelOrder(order_id) {
        const response = await this.orderServiceClient.patch('/cancelOrder', { order_id });
        return response.data;
    }

    async  getOrders(user_id) {
        const response = await this.orderServiceClient.post('/getOrders', { user_id });
        return response.data;
    }
    async  getOrder(order_id) {
        const response = await this.orderServiceClient.get(`/getOrder/${order_id}`);
        return response.data;
    }

    //notification service communication
    async  sendNotification(user_id, subject, message) {
        const response = await this.notificationServiceClient.post('/sendNotification', {user_id,subject,message});
        return response.data;
      }




}
export default new Communicator();