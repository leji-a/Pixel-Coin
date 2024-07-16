import { defineStore } from 'pinia'

export default UserStore = defineStore('User', {
    state: () => {
        return {
            Logged: false,
            Username: '',
        }
    },
    getters: {
        user(state) {
            return state.Username
        }
    },
    actions: {
        Login(name) {
            this.Username = name,
            this.Logged = true
        },
        Logout() {
            this.Username = '',
            this.Logged = false
        }
    }
})