/** 
  * Get all of the relevant information about the current quiz.
  * @param {number} authUserId
  * @param {number} quizId
  * @returns {
*   {
  *     quizId: number, 
  *     name: string, 
  *     timeCreated: number, 
  *     timeLastEdited: number, 
  *     description: string
  *   }
  * }
**/
 function adminQuizInfo(authUserId, quizId) {
  return {
    quizId: 1,
    name: 'My Quiz',
    timeCreated:  1683125870,
    timeLastEdited: 1683125871,
    description: 'This is my quiz',  
  }
}