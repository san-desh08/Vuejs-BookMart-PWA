<template>
  <section>
  <div class="container">
    <!-- Sorting options section -->
    <div class="sorting-options">
      <label>Sort By:</label>
      <!-- Dropdown for sorting options -->
      <select v-model="sortByOption">
        <option value="title">Book Name</option>
        <option value="price">Price</option>
        <option value="location">Location</option>
        <option value="availability">Availability</option>
      </select>
      <!-- Radio buttons for sort order -->
      <label>Sort Order:</label>
      <input type="radio" v-model="sortOrder" value="asc" id="ascending" />
      <label for="ascending">Ascending</label>
      <input type="radio" v-model="sortOrder" value="desc" id="descending" />
      <label for="descending">Descending</label>
    </div>
  </div>
  <!-- Book list section -->
  <div class="book-list">
    <div v-for="book in subjects" class="book-card">
      <!-- Book details -->
      <img class="image" v-bind:src="'https://bookmart.eu-north-1.elasticbeanstalk.com/' + book.icon" alt="Book Icon">

      <h3>{{ book.title }}</h3>
      <p>Price: £{{ book.price }}</p>
      <p>Location: {{ book.location }}</p>
      <p>Availability: {{ book.availability > 0 ? book.availability + ' In Stock' : 'Out of Stock' }}</p>
      <!-- Add to cart button -->
      <button id="add-basket" @click="addToCart(book)" :disabled="book.availability === 0">Add to
        Basket</button>
      <p v-if="book.availability === 0" style="color: red;">Out of Stock</p>
    </div>
  </div>
  </section>
</template>

<script> 
export default {
  name: 'Product',
  props: ["subjects", "sortByOption", "sortOrder"],
  methods: {
    addToCart(book) {
      this.$emit('add-to-cart', book);
    },
  }
};
</script>