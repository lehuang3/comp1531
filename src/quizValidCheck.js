function quizValidCheck(quizId) {
	let data = getData();
	for (let quiz of data.quizzes) {
		if (quiz.quizId === quizId) {
			return true;
		}
	}
	return false;
}
