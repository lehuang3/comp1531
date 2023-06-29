// YOU SHOULD MODIFY THIS OBJECT BELOW
export interface Data {
  users: User[];
  quizzes: Quiz[]
}

interface Quiz {
  quizId: number;
  name: string;
  timeCreated: number;
  timeLastEdited: number;
  description: string
}

interface User {
  authUserId: number;
  name: string
  email: string;
  password: string;
  numSuccessfulLogins: number;
  numFailedPasswordsSinceLastLogin: number;
  userQuizzes: number[]
}

let data: Data = {

  // User Data
  users: [],

  // Quiz Data
  quizzes: []

}

// YOU SHOULDNT NEED TO MODIFY THE FUNCTIONS BELOW IN ITERATION 1

/*
let data = {

  // User Data
  users: [
    {
    authUserId: 1,
    nameFirst: 'joe',
    nameLast: 'devon',
    email: 'joe.devon@gmail.com',
    password: "test123",
    numSuccessfulLogins: 3,
    numFailedPasswordsSinceLastLogin: 1,
    userQuizzes:[1]
    }
  ],

  //Quiz Data
  quizzes: [
    {
      quizId: 1,
      name: 'My Quiz',
      timeCreated: 1683125870,
      timeLastEdited: 1683125871,
      description: 'This is my quiz',
    }
  ]

}

*/

/*
Example usage
    let store = getData()
    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Rando'] }

    names = store.names

    names.pop()
    names.push('Jake')

    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Jake'] }
    setData(store)
*/

// Use get() to access the data
function getData (): Data {
  return data
}

// Use set(newData) to pass in the entire data object, with modifications made
function setData (newData: Data) {
  data = newData
}

export { getData, setData }
