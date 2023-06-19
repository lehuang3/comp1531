function quizValidOwner(authUserId, quizId) {
	data = getData();
	for (let user of data) {
		if (user.authUserId === authUserId && user.userQuizzes.includes(quizId)) {
			return true;
		}
	}
	return false;
}