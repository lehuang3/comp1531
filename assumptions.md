1. Assuming nameFirst or nameLast strings may contain only hyphens/aphostrophes/spaces and it is still valid.
2. Assuming passwords may contain any type of special characters as long as there is at least one letter and number.
3. Assuming all argument for the function are given in the correct type.
4. Assuming autherUserId and quizId are non-negative values.
5. Names have their first letters capitalised
6. One user (1 authUserId) can have one or more quizzes (1 or more quizIds in their userQuizzes array)
7. One quiz can only be owned by one user
8. There a mechanism in place to ensure uniqueness for users, no 2 users are the same (authUserID)
9. Quizzes can only be modifed/changed by their users (who created them)
10. Descriptions/names/email address do not contain vulgar language
11. There's a mechanism in place to address when numFailedPasswordsSinceLastLogin is too large (e.g., blocking after 3 tries...)
