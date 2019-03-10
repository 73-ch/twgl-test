import Vue from 'vue';

document.addEventListener("DOMContentLoaded", () => {
  Vue.component('blog-post', {
    // js内ではキャメルケース
    props: ['postTitle'],
    template: '<h3>{{postTitle}}</h3>'
  });

  Vue.component('blog-post2', {
    // プロパティの型指定
    props: {
      title: String,
      likes: Number,
      isPublished: Boolean,
      commentIds: Array,
      author: Object
    },
    template: '<strong>{{title}}, {{likes}}, {{isPublished}}, {{commentIds}}, {{author}}</strong>'
  });

  Vue.component('child', {
    props: {
      initialCounter: Number,
      size: String
    },
    data: function() {
      return {
        counter: this.initialCounter,
        data_size: this.size.trim().toLowerCase()
      }
    },
    computed: {
      normalizedSize: function() {
        return this.size.trim().toLowerCase();
      }
    },
    methods: {
      bad: function() {
        this.initialCounter += 100;
        this.size = this.size.trim().toLowerCase()
      },
      good: function() {
        this.counter += 100;
      }
    },
    template: `
      <div>
        <h3>プロパティをローカルのデータで利用したい場合</h3>
        <p>😫initialCounter: {{initialCounter}}</p>
        <p>😃counter: {{counter}}</p>
        <h3>プロパティを加工した状態で利用したい時</h3>
        <p>😫size: {{size}}</p>
        <p>😫data_size: {{data_size}}</p>
        <p>😃normalizedSize: {{normalizedSize}}</p>
        <br>
        <button @click="bad">bad</button>
        <button @click="good">good</button>
      </div>
    `
  });

  function Person(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  Vue.component('my-component', {
    props: {
      propA: Number,
      propB: [String, Number],
      propC: {
        type: String,
        require: true,
        default: 'test'
      },
      propD: {
        type: Object,
        default: function() {
          return {message: 'hello~!'};
        }
      },
      propE: {
        validator: function(value) {
          // 注: バリデーションはコンポーネント生成前に行われるため、コンポーネントのプロパティ(dataやcomputedなど)はvalidator内では使えない
          // 🙅 ‍return value !== message
          return ['success', 'waring', 'danger'].indexOf(value) !== -1;
        }
      },
      propF: Person
    },
    data: function() {
      return {message: 'pending'}
    }
  });

  Vue.component('base-input', {
    inheritAttrs: false,
    props:['label', 'value'],
    template: `
      <label>
        {{label}}
        <input v-bind="$attrs" :value="value" @input="$emit('input', $event.target.value)">
      </label>
    `
  });

  const app = new Vue({
    el: '#app',
    name: 'app',
    data() {
      return {
        size: "TEST TEXT",
        username: 'nami'
      }
    }
  });
});