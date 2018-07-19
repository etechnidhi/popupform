<template>
  <b-container fluid>
    <div>
      <b-btn v-b-modal.modalPrevent>Fill form here!</b-btn>
      <br/><br/><br/><br/><br/>
      <!-- Modal Component -->
      <b-modal id="modalPrevent" ref="modal" title="Submit your Detail" @ok="handleOk">
        <form @submit.stop.prevent="handleSubmit">
          <b-form-input class="input" type="text" placeholder="Name" :maxlength="15" v-model="user.name"></b-form-input>
          <b-alert variant="danger" show v-if="!user.name && submitted">{{error_name}}</b-alert>
          <b-form-input class="input" type="email" placeholder="Enter your Email" max v-model="user.email"></b-form-input>
          <b-alert variant="danger" show v-if="(!user.email || emailRegErr) && submitted">{{error_message}}</b-alert>
          <b-form-input class="input" type="date" placeholder="Enter your DOB" icon="calendar-today" v-model="user.dob"></b-form-input>
          <b-alert variant="danger" show v-if="!user.dob && submitted">{{error_dob}}</b-alert>
          <b-form-input class="input" type="password" placeholder="Enter your Password" :maxlenght="16" :minlength="8" v-model="user.password"></b-form-input>
          <b-alert variant="danger" show v-if="!user.password && submitted">{{error_pass}}</b-alert>
          <b-form-input class="input" type="password" placeholder="Enter your Confirm-Password" :maxlenght="16" :minlength="8" v-model="user.con_password"></b-form-input>
          <b-alert variant="danger" show v-if="!user.con_password && submitted">{{error_conpass}}</b-alert>
          <br />
          <b-form-checkbox id="checkbox1" value="accepted" v-model="status" unchecked-value="not_accepted">
            I accept the terms and policy
          </b-form-checkbox>
        </form>
      </b-modal>
    </div>
    <br/>
  <!-- table -->
  <table class="table" striped hover :items="users">
        <thead class="thead-dark">
          <tr>
            <th scope="col" >S. no</th>
            <th scope="col" @click="orderBy('name')">Name</th>
            <th scope="col" @click="orderBy('email')">Email</th>
            <th scope="col" @click="orderBy('dob')">DOB</th>
            <th scope="col" colspan="2">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in paginatedData" :key="user.id" id="list">
            <td> <span>{{user.id}}</span></td>
            <td> <span>{{user.name}}</span></td>
            <td> <span>{{user.email}}</span> </td>
            <td> <span>{{user.dob}}</span> </td>
            <td><a href="#" @click="deleteItem(user)">Delete</a>
              <a href="#" @click="edit(user)" v-b-modal.modalPrevent>Edit</a></td>
          </tr>
        </tbody>
      </table>
      <div>
        <ul>
          <li v-for="p in paginatedData"  >
            {{p.first}} 
            {{p.last}}  
            {{p.suffix}}
          </li>
        </ul>
        <button :disabled="pageNumber === 0" @click="prevPage">
          Previous
        </button>
        <button :disabled="pageNumber >= pageCount -1" @click="nextPage">
          Next
      </button>
      </div>  
  </b-container>
</template>

<script>
const users = [];

export default {
  data() {
    return {
      users: [],
      user: {
        name: "",
        email: "",
        dob: "",
        password: "",
        con_password: ""
      },
      userCount: 0,
      submitted: false,
      status: false,
      sortKey: "",
      sortSettings: [
        {
          email: true
        },
        {
          name: true
        },
        {
          dob: true
        }
      ],
      error_message: "",
      error_message2: "",
      emailRegErr: false,
      pageNumber: 0,
      size: 5
    };
  },

  methods: {
    handleOk(evt) {
      // Prevent modal from closing
      evt.preventDefault();
      this.submitted = true;
      var re = /\S+@\S+\.\S+/;
      if (!this.user.email) {
        this.error_message = "please enter email";
      }
      if (!re.test(String(this.user.email).toLowerCase())) {
        this.error_message = "please enter valid email";
        this.emailRegErr = true;
      }
      if (!this.user.name) {
        this.error_name = "please enter name";
      }
      if (!this.user.dob) {
        this.error_dob = "please enter dob";
      }
      if (!this.user.password) {
        this.error_pass = "please enter password";
      }
      if (!this.user.con_password) {
        this.error_conpass = "please enter confirm password";
      }
      if (this.user.password != this.user.con_password) {
        this.error_conpass = "password do not match";
      }
      if (
        !this.user.email ||
        !re.test(String(this.user.email).toLowerCase()) ||
        !this.user.name ||
        !this.user.dob ||
        !this.user.password ||
        !this.user.con_password ||
        !this.user.password === this.user.con_password
      ) {
        return false;
      }
      if (!this.status) {
        return false;
      } else {
        this.handleSubmit();
        return true;
      }
    },

    handleSubmit() {
      if (this.isEdit) {
        for (var i = 0; i < this.users.length; i++) {
          if (this.users[i].id == this.user["id"]) {
            this.users[i] = this.user;
            this.isEdit = false;
          }
        }
      } else {
        this.users.push({
          id: ++this.userCount,
          email: this.user.email,
          name: this.user.name,
          dob: this.user.dob,
          password: this.user.password,
          con_password: this.user.con_password
        });
        this.pageCount();
      }
      this.$refs.modal.hide();
      this.submitted = false;
      this.user = {
        email: "",
        name: "",
        dob: "",
        password: "",
        con_password: ""
      };
    },
    deleteItem: function(user) {
      this.users.splice(this.users.indexOf(user), 1);
    },
    edit: function(user) {
      this.user = user;
      this.isEdit = true;
    },
    orderBy: function(sorKey) {
      this.sortKey = sorKey;
      this.sortSettings[sorKey] = !this.sortSettings[sorKey];
      this.desc = this.sortSettings[sorKey];
      this.users.sort((a, b) => {
        if (this.desc) {
          if (a[sorKey] > b[sorKey]) return -1;
          if (a[sorKey] < b[sorKey]) return 1;
          return 0;
        } else {
          if (a[sorKey] < b[sorKey]) return -1;
          if (a[sorKey] > b[sorKey]) return 1;
          return 0;
        }
      });
    },
    nextPage() {
      this.pageNumber++;
    },
    prevPage() {
      this.pageNumber--;
    },
    pageCount() {
      let l = this.users.length,
        s = this.size;
      return Math.floor(l / s);      
    }
  },
  computed: {
    paginatedData() {
      const start = this.pageNumber * this.size,
        end = start + this.size;    
      return this.users.slice(start, end);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
  margin: 10px;
}

.input {
  margin-top: 10px;
}

table,
th,
td {
  border: 1px solid grey;
}

th {
  cursor: pointer;
}

table {
  margin: 0 auto;
  border-collapse: collapse;
  /* width: 50%; */
  color: #586949;
  text-align: center;
  font-size: 20px;
}
</style>
