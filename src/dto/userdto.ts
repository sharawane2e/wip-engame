export class userDto {
    id: Number
    firstname: String
    lastname: String
    username: String
    password: String
    isEmailVerified: Boolean
    accessToken: String
    purchasedwidgets: Array<Object>
    cartwidgets: Array<Object>
}