<template>
  <div id="app">
    <span>
      <font-awesome-icon icon="fas fa-text-height" />
      Test Console
    </span>
    <header v-if="testConsole && showTestConsole">
      <strong class="test-elemen">HTTPS link: <a v-bind:href="serverURL" target="_blank">link</a></strong>

      <button @click="deleteAllCaches" class="test-elem">
        <font-awesome-icon icon="fas fa-trash" />
        Delete All Caches
      </button>

      <button @click="unregisterAllServiceWorkers" class="test-elem">
        <font-awesome-icon icon="fab fa-uniregistry" />
        Unregister All ServiceWorkers
      </button>
      <button @click="reloadPage" class="test-elem">
        <font-awesome-icon icon="fas fa-sync" />
        Reload Page
      </button>
    </header>
    <!-- Navbar section -->
    <div class="navbar">
      <h1>BookMart.com</h1>
      <!-- Search and cart functionality -->
      <div class="search-cart">
        <div id="search-Bar">
          <!-- Search input and button -->
          <input class="input" type="search" id="search-input" v-model="searchQuery" placeholder="Search here..."
            @input="filteredBooks">
        </div>
      </div>
      <!-- Shopping cart button -->
      <button id="basket-button" @click="showBasket">{{ cardLength }} <font-awesome-icon
          icon="fa-solid fa-cart-shopping" /> Basket </button>
      <!-- Main content section -->
    </div>
    <main>
      <component :is="currentView" :subjects="subjects" :showProduct="showProduct" :sortByOption="sortByOption"
        :sortOrder="sortOrder" :cartItems="cartItems" :showCart="showCart" :showCheckOutForm="showCheckOutForm"
        :userData="userData" :order="order" :orderSubmitted="orderSubmitted" @add-to-cart="addToCart"
        @submit-form="submitForm" @remove-from-cart="removeFromCart" @toggle-checkout-form="toggleCheckoutForm"
        @validate-name="validateName" @validate-phone="validatePhone"></component>
    </main>

  </div>

</template>

<script>
import Product from './components/Product.vue';
import Checkout from './components/Checkout.vue';
export default {
  name: "App",
  data() {
    return {
      currentView: 'Product',
      sortByOption: "price",
      searchQuery: '',
      sortOrder: "asc",
      subjects: [],
      userData: {
        name: '',
        phone: '',
      },
      showProduct: true,
      showCart: false,
      showSortingOptions: true,
      showCheckOutForm: false,
      cartItems: [],
      orderSubmitted: false,
      order: {
        id: [],
        quantity: []
      },
      testConsole: true,
      showTestConsole: true,
      serverURL: 'https://bookmart.eu-north-1.elasticbeanstalk.com/collections/products'
    }
  },
  components: {
    Product,
    Checkout
  },
  methods: {
    showBasket() {
      this.showCart = !this.showCart;
      this.showProduct = !this.showProduct;
      this.showCheckOutForm = false;
      if (this.showCart) {
        this.currentView = 'Checkout';
      } else {
        this.currentView = 'Product';
      }
    },
    // Add a book to the cart
    addToCart: function (book) {
      let itemId = book.id;
      let counter = 0;
      if (this.cartItems.length != 0) {
        this.cartItems.forEach(element => {
          if (itemId == element.id) {
            counter += 1;
          }
        });
        if (counter == 0) {
          this.cartItems.push(book);
          book.cartItem++;
        }

      } else {
        this.cartItems.push(book);
        book.cartItem += 1;
      }
      book.cartItem += counter;
      book.availability--;
    },

    deleteAllCaches() {
      caches.keys().then(function (names) {
        for (let name of names)
          caches.delete(name);
      });
      console.log("All Caches Deleted");
    },
    unregisterAllServiceWorkers() {
      navigator.serviceWorker.getRegistrations().then(function (registrations) {
        for (let registration of registrations) {
          registration.unregister()
        }
      });
      console.log("ServiceWorkers Unregistered");
    },
    reloadPage() {
      window.location.reload();
    },
    // Computed property to filter books based on search query
    filteredBooks: function () {
      const key = this.searchQuery.toLowerCase().trim();
      if (key == "") {
        // Fetch all products when the search query is empty
        fetch(`https://bookmart.eu-north-1.elasticbeanstalk.com/collections/products`)
          .then(response => response.json())
          .then(data => this.subjects = data)
          .catch(err => console.error('Error:', err));
        return this.subjects;
      } else {
        // Send the search query to the server
        fetch(`https://bookmart.eu-north-1.elasticbeanstalk.com/search?q=${this.searchQuery}`)
          .then(response => response.json())
          .then(data => this.subjects = data)
          .catch(err => console.error('Error:', err));
        return this.subjects;
      }
    },
    // Remove a book from the cart
    removeFromCart: function (index) {
      if (index >= 0 && index < this.cartItems.length) {
        const removedItem = this.cartItems[index];

        // Decrease the cartItem property by 1
        if (removedItem.cartItem > 0) {
          removedItem.cartItem -= 1;
        }

        // If cartItem becomes 0, remove the item from the cart
        if (removedItem.cartItem === 0) {
          this.cartItems.splice(index, 1);
        }

        // Increase availability of the removed item
        const bookIndex = this.subjects.findIndex((book) => book.title === removedItem.title);
        if (bookIndex !== -1) {
          this.subjects[bookIndex].availability += 1;
        }
      }
    },
    toggleCheckoutForm() {
      this.showCheckOutForm = !this.showCheckOutForm;
    },
    // Function to validate the Name field (letters only)
    validateName() {
      const namePattern = /^[A-Za-z\s]+$/;
      return namePattern.test(this.userData.name);
    },
    // Function to validate the Phone field (numbers only)
    validatePhone() {
      const phonePattern = /^\d+$/;
      return phonePattern.test(this.userData.phone);
    },
    // Function to handle form submission (placeholder, no implementation)
    submitForm() {
      // Prepare order data
      this.order.name = this.userData.name,
        this.order.phone = this.userData.phone,
        this.order.id = this.cartItems.map(item => item.id),
        this.order.quantity = this.cartItems.map(item => item.cartItem),

        // Send order to the server (POST request)
        fetch('https://bookmart.eu-north-1.elasticbeanstalk.com/collections/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.order),
        })
          .then(response => response.json())
          .then(data => {
            const cartItemIds = this.cartItems.map(cartItem => cartItem.id);
            // Send a PUT request to update the cart items with the order id
            fetch('https://bookmart.eu-north-1.elasticbeanstalk.com/collections/products', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ id: this.order.id, quantity: this.order.quantity })
            })
              .then(response => response.json())
              .then(data => {
                this.subjects = data;
                if (window.confirm('Order submitted successfully!')) {
                  if (window.confirm('Continue shopping, have a nice day! :).')) {
                    location.reload();
                  }
                }
              })
              .catch(error => {
                console.error('Error mapping order to cart items:', error);
              });
          })
          .catch(error => {
            console.error('Error submitting order:', error);
          });
    }
  },
  // Computed properties for sorting and filtering books, form validation, and cart length
  computed: {
    // Computed property to sort books based on selected options
    sortedBooks: function () {
      let sortedBooks = [...this.subjects];

      if (this.sortByOption === "price") {
        sortedBooks.sort((a, b) =>
          this.sortOrder === "asc" ? a.price - b.price : b.price - a.price
        );
      } else if (this.sortByOption === "location") {
        sortedBooks.sort((a, b) =>
          this.sortOrder === "asc"
            ? a.location.localeCompare(b.location)
            : b.location.localeCompare(a.location)
        );
      } else if (this.sortByOption === "availability") {
        sortedBooks.sort((a, b) =>
          this.sortOrder === "asc" ? a.availability - b.availability : b.availability - a.availability
        );
      } else if (this.sortByOption === "title") {
        sortedBooks.sort((a, b) =>
          this.sortOrder === "asc"
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title)
        );
      }
      return sortedBooks;
    },

    cardLength: function () {
      let total = 0;
      this.cartItems.forEach(element => {
        total += element.cartItem;
      });
      return total || "0";
    },
  },

  // Fetch the products from the server
  created: function () {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("service-worker.js");
    }
    // Fetch books data from the server when the component is create
    fetch('https://bookmart.eu-north-1.elasticbeanstalk.com/collections/products')
      .then(response => response.json())
      .then(data => this.subjects = data)
      .catch(err => console.error('Error:', err));

  },
};
</script>
