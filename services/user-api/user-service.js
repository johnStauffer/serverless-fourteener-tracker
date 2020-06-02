import {Model} from './model';
import normalizeEmail from "normalize-email";


export class UserService {
    constructor() {
        this.model = new Model();
    }

    async createUser(userInput) {
        return new Promise((resolve, reject) => {
            const normalizedUser = this.normalizeUser(userInput);
            this.model.getUserByEmail(normalizedUser)
                .then(existingUser => {
                    if (existingUser != null) {
                        reject(new Error(`User already exists for email: ${normalizedUser.email}`));
                    } else {
                        return this.model.putUser(normalizedUser);
                    }
                })
                .then(() => this.model.getUser(userInput.userId)
                    .then(user => {
                        resolve(user);
                    }));
        });
    }

    async getUserById(userId) {
        return this.model.getUser(userId);
    }

    async getUserByEmail(email){
        //todo validation
        return this.model.getUserByEmail(email, normalizeEmail);
    }


    normalizeUser = userInput => {
        return ({
            userId: userInput.userId,
            firstName: userInput.firstName.toLowerCase(),
            lastName: userInput.lastName.toLowerCase(),
            email: normalizeEmail(userInput.email),
            location: userInput.location,
        });
    };
}