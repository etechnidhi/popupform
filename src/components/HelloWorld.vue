<template>
  <b-container fluid>
    <div>
      <b-btn v-b-modal.modalPrevent>Fill form here!</b-btn>
      <br/><br/><br/><br/><br/>
      <!-- Modal Component -->
      <b-modal id="modalPrevent" ref="modal" title="Submit your Detail" @ok="handleOk">
        <form @submit.stop.prevent="handleSubmit">
          <!-- <div class="form-group" :class="{'has-error': errors.has('name') }"> -->
            <b-form-input class="input"  type="text" placeholder="Name" v-model="user.name"></b-form-input>
            <b-alert variant="danger" show v-if="nameError && submitted" >{{error_name}}</b-alert>
          <!-- </div> -->
          <b-form-input class="input" type="email"  placeholder="Enter your Email" v-model="user.email"></b-form-input>
          <b-alert variant="danger"  show v-if="emailError && submitted" >{{error_message}}</b-alert>
          <b-form-input class="input" type="date" placeholder="Enter your DOB" icon="calendar-today" v-model="user.dob"></b-form-input>
          <b-alert variant="danger" show v-if="dobError && submitted">{{error_message}}</b-alert>
          <b-form-input class="input" type="password" placeholder="Enter your Password" v-model="user.password"></b-form-input>
          <b-alert variant="danger" show v-if="passError && submitted">{{error_message}}</b-alert>
          <b-form-input class="input" type="password" placeholder="Enter your Confirm-Password" v-model="user.con_password"></b-form-input>
          <b-alert variant="danger" show v-if="con_passError && submitted">{{error_message}}</b-alert>
          <br />
          <b-form-checkbox id="checkbox1" value="accepted" v-model="status" unchecked-value="not_accepted">
            I accept the terms and policy
          </b-form-checkbox>
          <!-- <b-alert variant="danger" show v-if="!user.status && submitted">Please accept our terms and conditions</b-alert> -->
        </form>
      </b-modal>
    </div>
    <!--  Interface controls -->
    <b-row>
     
      <b-col md="6" class="my-1">
        <b-form-group horizontal label="Sort" class="mb-0">
          <b-input-group>
            <b-form-select v-model="sortBy" :options="sortOptions">
              <option slot="first" :value="null">-- none --</option>
            </b-form-select>
            <b-form-select :disabled="!sortBy" v-model="sortDesc" slot="append">
              <option :value="false">Asc</option>
              <option :value="true">Desc</option>
            </b-form-select>
          </b-input-group>
        </b-form-group>
      </b-col>
      
      <b-col md="6" class="my-1">
        <b-form-group horizontal label="Per page" class="mb-0">
          <b-form-select :options="pageOptions" v-model="perPage" />
        </b-form-group>
      </b-col>
    </b-row>
    <br/>
  
    <!-- Main table element -->
    <b-table show-empty stacked="md" :items="users" :fields="fields" :current-page="currentPage" :per-page="perPage" :filter="filter" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :sort-direction="sortDirection" @filtered="onFiltered">
      <template slot="name" slot-scope="row">{{row.value}}
</template>

<template slot="email" slot-scope="row">
   {{row.value}}
</template>

<template slot="dob" slot-scope="row">
   {{row.value}}
</template>

<template slot="actions" slot-scope="row">
  <!-- We use @click.stop here to prevent a 'row-clicked' event from also happening -->
  <b-button size="sm" @click="deleteItem(user)" class="mr-1">
    DELETE
  </b-button>
  <b-button size="sm" @click="edit(row)" v-b-modal.modalPrevent>
    EDIT
  </b-button>
</template>

<template slot="row-details" slot-scope="row">
  <b-card>
    <ul>
      <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value}}</li>
    </ul>
  </b-card>
</template>
    </b-table>

    <b-row>
      <b-col md="6" class="my-1">
        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
      </b-col>
    </b-row>

    <!-- Info modal -->
    <b-modal id="modalInfo" @hide="resetModal" :title="modalInfo.title" ok-only>
      <pre>{{ modalInfo.content }}</pre>
    </b-modal>
    
  </b-container>
</template>

<script>
import VeeValidate from 'vee-validate';

  const users = [];
  VeeValidate.Validator.extend('passphrase', {
    // getMessage: field => 'Sorry, wrong pass phrase.',
    validate: value => value.toUpperCase() == 'Demogorgon'.toUpperCase()
});
  
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
        fields: [
          {
            key: "name",
            label: "Name",
            sortable: true,
            sortDirection: "desc"
          },
          {
            key: "email",
            label: "Email",
            sortable: true
          },
          {
            key: "dob",
            label: "DOB",
            sortable: true,
            class: "text-center"
          },
          {
            key: "actions",
            label: "Actions"
          }
        ],
        nameError:false,
        emailError:false,
        dobError:false,
        passError:false,
        con_passError:false,
        currentPage: 1,
        perPage: 5,
        totalRows: users.length,
        pageOptions: [5],
        sortBy: null,
        sortDesc: false,
        sortDirection: "asc",
        filter: null,
        modalInfo: {
          title: "",
          content: ""
        }
      };
    },
    computed: {
      sortOptions() {
        // Create an options list from our fields
        return this.fields.filter(f => f.sortable).map(f => {
          return {
            text: f.label,
            value: f.key
          };
        });
      }
    },
    methods: {
      info(item, index, button) {
        this.modalInfo.title = `Row index: ${index}`;
        this.modalInfo.content = JSON.stringify(item, null, 2);
        this.$root.$emit("bv::show::modal", "modalInfo", button);
      },
      resetModal() {
        this.modalInfo.title = "";
        this.modalInfo.content = "";
      },
      onFiltered(filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length;
        this.currentPage = 1;
      },
      handleOk(evt) {
        // Prevent modal from closing
        evt.preventDefault();
        this.submitted = true;
        if (!this.user.email) {
          this.emailError = true
          this.error_message="please enter email";
          return false;
        }
        if (!this.user.name) {
          this.nameError= true;
          this.error_name ="please enter name";
          return false;
        }
        if (!this.user.dob) {
          this.dobError= true;
          this.error_message="please enter dob";
          return false;
          
        }
        if (!this.user.password) {
          this.passError=true;
          this.error_message="please enter password";
          return false;
        }
        if (!this.user.con_password) {
          this.con_passError=true;
          this.error_message="please enter confirm password";
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
        // this.$validator.validateAll();
        // if (!this.errors.any()) {
        //     this.submitForm()
        // }
        if (this.isEdit) {
          for (var i = 0; i < this.users.length; i++) {
            if (this.users[i].id == this.user["id"]) {
              this.users[i] = this.user;
              this.isEdit = false;
            }
          }
          // eslint-disable-next-line
          
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
        // alert("form submitted successfully");
        this.submitted = false;
        this.user = {
          email: "",
          name: "",
          dob: "",
          password: "",
          con_password: ""
        };
                   // console.log("***",JSON.stringify(this.users));

      },
      deleteItem: function(user) {
        this.users.splice(this.users.indexOf(user), 1);
      },
      edit: function(user) {
        // eslint-disable-next-line 
        // console.log(user);
        this.user = user.item;
        this.isEdit = true;
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
