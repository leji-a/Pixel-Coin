import { defineStore } from 'pinia'

export const UserStore = defineStore('User', {
    state: () => {
        return {
            Logged: false,
            Username: '',
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