<template>
  <div>
    <b-btn v-b-modal.modalPrevent>Fill form here!</b-btn>
    <!-- Main UI -->
    <div class="mt-3 mb-3">
      Submitted Details:
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th @click="orderBy('name')">name</th>
            <th @click="orderBy('email')">email</th>
            <th @click="orderBy('dob')">DOB</th>
            <th colspan="2">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" id="list">
            <td> <span>{{user.id}}</span></td>
            <td> <span>{{user.name}}</span></td>
            <td> <span>{{user.email}}</span> </td>
            <td> <span>{{user.dob}}</span> </td>
            <td><a href="#" @click="deleteItem(user)">Delete</a>
              <a href="#" @click="edit(user)" v-b-modal.modalPrevent>Edit</a></td>
          </tr>
        </tbody>
      </table>
  
    </div>
    <!-- Modal Component -->
    <b-modal id="modalPrevent" ref="modal" title="Submit your Detail" @ok="handleOk" @shown="clearName">
      <form @submit.stop.prevent="handleSubmit">
        <b-form-input class="input" type="text" placeholder="Enter your Name" v-model="user.name"></b-form-input>
        <b-form-input class="input" type="email" placeholder="Enter your Email" v-model="user.email"></b-form-input>
        <b-form-input class="input" type="date" placeholder="Enter your DOB" v-model="user.dob"></b-form-input>
        <b-form-input class="input" type="password" placeholder="Enter your Password" v-model="user.password"></b-form-input>
        <b-form-input class="input" type="password" placeholder="Enter your Confirm-Password" v-model="user.con_password"></b-form-input>
        <b-form-checkbox id="checkbox1" v-model="status" value="accepted" unchecked-value="not_accepted">
          I accept the terms and use
        </b-form-checkbox>
      </form>
    </b-modal>
  </div>
</template>

<script>
  export default {
    name: "Form",
    data() {
      return {
        users: [],
        userCount: 0,
        status: false,
        user: {
          email: "",
          name: "",
          dob: "",
          password: "",
          con_password: ""
        },
        isEdit: false,
        sortKey: "",
        sortSettings: [{
            email: true
          },
          {
            name: true
          },
          {
            dob: true
          }
        ],
        desc: true
      };
    },
    methods: {
      clearName() {
        this.name = "";
      },
      clearEmail() {
        this.email = "";
      },
      clearDob() {
        this.dob = "";
      },
      clearPassword() {
        this.password = "";
      },
      clearConfirmPassword() {
        this.con_password = "";
      },
      handleOk(evt) {
        // Prevent modal from closing
        evt.preventDefault();
        if (!this.user.email) {
          alert("Please enter your email");
          return false;
        }
        if (!this.user.name) {
          alert("Please enter your name");
          return false;
        }
        if (!this.user.dob) {
          alert("Please enter your DOB");
          return false;
        }
        if (!this.user.password) {
          alert("Please enter your Password");
          return false;
        }
        if (!this.user.con_password) {
          alert("Please enter your Confirm Password");
          return false;
        }
        if (!this.status) {
          alert("please accept our terms and conditions");
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
        }
        this.$refs.modal.hide();
        alert("form submitted successfully");
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
        this.user = JSON.parse(JSON.stringify(user));
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
  
  table {
    margin: 0 auto;
    border-collapse: collapse;
    width: 50%;
    color: #586949;
    text-align: center;
    font-size: 20px;
  }
</style>
