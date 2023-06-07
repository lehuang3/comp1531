/**
 * Provide a list of all quizzes that are owned by the currently logged in user.
 * @param {integer} authUserId - Admin user ID.
 * @returns {array object} - List of quizzes.
 */

function adminQuizList(authUserId) {
  return {
    quizzes: [
        	{
          quizId: 1,
          name: 'My Quiz',
      }
    ]
  }
}
