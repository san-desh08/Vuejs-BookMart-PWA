<template>
  <!-- Shopping cart items section -->
  <section>
    <div class="cart-items">
      <div v-if="showCart">
        <h2>Shopping Cart</h2>
        <!-- Check if cart is empty -->
        <template v-if="cartItems.length === 0">
          <p>Your shopping cart is empty.</p>
        </template>
        <!-- Render table if cart is not empty -->
        <template v-else>
          <table>
            <thead>
              <!-- Table headers -->
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Location</th>
                <th>Remove</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              <!-- Display cart items in a table -->
              <tr v-for="(item, index) in cartItems" :key="index">
                <td><img :src="'https://bookmart.eu-north-1.elasticbeanstalk.com/' + item.icon" alt="Book Icon"></td>
                <td>{{ item.title }}</td>
                <td>{{ item.cartItem }}</td>
                <td>{{ item.location }}</td>
                <!-- Remove item button -->
                <td><button id="remove-item" @click="removeFromCart(index)"><i class="fa-solid fa-trash"
                      style="color: #f10404;"></i></button></td>
                <td>£{{ item.price * item.cartItem }}</td>
              </tr>
            </tbody>
          </table>
          <!-- Proceed to checkout button -->
          <button id="proceed-to-checkout" @click="toggleCheckoutForm">Proceed to Checkout</button>
        </template>
      </div>
    </div>



    <!-- Checkout form section -->
    <div class="checkout-form" v-if="showCheckOutForm">
      <h1>Checkout</h1>
      <!-- Name input field -->
      <div class="form-group">
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="userData.name" required>
        <!-- Name validation message -->
        <p v-if="userData.name && !validateName()" style="color: red;">Name should contain letters only.
        </p>
      </div>
      <!-- Phone input field -->
      <div class="form-group">
        <label for="phone">Phone:</label>
        <input type="tel" id="phone" v-model="userData.phone" required>
        <!-- Phone validation message -->
        <p v-if="userData.phone && !validatePhone()" style="color: red;">Phone should contain numbers
          only.</p>
      </div>
      <!-- Checkout button -->
      <button @click="submitForm" :disabled="!isFormValid">Checkout</button>
      <!-- Order confirmation message -->
      <!-- <div class="order-confirmation" v-if="orderSubmitted">
                <p>Order has been submitted!</p>
            </div> -->

      <!-- Order information section -->
      <div class="order-info" v-if="orderSubmitted">
        <h2>Order Information:</h2>
        <p><strong>Name:</strong> {{ userData.name }}</p>
        <p><strong>Phone:</strong> {{ userData.phone }}</p>
      </div>
    </div>
  </section>
</template>
<script>

export default {
  name: 'Checkout',
  props: ["cartItems", "showCart", "showCheckOutForm", "userData", "orderSubmitted", "order"],
  methods: {
    toggleCheckoutForm() {
      this.$emit('toggle-checkout-form');
    },
    validateName() {
     this.$emit('validate-name', this.userData.name);
    },
    validatePhone() {
      this.$emit('validate-phone', this.userData.phone);
    },
    removeFromCart(index) {
      this.$emit('remove-from-cart', index);
    },
    submitForm() {
     this.$emit('submit-form');
    }
  },
  computed: {
    isFormValid() {
      return this.validateName() && this.validatePhone();
    }
  }
};
</script>